//Values
let element,
    pointX,
    pointY,
    addNoteBtn,
    saveNote,
    deleteNote,
    loadNotes,
    localStorageTest,
    onDragEnd,
    onDragStart,
    getNoteObj,
    createNote,
    addNoteBtnClick,
    init;

// Getting Date
function getDate() {
    let dateTime = new Date();
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let day = "0" + dateTime.getDate();
    let month = months[dateTime.getMonth()];
    let year = dateTime.getFullYear();

    let hours = "0" + dateTime.getHours();
    let minutes = "0" + dateTime.getMinutes();
    let seconds = "0" + dateTime.getSeconds();

    let fullTime = hours.substr(-2) + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    let fullDate = day.substr(-2) + "-" + month + "-" + year;

    let todayDate = fullTime + ", " + fullDate;

    return todayDate;
}

// Drag move event
 let onDrag = function(e) {
    if (!element) {
        return;
    }
    let posX = e.clientX + pointX,
        posY = e.clientY + pointY;

    if (posX < 0)
        posX = 0;
    if (posY < 0)
        posY = 0;

    element.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";
};

// Drop event
onDragEnd = function (){
    element = null;
    pointX = null;
    pointY = null;
};

// Drag start function
onDragStart = function (e){
    let clientRect;
    if (e.target.className.indexOf('bar') === -1) {
        return;
    }
    element = this;

    clientRect = element.getBoundingClientRect();

    pointX = clientRect.left - e.clientX;
    pointY = clientRect.top - e.clientY;
};

// Getting note description
getNoteObj = function (element){
    let textarea = element.querySelector('textarea');

    return {
        content: textarea.value,
        id: element.id,
        randomPositionNote: element.style.transform,
        randomBackgroundColor: randomColorBG(),
        date: getDate(),
        textarea: {
            width: textarea.style.width,
            height: textarea.style.height,
        }
    };
};

addNoteBtnClick = function(){
    createNote();
}

function randomColorBG() {
    let x = Math.floor(Math.random() * 256);
    let y = Math.floor(Math.random() * 256);
    let z = Math.floor(Math.random() * 256);

    return "rgb(" + x + "," + y + "," + z + ")";
}
// Note creation
createNote = function (options) {
    let noteElement = document.createElement('div'),
        barElement = document.createElement('div'),
        textAreaElement = document.createElement('textarea'),
        dateElement = document.createElement('div'),
        saveBtnElement = document.createElement('button'),
        deleteBtnElement = document.createElement('button'),
        onSave,
        onDelete,
        posNumber = 400,
        noteConf = options || {
            content: '',
            id: "note_" + new Date().getMilliseconds(),
            randomPositionNote: "translateX(" + (Math.random() * posNumber + 200) + "px) translateY(" + (Math.random() * posNumber + 200) + "px)",
            randomBackgroundColor: randomColorBG(),
            date: getDate()
        };




    //Deleting note
    onDelete = function (){
        deleteNote(getNoteObj(noteElement));
        document.querySelector('.tasks-container ul').removeChild(noteElement);
    };

    //Saving note
    onSave = function () {
        saveNote(getNoteObj(noteElement));
    };

    if(noteConf.textarea){
        textAreaElement.style.width = noteConf.textarea.width;
        textAreaElement.style.height = noteConf.textarea.height;
        textAreaElement.value = noteConf.content;
        textAreaElement.style.resize = "none";
    }

    noteElement.id = noteConf.id;
    textAreaElement.value = noteConf.content;
    dateElement.textContent = noteConf.date;

    //Save button
    saveBtnElement.classList.add('saveBtn');
    saveBtnElement.addEventListener('click', onSave);

    //Delete button
    deleteBtnElement.classList.add('deleteBtn');
    deleteBtnElement.addEventListener('click', onDelete);

    let randomPositionNote = noteConf.randomPositionNote;
    let randomBackgroundColor = noteConf.randomBackgroundColor;

    //Note window adding
    noteElement.style.transform = randomPositionNote;
    noteElement.style.backgroundColor = randomBackgroundColor;
    barElement.classList.add('bar');
    noteElement.classList.add('stickerNote');
    noteElement.classList.add('date');

    barElement.appendChild(saveBtnElement);
    barElement.appendChild(deleteBtnElement);

    noteElement.appendChild(barElement);
    noteElement.appendChild(dateElement);
    noteElement.appendChild(textAreaElement);


    noteElement.addEventListener('mousedown', onDragStart);

    //Adding Note to DOM
    document.querySelector('.tasks-container ul').appendChild(noteElement);
};

// localStorage Test
localStorageTest = function (){
    try{
        localStorage.setItem('notes', "test");
        localStorage.removeItem('notes');
        return true;
    }
    catch (e){
        return false;
    }
};

init = function (){

    if (!localStorageTest()){
        let warning = "Saving goes wrong. We are sorry.";

        //Message when saveNote goes wrong
        saveNote = function (note) {
            console.warn(warning);
        };

        //Message when deleteNote goes wrong
        deleteNote = function () {
            console.warn(message);
        };
    }
    else{

        saveNote = function (note) {
            //Saving notes here
            localStorage.setItem(note.id, JSON.stringify(note));
        };

        deleteNote = function (note) {
            //Deleting note here
            localStorage.removeItem(note.id);
        };

        loadNotes = function () {
            //Loading notes here
            for (let i = 0; i < localStorage.length; i++) {
                let noteObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
                console.log(noteObj);
                createNote(noteObj);
            }
        };

        loadNotes();
    }
    addNoteBtn = document.querySelector('#addNoteBtn');
    addNoteBtn.addEventListener('click', addNoteBtnClick);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('mousemove', onDrag);
}

init();


