function OnMAXClick() {
  console.log('Log MAX');
}

function OnVKClick() {
  console.log('Log VK');
}

function OnMainClick() {
  console.log('Log Main');
}

const odj = {
  a: 10,
};

function GetRandomColor() {
  return '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
}

function GetRandColor(event) {
  const button = event.currentTarget;
  button.style.backgroundColor = GetRandomColor();
}

// Обработчики вешаются здесь, а не через onclick в HTML,
// поэтому код работает корректно и без inline-обработчиков в разметке.
document.querySelector('#Main')?.addEventListener('click', OnMainClick);
document.querySelector('#Max')?.addEventListener('click', OnMAXClick);
document.querySelector('#VK')?.addEventListener('click', OnVKClick);

document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', GetRandColor);
});

console.log(odj);

const sq = (a) => a * a;
console.log(sq(5));
