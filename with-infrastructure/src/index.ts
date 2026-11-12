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

function GetRandomColor(): string {
  return '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
}

function GetRandColor(event: MouseEvent): void {
  const button = event.currentTarget as HTMLElement;
  button.style.backgroundColor = GetRandomColor();
}

// Обработчики вешаются здесь, а не через onclick в HTML,
// поэтому ESLint видит, что функции используются.
document.querySelector('#Main')?.addEventListener('click', OnMainClick);
document.querySelector('#Max')?.addEventListener('click', OnMAXClick);
document.querySelector('#VK')?.addEventListener('click', OnVKClick);

document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', GetRandColor);
});

console.log(odj);

const sq: (a: number) => number = (a) => a * a;
console.log(sq(5));
