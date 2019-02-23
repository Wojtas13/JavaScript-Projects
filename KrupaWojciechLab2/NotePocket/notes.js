class Tasks{
    constructor(title, desc, date){
        this.title = title;
        this.desc = desc;
        this.date = date;
    }
}

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

function createTaskHTML(title, desc, date) {
    return '<div class="single-task">' +
        '<input type="text" value="' + title + '" class="task-title">' +
        '<span id="task-date">' + date + '</span>' +
        '<input type="text" value="' + desc + '" class="task-text">' +
        '<button class="isPinned"><i class="fas fa-thumbtack"></i></button>' +
        '</div>';
}

function addNewTask(title, desc, date){
    let taskLi = document.createElement('li');
    taskLi.innerHTML = this.createTaskHTML(title, desc, date);

    //Add task to DOM
    Tasks.tasksList.appendChild(taskLi);
}

function deleteTask(task){
    let liToDelete = task.closest('li');
    task.closest('ul').removeChild(liToDelete);
}

function bindAddTaskEvents() {
    Tasks.newTaskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let title = this.querySelector('#taskTitle').value;
        let desc = this.querySelector('#taskText').value;

        if (title) {
            localStorage.setItem("tasks", JSON.stringify(createTaskHTML(title, desc, getDate())));
            loadTask();
        }
    });
}
function loadTask(task) {
    let localData = JSON.parse(localStorage.getItem("tasks"));
    Tasks.tasksList.innerHTML += localData;
}

Tasks.newTaskForm = document.querySelector("#new-task-container form");
Tasks.tasksList = document.querySelector(".tasks-container ul");

document.addEventListener('DOMContentLoaded', function(){
    bindAddTaskEvents();
    loadTask();
});

function saveTask(){
    localStorage.setItem('tasks', JSON.stringify());
}
function loadTask() {
    let taskArray = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    let task;
    if(taskArray.length != 0){
        for (let i = 0; i < taskArray.length; i++) {
            task = new Tasks(taskArray[i][0], taskArray[i][1], taskArray[i][2]);
        }
    }
    return task;
}

