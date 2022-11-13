let inputDir = { x: 0, y: 0 };

const foodSound = new Audio("./music/swallow.mp3");
const directionSound = new Audio("./music/direction_change.mp3");
const backgroundSound = new Audio("./music/backgroundMusic.mp3");
const gameOverSound = new Audio("./music/game_over.mp3");

highScoreBox = document.querySelector(".highScore");

//render speed
let speed = 5;
let score = 0;
let level = 0;
let lastPaintTime = 0;
let snakeArr = [
  {
    x: 10,
    y: 10,
  },
];

let food = {
  x: 10,
  y: 6,
};
//gameOverSound.play();

//Game functions
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  {
    lastPaintTime = ctime;
    //console.log(ctime);
    gameEngine();
  }
}

function isCollide(snake) {
  //snake bumping into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  //walls
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }
  return false;
}

function gameEngine() {
  //updating snake array
  backgroundSound.play();
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    backgroundSound.pause();
    inputDir = { x: 0, y: 0 };
    score = 0;
    speed = 0;
    scoreBoard.innerHTML = "SCORE: " + score;
    alert("Game over, press any key to play again: ");

    snakeArr = [
      {
        x: 10,
        y: 10,
      },
    ];
    //gameEngine();
    location.reload();
    backgroundSound.play();
  }

  //if food eaten increment score and regenerate food
  if (snakeArr[0].y == food.y && snakeArr[0].x == food.x) {
    foodSound.play();
    scoreBoard = document.querySelector(".score_board");
    score += 1;
    if (score % 2 == 0) {
      speed += 0.5;
      level += 1;
    }

    const level_box = document.querySelector(".level");
    level_box.innerHTML = "LEVEL: " + level;
    if (score > highScoreVal) {
      highScoreVal = score;
      localStorage.setItem("hiscore", JSON.stringify(score));
      highScoreBox.innerHTML = "HIGH SCORE: " + highScoreVal;
    }
    scoreBoard.innerHTML = "SCORE: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 16;

    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };

    for (let i = snakeArr.length - 1; i >= 0; i--) {
      if (snakeArr[0].x === food.x || snakeArr[0].y === food.y) {
        food = {
          x: Math.round(a + (b - a) * Math.random()),
          y: Math.round(a + (b - a) * Math.random()),
        };
        return;
      }
    }
    //console.log(food);
  }

  //Moving the snake
  //starting from second last
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  //updating snake and food
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });
  //Display food

  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

//rendering screen

let hiscore = localStorage.getItem("hiscore");
let highScoreVal = 0;
if (hiscore === null) {
  localStorage.setItem("hiscore", JSON.stringify(highScoreVal));
} else {
  highScoreVal = JSON.parse(highScoreVal);

  highScoreBox.innerHTML = "HIGH SCORE: " + hiscore;
  highScoreVal = hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  //console.log(e);
  inputDir = { x: 0, y: 1 }; //starting the game
  directionSound.play();
  switch (e.key) {
    case "ArrowUp":
      console.log("ArrowUp");
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowDown":
      console.log("ArrowD");
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case "ArrowRight":
      console.log("ArrowR");
      inputDir.x = 1;
      inputDir.y = 0;
      break;
    case "ArrowLeft":
      console.log("ArrowL");
      inputDir.x = -1;
      inputDir.y = 0;
      break;

    default:
      break;
  }
});
