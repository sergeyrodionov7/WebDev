const CORRECT_PHONE = '+79991234567';
const CORRECT_PASSWORD = 'dodo1234';

const form = document.getElementById('loginForm');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const message = document.getElementById('message');
const maxButton = document.getElementById('Max');
const vkButton = document.getElementById('VK');

// трясём поле если ошибка
function showError(input) {
  input.classList.add('form--error');
  setTimeout(() => input.classList.remove('form--error'), 300);
}

// выводим сообщение под формой
function showMessage(text, type) {
  message.textContent = text;
  message.className = 'message message--' + type;
}

// убираем пробелы, скобки и тире из телефона
function cleanPhone(phone) {
  return phone.replace(/[\s()-]/g, '');
}

// телефон должен быть +7XXXXXXXXXX или 8XXXXXXXXXX
function validatePhone(phone) {
  return /^(\+7|8)\d{10}$/.test(phone);
}

// пароль минимум 6 символов
const validatePassword = (password) => password.length >= 6;

function onLogin(event) {
  event.preventDefault(); // чтобы страница не перезагружалась

  let phone = cleanPhone(phoneInput.value);
  const password = passwordInput.value;

  if (phone === '' || password === '') {
    showMessage('Заполните телефон и пароль', 'error');
    if (phone === '') showError(phoneInput);
    if (password === '') showError(passwordInput);
    return;
  }

  if (!validatePhone(phone)) {
    showError(phoneInput);
    showMessage('Введите телефон в формате +7 (999) 123-45-67', 'error');
    return;
  }

  if (!validatePassword(password)) {
    showError(passwordInput);
    showMessage('Пароль должен быть не короче 6 символов', 'error');
    return;
  }

  // 8 меняем на +7 чтобы сравнивать одинаково
  if (phone.startsWith('8')) {
    phone = '+7' + phone.slice(1);
  }

  if (phone !== CORRECT_PHONE || password !== CORRECT_PASSWORD) {
    showError(passwordInput);
    showMessage('Неверный телефон или пароль', 'error');
    return;
  }

  // сохраняем только телефон, пароль не храним!
  if (rememberCheckbox.checked) {
    localStorage.setItem('phone', phone);
  } else {
    localStorage.removeItem('phone');
  }

  showMessage('Добро пожаловать! 🍕', 'success');
  console.log('успешный вход', phone);
}

form.addEventListener('submit', onLogin);

maxButton.addEventListener('click', () => {
  showMessage('Вход через MAX пока не работает', 'error');
});

vkButton.addEventListener('click', () => {
  showMessage('Вход через VK пока не работает', 'error');
});

// если телефон сохранён, подставляем его при загрузке страницы
const savedPhone = localStorage.getItem('phone');
if (savedPhone) {
  phoneInput.value = savedPhone;
  rememberCheckbox.checked = true;
}
