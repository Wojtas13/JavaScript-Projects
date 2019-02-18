//do pliku
let plotno = document.querySelector('#plotno');
let plik = document.querySelector('input[type=file]');
//do suwakow
let kontrast = document.querySelector('#kontrast');
let jasnosc = document.querySelector('#jasnosc');
let nasycenie = document.querySelector('#nasycenie');
let val = document.querySelectorAll(".val");
let input = document.querySelectorAll(".slider");

//////////////////////////////////

let value = undefined;  // wartosc suwaka
let ctx = plotno.getContext('2d'); // kontekst pola canvas
let imageData;
let img = new Image(); //zdjecie
let oldValue; //stara wartosc suwaka

//pobierz zdjecie
plik.addEventListener('change', ()=>{
    let reader = new FileReader(); //objekt do czytania zawartosci plikow
    reader.onload = function(){ //zaladowanie odczytu pliku
        img.onload = function(){ //zaladowanie zdjecia
            ctx.drawImage(img, 0, 0, plotno.clientWidth, plotno.height); //rysowanie zdjecia
            let ImgData = ctx.getImageData(0, 0, plotno.width, plotno.height);
            for(let i = 0; i < 3; i++){ //przypisanie vartosci suwakom
                val[i].innerHTML = 0;
                input[i].value = 0;
            }
            //zdarzenie jasnosci
            jasnosc.addEventListener('change', () => {
                if(jasnosc.value !== oldValue){
                    ustawJasnosc(Number(jasnosc.value), ImgData);
                }             
                val[1].innerHTML = jasnosc.value;  
                oldValue = Number(jasnosc.value);
            });
            //zdarzenie kontrastu
            kontrast.addEventListener('change', () => {
                if(kontrast.value !== oldValue){
                    ustawKontrast(Number(kontrast.value), ImgData);
                }             
                val[0].innerHTML = kontrast.value;  
                oldValue = Number(kontrast.value);
            });
            //zdarzenie nasycenia
            nasycenie.addEventListener('change', () => {
                if(nasycenie.value !== oldValue){
                    ustawNasycenie(Number(nasycenie.value), ImgData);
                }             
                val[2].innerHTML = nasycenie.value;  
                oldValue = Number(nasycenie.value);
            });
        }
        img.src = reader.result; //przypisanie sciezki
    }
    reader.readAsDataURL(plik.files[0]); //pobranie sciezki
});

// suwak kontrastu
function ustawKontrast(value, ImgData){ 
    ctx.drawImage(img, 0, 0, plotno.clientWidth, plotno.height);
    imageData = ctx.getImageData(0, 0, plotno.width, plotno.height);
    factor = (259 * (value + 255)) / (255 * (259 - value)); // obliczanie koloru
    //przypisanie koloru do pikseli
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = factor * (imageData.data[i] - 128) + 128;
        imageData.data[i + 1] = factor * (imageData.data[i + 1] - 128) + 128;
        imageData.data[i + 2] = factor * (imageData.data[i + 2] - 128) + 128;
    }
    ctx.putImageData(imageData, 0, 0);
    return ImgData;
}

// suwak jasnosci
function ustawJasnosc(value, ImgData){    
    ctx.drawImage(img, 0, 0, plotno.clientWidth, plotno.height);
    imageData = ctx.getImageData(0, 0, plotno.width, plotno.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = imageData.data[i] + value * 2;
        imageData.data[i + 1] = imageData.data[i + 1] + value * 2;
        imageData.data[i + 2] = imageData.data[i + 2] + value * 2;
    }
    ctx.putImageData(imageData, 0, 0);
    return ImgData;
}

// suwak nasycenia
function ustawNasycenie(value, ImgData){
    ctx.drawImage(img, 0, 0, plotno.clientWidth, plotno.height);
    imageData = ctx.getImageData(0, 0, plotno.width, plotno.height);
    value = -(value / 100); //zamiana wartosci
    for (let i = 0; i < imageData.data.length; i += 4) {
        let r = imageData.data[i];
        let g = imageData.data[i + 1];
        let b = imageData.data[i + 2];
        let mix = 0.3086 * r + 0.6094 * g + 0.0820 * b; //wzor mieszania kolorow
        //obliczanie nowego koloru
        imageData.data[i] = (1 - value) * imageData.data[i] + value * mix;
        imageData.data[i + 1] = (1 - value) * imageData.data[i + 1] + value * mix;
        imageData.data[i + 2] = (1 - value) * imageData.data[i + 2] + value * mix;
    }
    ctx.putImageData(imageData, 0, 0);
    return ImgData;
}

//-------------------------
//zmiana kontrastu jasnosci nasycenia
// rysowanie po zdjeciu mouse events canvas