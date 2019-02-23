let canvas = document.querySelector('#canvas');
let file = document.querySelector('input[type=file]');
let contrast = document.querySelector('#contrast');
let brightness = document.querySelector('#brightness');
let saturation = document.querySelector('#saturation');
let val = document.querySelectorAll(".val");
let input = document.querySelectorAll(".slider");
let reset = document.querySelector('#reset');

//////////////////////////////////

let value = undefined;
let ctx = canvas.getContext('2d');

let imgDataCopy;
let img = new Image();
let oldValue;
let temp;

file.addEventListener('change', ()=>{
    let reader = new FileReader();
    reader.onload = function(){
        img.onload = function(){

            ctx.drawImage(img, 0, 0, canvas.clientWidth, canvas.height);
            imgDataCopy = imageDataCopy();
            setRangeValues();

            brightness.addEventListener('change', () => {

                if(brightness.value !== oldValue){
                    changeBrightness(Number(brightness.value), imageDataCopy(), imgDataCopy);
                }

                val[1].innerHTML = brightness.value;
                oldValue = Number(brightness.value);

                temp = imageDataCopy();
                changeContrast(Number(contrast.value), temp, temp);
                temp = imageDataCopy();
                changeSaturation(Number(saturation.value), temp, temp);
            });

            contrast.addEventListener('change', () => {

                if (brightness.value !== oldValue) {
                    changeBrightness(Number(brightness.value), imageDataCopy(), imgDataCopy);
                }

                val[0].innerHTML = contrast.value;
                oldValue = Number(contrast.value);

                temp = imageDataCopy();
                changeContrast(Number(contrast.value), temp, temp);
                temp = imageDataCopy();
                changeSaturation(Number(saturation.value), temp, temp);
            });

            saturation.addEventListener('change', () => {

                if (brightness.value !== oldValue) {
                    changeBrightness(Number(brightness.value), imageDataCopy(), imgDataCopy);
                }

                val[2].innerHTML = saturation.value;
                oldValue = Number(saturation.value);

                temp = imageDataCopy();
                changeContrast(Number(contrast.value), temp, temp);
                temp = imageDataCopy();
                changeSaturation(Number(saturation.value), temp, temp);
            });
        }
        img.src = reader.result;
    }
    reader.readAsDataURL(file.files[0]);
});

function setRangeValues(){

    for (let i = 0; i < 3; i++) {
        val[i].innerHTML = 0;
        input[i].value = 0;
    }
}

function imageDataCopy(){

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

reset.addEventListener('click', function(){
    brightness.value = 0;
    saturation.value = 0;
    contrast.value = 0;

    setRangeValues();
    if(imgDataCopy != null)
        ctx.putImageData(imgDataCopy, 0, 0);
});


function changeContrast(value, imgData, imgDataCopy){

    factor = (259 * (value + 255)) / (255 * (259 - value));

    for (let i = 0; i < imgDataCopy.data.length; i += 4) {
        imgData.data[i] = factor * (imgDataCopy.data[i] - 128) + 128;
        imgData.data[i + 1] = factor * (imgDataCopy.data[i + 1] - 128) + 128;
        imgData.data[i + 2] = factor * (imgDataCopy.data[i + 2] - 128) + 128;
    }
    ctx.putImageData(imgData, 0, 0);
}

function changeBrightness(value, imgData, imgDataCopy){

    for (let i = 0; i < imgDataCopy.data.length; i += 4) {
        imgData.data[i] = imgDataCopy.data[i] + value * 2;
        imgData.data[i + 1] = imgDataCopy.data[i + 1] + value * 2;
        imgData.data[i + 2] = imgDataCopy.data[i + 2] + value * 2;
    }
    ctx.putImageData(imgData, 0, 0);
}

function changeSaturation(value, imgData, imgDataCopy){
    value = -(value / 100);

    for (let i = 0; i < imgDataCopy.data.length; i += 4) {

        let r = imgDataCopy.data[i];
        let g = imgDataCopy.data[i + 1];
        let b = imgDataCopy.data[i + 2];
        let mix = 0.3086 * r + 0.6094 * g + 0.0820 * b;

        imgData.data[i] = (1 - value) * imgDataCopy.data[i] + value * mix;
        imgData.data[i + 1] = (1 - value) * imgDataCopy.data[i + 1] + value * mix;
        imgData.data[i + 2] = (1 - value) * imgDataCopy.data[i + 2] + value * mix;
    }
    ctx.putImageData(imgData, 0, 0);
}
