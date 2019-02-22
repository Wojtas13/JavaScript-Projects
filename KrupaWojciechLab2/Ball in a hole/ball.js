let canvas = document.getElementById('canvasArea');
let timeDiv = document.getElementById('time');

canvas.width = 800;
canvas.height = 600;

let ctx = canvas.getContext("2d");

//Mobile device movement
window.addEventListener('devicemotion', function (e) {
    let devAcc = e.accelerationIncludingGravity;

    velocityVec.xVec += devAcc.x / 20;
    velocityVec.yVec += devAcc.y / 20;
});

//PC Keyboard movement
window.addEventListener('keydown', function (e) {

    console.log("Your key is: " + e.keyCode)

    e.keyCode == 38 ? ball.y -= 10 : 0
    e.keyCode == 40 ? ball.y += 10 : 0
    e.keyCode == 37 ? ball.x -= 10 : 0
    e.keyCode == 39 ? ball.x += 10 : 0

    e.keyCode == 8 ? clearArea() : 0

});

let ball = {
    x: 50,
    y: 50,
    r: 10,
    vel: 0,
    color: '#575757'
}

let velocityVec = {
    xVec: 0,
    yVec: 0
}

let finishHole = {
    x: 750,
    y: 550,
    r: 10,
    color: '#0099ff'
}

let dangerHoles = [];
let i = 0;

//Time variable
let gameTime = Date.now();
let timeString;
let timeDuration;
let time;

function ballRender(ball, ctx) {
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function gameRender() {
    ctx.fillStyle = '#49d0cb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();

    ballRender(ball, ctx);
    ballRender(finishHole, ctx);

    for (let i = 0; i < dangerHoles.length; i++) {
        ballRender(dangerHoles[i], ctx);
    }
}

function createDangerBalls() {
    while (i < 50) {
        let rndX = Math.floor((Math.random() * 650) + 80);
        let rndY = Math.floor((Math.random() * 460) + 80);

        dangerHoles[i] = { x: rndX, y: rndY, r: 30, color: '#c9290a' };
        i++;
    }
}

function ballMovement() {
    let xMove = velocityVec.xVec;
    let yMove = velocityVec.yVec;

    ball.y += yMove;
    ball.x += xMove * -1;
}

function wallCollision() {

    if (ball.x + ball.r >= canvas.width || ball.x - ball.r <= 0) {
        velocityVec.xVec *= -1;
    }

    if (ball.y + ball.r >= canvas.height || ball.y - ball.r <= 0) {
        velocityVec.yVec *= -1;
    }
}

function ballCollision(ballA, ballB) {

    let dx = ballA.x - ballB.x;
    let dy = ballA.y - ballB.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ballA.r + ballB.r)
        return true;
}

function dangerBallCollision() {
    for (let i = 0; i < dangerHoles.length; i++) {

        let temp = dangerHoles[i]

        if (ballCollision(temp, ball)) {
            gameOver();
        }
    }
}

function finishHoleCollision() {
    if (ballCollision(ball, finishHole)) {
        winGame();
    }
}

function resetGame() {
    ball.x = 50;
    ball.y = 50;

    velocityVec.xVec = 0;
    velocityVec.yVec = 0;

    gameTime = Date.now();
}

function winGame() {
    alert("You won. Congratulations. You're time: " + toString(timeDuration));
    resetGame();
}

function gameOver() {
    alert("You are touch a danger zone. Try again.");
    resetGame();
}

function gameTimer() {
    gameTimeLimit = 90000; //time in milliseconds
    timeDuration = Date.now() - gameTime;
    time = gameTimeLimit - timeDuration;
    timeString = toString(time);

    timeDiv.innerHTML = timeString;
}

setInterval(function () {
    gameTimer();

}, 1)

function toString(time) {
    function zeroValid(i) {
        if (i < 10 && i >= 0)
            return "0" + i;
        else
            return i;
    }

    let milliseconds = time % 1000;
    time = Math.floor(time / 1000);
    let seconds = time % 60;
    time = Math.floor(time / 60);
    let minutes = time % 60;

    let timeValidated = zeroValid(minutes) + ":" + zeroValid(seconds) + ":" + milliseconds;

    return timeValidated;
}

function timeEndCheck() {
    if (time <= 0) {
        alert("Time over. Try again.");
        resetGame();
    }
}

function loadGame() {

    createDangerBalls();
    wallCollision();
    finishHoleCollision();
    dangerBallCollision();

    timeEndCheck();

    ballMovement();
    gameRender();

    requestAnimationFrame(loadGame);
}