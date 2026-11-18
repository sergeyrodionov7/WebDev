export interface LoginData {
  phone: string;
  password: string;
}

export type MessageType = 'error' | 'success';

// Убираем символы оформления, но не буквы и другие ошибки ввода.
export function cleanPhone(phone: string): string {
  return phone.replace(/[\s()-]/g, '');
}

export function normalizePhone(phone: string): string {
  const cleaned = cleanPhone(phone);
  if (cleaned.startsWith('8')) {
    return '+7' + cleaned.slice(1);
  }
  return cleaned;
}

export function validatePhone(phone: string): boolean {
  return /^(\+7|8)\d{10}$/.test(cleanPhone(phone));
}

export const validatePassword = (password: string): boolean => password.length >= 6;

// Это учебная проверка. В настоящем приложении пароль проверяет сервер.
export function checkCredentials(data: LoginData): boolean {
  return normalizePhone(data.phone) === '+79991234567' && data.password === 'dodo1234';
}

export function initLogin(): void {
  const form = document.getElementById('loginForm');
  const phoneInput = document.getElementById('phone');
  const passwordInput = document.getElementById('password');
  const rememberCheckbox = document.getElementById('remember');
  const message = document.getElementById('message');
  const maxButton = document.getElementById('Max');
  const vkButton = document.getElementById('VK');

  if (
    !(form instanceof HTMLFormElement) ||
    !(phoneInput instanceof HTMLInputElement) ||
    !(passwordInput instanceof HTMLInputElement) ||
    !(rememberCheckbox instanceof HTMLInputElement) ||
    !(message instanceof HTMLElement) ||
    !(maxButton instanceof HTMLButtonElement) ||
    !(vkButton instanceof HTMLButtonElement)
  ) {
    throw new Error('Не найдены элементы формы входа. Проверьте index.html.');
  }

  function showError(input: HTMLInputElement): void {
    input.classList.add('form--error');
    input.setAttribute('aria-invalid', 'true');
    setTimeout(() => input.classList.remove('form--error'), 300);
  }

  const showMessage = (text: string, type: MessageType): void => {
    message.textContent = text;
    message.className = 'message message--' + type;
  };

  const onLogin = (event: SubmitEvent): void => {
    event.preventDefault();
    phoneInput.removeAttribute('aria-invalid');
    passwordInput.removeAttribute('aria-invalid');

    const data: LoginData = {
      phone: cleanPhone(phoneInput.value),
      password: passwordInput.value,
    };

    if (data.phone === '' || data.password === '') {
      showMessage('Заполните телефон и пароль', 'error');
      if (data.phone === '') showError(phoneInput);
      if (data.password === '') showError(passwordInput);
      return;
    }

    if (!validatePhone(data.phone)) {
      showError(phoneInput);
      showMessage('Введите телефон в формате +7 (999) 123-45-67', 'error');
      return;
    }

    if (!validatePassword(data.password)) {
      showError(passwordInput);
      showMessage('Пароль должен быть не короче 6 символов', 'error');
      return;
    }

    if (!checkCredentials(data)) {
      showError(passwordInput);
      showMessage('Неверный телефон или пароль', 'error');
      return;
    }

    // Сохраняем только телефон. Пароль остаётся только в поле формы.
    try {
      if (rememberCheckbox.checked) {
        localStorage.setItem('phone', normalizePhone(data.phone));
      } else {
        localStorage.removeItem('phone');
      }
    } catch {
      showMessage('Вход выполнен, но браузер запретил запоминание телефона', 'success');
      return;
    }

    showMessage('Добро пожаловать! 🍕', 'success');
  };

  form.addEventListener('submit', onLogin);

  maxButton.addEventListener('click', () => {
    showMessage('Вход через MAX пока не работает', 'error');
  });

  vkButton.addEventListener('click', () => {
    showMessage('Вход через VK пока не работает', 'error');
  });

  try {
    const savedPhone = localStorage.getItem('phone');
    if (savedPhone) {
      phoneInput.value = savedPhone;
      rememberCheckbox.checked = true;
    }
  } catch {
    showMessage('Браузер запретил хранение данных. Войти можно без запоминания.', 'error');
  }
}

// Скрипт подключён как модуль, поэтому разметка уже загружена.
if (document.getElementById('loginForm')) {
  initLogin();
}
