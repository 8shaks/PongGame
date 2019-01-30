var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedY = 4;
var ballSpeedX = 10;

var player1Score = 0;
var player2Score = 0;
const winningScore = 3;
var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const paddleThick = 10;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left;
  var mouseY = evt.clientY - rect.top;
  return {
    x: mouseX,
    y: mouseY
  };
}
function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}
window.onload = function() {
  if (window.innerWidth <= 1100 && window.innerHeight < 1400) {
    document.getElementById("error").innerHTML =
      "Sorry... Pong is not yet available on mobile! ";
  }
};

const startPong = () => {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  var framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);
  canvas.addEventListener("mousedown", handleMouseClick);
  canvas.addEventListener("mousemove", function(evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};
function ballReset() {
  if (player1Score >= winningScore || player2Score >= winningScore) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; //must be before ballReset()
      ballReset();
    }
  }

  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; //must be before ballReset()
      ballReset();
    }
  }

  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}
function drawEverything() {
  //next line blacks out screen
  colorRect(0, 0, canvas.width, canvas.height, "black");
  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    if (player1Score >= winningScore) {
      canvasContext.fillText("Left Player won!", 350, 200);
    } else if (player2Score >= winningScore) {
      canvasContext.fillText("Right Player won!", 350, 200);
    }

    canvasContext.fillText("click to continue", 350, 500);
    return;
  }
  drawNet();
  //this is left player paddle
  colorRect(0, paddle1Y, paddleThick, PADDLE_HEIGHT, "white");

  //this is right player paddle
  colorRect(
    canvas.width - paddleThick,
    paddle2Y,
    paddleThick,
    PADDLE_HEIGHT,
    "white"
  );

  //next line draws a ball
  colorCircle(ballX, ballY, 10, "white");

  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, 700, 100);
}
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
