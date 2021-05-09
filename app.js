const gameBoard = document.querySelector("#game-board");
const scoreBoard = document.querySelector("#score");

let speed = 5;
let snakeArr = [{ x: 19, y: 19 }];
let food = { x: 7, y: 5 };
let velocity = { x: 0, y: 0 };
let gameOver = false;
let lastDrawTime = 0;
let score = 0;
const foodSound = new Audio("assets/food.mp3");
const moveSound = new Audio("assets/move.mp3");
const collideSound = new Audio("assets/gameover.mp3");

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastDrawTime) / 1000 < 1 / speed) {
    return;
  }
  lastDrawTime = ctime;
  drawGame();
}

function drawGame() {
  if (isCollide(snakeArr)) {
    collideSound.play();
    gameOver = true;
    speed = 5;
    velocity = { x: 0, y: 0 };
    snakeArr = [{ x: 19, y: 19 }];
  }

  if (hasEaten()) {
    foodSound.play();
    snakeArr.unshift({
      x: snakeArr[0].x + velocity.x,
      y: snakeArr[0].y + velocity.y,
    });
    food = {
      x: Math.floor(Math.random() * 14 + 2),
      y: Math.floor(Math.random() * 14 + 2),
    };
    speed += 0.5;
  }

  if (gameOver === false) {
    clearBoard();
    moveSnake();
    drawSnake();
    drawFood();
    updateScore();
    console.log(food.x, food.y);
  } else {
    let snake = document.querySelectorAll(".snake-part");
    snake.forEach((element) => {
      element.classList.add("game-over");
    });
  }
}

function clearBoard() {
  gameBoard.innerHTML = "";
}

function updateScore() {
  score = snakeArr.length - 1;
  scoreBoard.innerText = `Score: ${score}`;
}

function drawFood() {
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

function drawSnake() {
  snakeArr.forEach((element, index) => {
    snakePart = document.createElement("div");
    snakePart.style.gridRowStart = element.y;
    snakePart.style.gridColumnStart = element.x;
    if (index === 0) {
      snakePart.classList.add("snake-head");
    } else {
      snakePart.classList.add("snake-part");
    }
    gameBoard.appendChild(snakePart);
  });
}

function moveSnake() {
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += velocity.x;
  snakeArr[0].y += velocity.y;
}

function isCollide(snake) {
  if (
    snakeArr[0].x <= 0 ||
    snakeArr[0].x >= 20 ||
    snakeArr[0].y <= 0 ||
    snakeArr[0].y >= 20
  ) {
    return true;
  }

  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  return false;
}

function hasEaten() {
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    return true;
  } else {
    return false;
  }
}

document.addEventListener("keydown", (e) => {
  if (gameOver === true) {
    velocity.y = -1;
    gameOver = false;
  } else {
    switch (e.key) {
      case "ArrowUp":
        moveSound.play();
        if (velocity.y != 1) {
          velocity.x = 0;
          velocity.y = -1;
        }
        break;
      case "ArrowDown":
        moveSound.play();
        if (velocity.y != -1) {
          velocity.x = 0;
          velocity.y = 1;
        }
        break;
      case "ArrowLeft":
        moveSound.play();
        if (velocity.x != 1) {
          velocity.x = -1;
          velocity.y = 0;
        }
        break;
      case "ArrowRight":
        moveSound.play();
        if (velocity.x != -1) {
          velocity.x = 1;
          velocity.y = 0;
        }
        break;
    }
  }
});

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

var xDown = null;
var yDown = null;
let swipedir = "none";

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    moveSound.play();
    if (xDiff > 0) {
      /* left swipe */
      gameOver = false;
      if (velocity.x != 1) {
        velocity.x = -1;
        velocity.y = 0;
      }
    } else {
      /* right swipe */
      gameOver = false;
      if (velocity.x != -1) {
        velocity.x = 1;
        velocity.y = 0;
      }
    }
  } else {
    moveSound.play();
    if (yDiff > 0) {
      /* up swipe */
      gameOver = false;
      if (velocity.y != 1) {
        velocity.x = 0;
        velocity.y = -1;
      }
    } else {
      /* down swipe */
      gameOver = false;
      if (velocity.y != -1) {
        velocity.x = 0;
        velocity.y = 1;
      }
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

main();
