import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import html from './index.html?raw';
import {
  checkCredentials,
  cleanPhone,
  normalizePhone,
  validatePassword,
  validatePhone,
  initLogin,
} from './index';

describe('Телефон', () => {
  it('убирает пробелы, скобки и тире', () => {
    expect(cleanPhone('+7 (999) 123-45-67')).toBe('+79991234567');
  });

  it('приводит номер с восьмёркой к +7', () => {
    expect(normalizePhone('8 (999) 123-45-67')).toBe('+79991234567');
    expect(normalizePhone('+79991234567')).toBe('+79991234567');
  });

  it.each(['+79991234567', '89991234567', '+7 (999) 123-45-67'])('принимает номер %s', (phone) => {
    expect(validatePhone(phone)).toBe(true);
  });

  it.each(['', '+7999', '+799912345678', '79991234567', '+7999123456a', '+19991234567'])(
    'отклоняет неверный номер %s',
    (phone) => {
      expect(validatePhone(phone)).toBe(false);
    },
  );
});

describe('Пароль и проверка данных', () => {
  it('требует не меньше шести символов', () => {
    expect(validatePassword('')).toBe(false);
    expect(validatePassword('12345')).toBe(false);
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('dodo1234')).toBe(true);
  });

  it('принимает правильные данные с обоими форматами телефона', () => {
    expect(checkCredentials({ phone: '+7 (999) 123-45-67', password: 'dodo1234' })).toBe(true);
    expect(checkCredentials({ phone: '89991234567', password: 'dodo1234' })).toBe(true);
  });

  it('отклоняет неправильный пароль или другой телефон', () => {
    expect(checkCredentials({ phone: '+79991234567', password: 'wrong123' })).toBe(false);
    expect(checkCredentials({ phone: '+79991234568', password: 'dodo1234' })).toBe(false);
  });
});

function getInput(id: string): HTMLInputElement {
  const input = document.getElementById(id);
  if (!(input instanceof HTMLInputElement)) {
    throw new Error('Не найдено поле ' + id);
  }
  return input;
}

function submit(phone: string, password: string): void {
  getInput('phone').value = phone;
  getInput('password').value = password;
  const form = document.getElementById('loginForm');
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('Не найдена форма');
  }
  form.requestSubmit();
}

describe('Форма входа', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    document.documentElement.innerHTML = html;
    initLogin();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('просит заполнить пустые поля', () => {
    submit('', '');
    expect(document.getElementById('message')?.textContent).toBe('Заполните телефон и пароль');
    expect(getInput('phone').getAttribute('aria-invalid')).toBe('true');
    expect(getInput('password').getAttribute('aria-invalid')).toBe('true');
  });

  it('объясняет ошибку в телефоне', () => {
    submit('123', 'dodo1234');
    expect(document.getElementById('message')?.textContent).toContain('Введите телефон');
    expect(getInput('phone').getAttribute('aria-invalid')).toBe('true');
  });

  it('объясняет ограничение длины пароля', () => {
    submit('+79991234567', '12345');
    expect(document.getElementById('message')?.textContent).toContain('не короче 6 символов');
  });

  it('не пускает с неправильным паролем и не сохраняет телефон', () => {
    getInput('remember').checked = true;
    submit('+79991234567', 'wrong123');
    expect(document.getElementById('message')?.textContent).toBe('Неверный телефон или пароль');
    expect(localStorage.getItem('phone')).toBeNull();
  });

  it('показывает успешный вход и убирает предыдущую ошибку', () => {
    submit('', '');
    submit('+79991234567', 'dodo1234');
    expect(document.getElementById('message')?.textContent).toBe('Добро пожаловать! 🍕');
    expect(getInput('phone').hasAttribute('aria-invalid')).toBe(false);
    expect(getInput('password').hasAttribute('aria-invalid')).toBe(false);
  });

  it('запоминает нормализованный телефон, но не пароль', () => {
    getInput('remember').checked = true;
    submit('8 (999) 123-45-67', 'dodo1234');
    expect(localStorage.getItem('phone')).toBe('+79991234567');
    expect(localStorage.length).toBe(1);
    expect(localStorage.getItem('password')).toBeNull();
  });

  it('восстанавливает телефон и галочку после повторного открытия формы', () => {
    getInput('remember').checked = true;
    submit('+79991234567', 'dodo1234');
    document.documentElement.innerHTML = html;
    initLogin();
    expect(getInput('phone').value).toBe('+79991234567');
    expect(getInput('remember').checked).toBe(true);
    expect(getInput('password').value).toBe('');
  });

  it('удаляет сохранённый телефон при входе без галочки', () => {
    localStorage.setItem('phone', '+79991234567');
    getInput('remember').checked = false;
    submit('+79991234567', 'dodo1234');
    expect(localStorage.getItem('phone')).toBeNull();
  });

  it.each(['Max', 'VK'])('показывает заглушку соцсети %s', (id) => {
    document.getElementById(id)?.click();
    expect(document.getElementById('message')?.textContent).toContain('пока не работает');
    expect(localStorage.length).toBe(0);
  });

  it('снимает класс анимации через 300 мс', () => {
    submit('', '');
    expect(getInput('phone').classList.contains('form--error')).toBe(true);
    vi.advanceTimersByTime(300);
    expect(getInput('phone').classList.contains('form--error')).toBe(false);
  });

  it('позволяет войти, если браузер запретил запись в хранилище', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Хранилище недоступно');
    });
    getInput('remember').checked = true;
    submit('+79991234567', 'dodo1234');
    expect(document.getElementById('message')?.textContent).toContain('Вход выполнен');
  });

  it('подключает обработчики даже при запрете чтения хранилища', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Хранилище недоступно');
    });
    document.documentElement.innerHTML = html;
    expect(() => initLogin()).not.toThrow();
    expect(document.getElementById('message')?.textContent).toContain('без запоминания');
    submit('+79991234567', 'dodo1234');
    expect(document.getElementById('message')?.textContent).toBe('Добро пожаловать! 🍕');
  });

  it('сообщает о сломанной разметке при отсутствии обязательного поля', () => {
    document.getElementById('phone')?.remove();
    expect(() => initLogin()).toThrow('Не найдены элементы формы входа');
  });
});
