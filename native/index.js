function OnMAXClick(){
    console.log('Log MAX');
}

function OnVKClick(){
    console.log('Log VK');
}

function OnMainClick(){
    console.log('Log Main');
}

const odj = {
    a: 10,
}

function GetRandomColor(){
    return '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
}

function GetRandColor(event){
    event.currentTarget.style.backgroundColor = GetRandomColor();
}
console.log(odj);