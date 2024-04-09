//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physical

let velocityX = -2;
let velocityY = 4;
let gravity = 0.2;

let gameOver = false;
let score = 0;

window.onload = () => {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //2d context

  //load bird images
  birdImg = new Image();
  birdImg.src = "./images/flappybird.png";
  birdImg.onload = () => {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./images/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./images/bottompipe.png";
  requestAnimationFrame(Update);
  setInterval(PlacePipes, 1500); //every 1.5 seconds
  document.addEventListener("keydown", MoveBird);
};

function Update() {
  requestAnimationFrame(Update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (DetectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  //score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    let gameOverTextWidth = context.measureText("GAME OVER").width;
    let gameOverTextHeight = 45;
    context.fillStyle = "red";
    let gameOverTextX = (boardWidth - gameOverTextWidth) / 2;
    let gameOverTextY = (boardHeight + gameOverTextHeight) / 2;
    context.fillText("GAME OVER", gameOverTextX, gameOverTextY);
    let scoreText = "Skorunuz: " + score;
    let scoreTextWidth = context.measureText(scoreText).width;
    let scoreTextX = (boardWidth - scoreTextWidth) / 2;
    let scoreTextY = gameOverTextY + gameOverTextHeight + 30;
    context.fillStyle = "white";
    context.font = "25px sans-serif";
    context.fillText(scoreText, scoreTextX, scoreTextY);
    context.fillText(scoreText, scoreTextX, scoreTextY);
  }
}

function PlacePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function MoveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    //jump
    velocityY = -6;

    //reset game
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

function DetectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
