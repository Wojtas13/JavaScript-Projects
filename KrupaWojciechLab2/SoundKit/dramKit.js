document.addEventListener("DOMContentLoaded", appStart);
//dzwieki perkusji
const sounds = {
    97: 'boom',
    115: "clap",
    100: "hihat",
    102: "kick",
    103: "openhat",
    104: "ride",
    106: "snare",
    107: "tink",
    108:"tom"
}

//kanaly
let channel1 =[];
let channel2 =[];
let channel3 =[];
let channel4 =[];

//czy wcisniety
let isRecording = false;
let isChannel1 = false;
let isChannel2 = false;
let isChannel3 = false;
let isChannel4 = false;

let recStart = null;

function appStart() {
    window.addEventListener('keypress', playSound);
    //nagrywanie
    document.querySelector('#rec').addEventListener('click', (e)=>{
        isRecording = !isRecording;
        //zapisuje czas
        recStart = Date.now();
        e.target.innerHTML = isRecording ? 'Zatrzymaj' : 'Nagrywaj';
    });
    //podpiecie kanalow
    document.querySelector('#channel1').addEventListener('click', (e)=>{
        isChannel1 = !isChannel1;
        changeColor(e, isChannel1);
    });
    document.querySelector('#channel2').addEventListener('click', (e)=>{
        isChannel2 = !isChannel2;
        changeColor(e, isChannel2);
    });
    document.querySelector('#channel3').addEventListener('click', (e)=>{
        isChannel3 = !isChannel3;
        changeColor(e, isChannel3);
    });
    document.querySelector('#channel4').addEventListener('click', (e)=>{
        isChannel4 = !isChannel4;
        changeColor(e, isChannel4);
    });
    //przyciski odtwarzaj i wyczysc
    document.querySelector('#play').addEventListener('click', playMusic);
    document.querySelector('#clear').addEventListener('click', clearMusic);
}

//zmienia kolor po wcisnieciu wybranego kanalu
function changeColor(el, isClicked) {
    if (isClicked) {
        el.target.style.color = "#35cac5";
        el.target.style.backgroundColor = "#202020";
    } else {
        el.target.style.color = "#a6a6a6";
        el.target.style.backgroundColor = "#3f3f3f";
    }
}
//czyszczenie tablic
function clearMusic(){
        channel1.splice(0,channel1.length);
        channel2.splice(0,channel2.length);
        channel3.splice(0,channel3.length);
        channel4.splice(0,channel4.length);
}
//odtworzenie dzwiekow z tablicy
function playMusic() {
    channel1.forEach(sound =>{
        setTimeout(
            () => {
                //pobranie nazw dzwiekow
                audioDOM = document.querySelector(`#${sound.sound}`);
                //zerowanie czasu
                audioDOM.currentTime = 0;
                //odtwarzanie
                audioDOM.play();
                }
            ,sound.time //odczytanie czasu z tablicy
        )},
    )
    channel2.forEach(sound =>{
        setTimeout(
            () => {
                audioDOM = document.querySelector(`#${sound.sound}`);
                audioDOM.currentTime = 0;
                audioDOM.play();
                }
            ,sound.time
        )},
    )
    channel3.forEach(sound =>{
        setTimeout(
            () => {
                audioDOM = document.querySelector(`#${sound.sound}`);
                audioDOM.currentTime = 0;
                audioDOM.play();
                }
            ,sound.time
        )},
    )
    channel4.forEach(sound =>{
        setTimeout(
            () => {
                audioDOM = document.querySelector(`#${sound.sound}`);
                audioDOM.currentTime = 0;
                audioDOM.play();
            }
        , sound.time
    )}
)}

function playSound(e) {
    //pobierz nazwe dzwieku
    const soundName = sounds[e.charCode];
    //pobierz uchwyt
    audioDOM = document.querySelector(`#${soundName}`);
    //otworz dzwiek
    audioDOM.currentTime = 0;
    audioDOM.play();
    //wybierz kanal
    //zapisz dzwiek w tablicy
    if(isChannel1){
        if(isRecording){
            channel1.push({
                sound: soundName,
                time: Date.now() - recStart
            });
        }
    }
    if(isChannel2){
        if(isRecording){
            channel2.push({
                sound: soundName,
                time: Date.now() - recStart
            });
        }
    }
    if(isChannel3){
        if(isRecording){
            channel3.push({
                sound: soundName,
                time: Date.now() - recStart
            });
        }
    }
    if(isChannel4){
        if(isRecording){
            channel4.push({
                sound: soundName,
                time: Date.now() - recStart
            });
        }
    }
}
//mapa przypisuje wartosci do klucza
/*
const s = Map()
s.setItem(true, 'prawda');
*/