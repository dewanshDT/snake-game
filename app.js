const gameBoard = document.querySelector("#game-board");

let speed = 5;
let snakeArr = [{ x: 19, y: 19 }];
let food = { x: 7, y: 5 };
let velocity = { x: 0, y: 0 };
let gameOver = false;
let lastDrawTime = 0;

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
    gameOver = true;
    speed = 5;
    velocity = { x: 0, y: 0 };
    snakeArr = [{ x: 19, y: 19 }];
  }

  if (hasEaten()) {
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
        if (velocity.y != 1) {
          velocity.x = 0;
          velocity.y = -1;
        }
        break;
      case "ArrowDown":
        if (velocity.y != -1) {
          velocity.x = 0;
          velocity.y = 1;
        }
        break;
      case "ArrowLeft":
        if (velocity.x != 1) {
          velocity.x = -1;
          velocity.y = 0;
        }
        break;
      case "ArrowRight":
        if (velocity.x != -1) {
          velocity.x = 1;
          velocity.y = 0;
        }
        break;
    }
  }
});


// Touch controls
function swipedetect(el, callback){
  
  var touchsurface = el,
  swipedir,
  startX,
  startY,
  distX,
  distY,
  threshold = 150, //required min distance traveled to be considered swipe
  restraint = 100, // maximum distance allowed at the same time in perpendicular direction
  allowedTime = 300, // maximum time allowed to travel that distance
  elapsedTime,
  startTime,
  handleswipe = callback || function(swipedir){}

  touchsurface.addEventListener('touchstart', function(e){
      var touchobj = e.changedTouches[0]
      swipedir = 'none'
      dist = 0
      startX = touchobj.pageX
      startY = touchobj.pageY
      startTime = new Date().getTime() // record time when finger first makes contact with surface
      e.preventDefault()
  }, false)

  touchsurface.addEventListener('touchmove', function(e){
      e.preventDefault() // prevent scrolling when inside DIV
  }, false)

  touchsurface.addEventListener('touchend', function(e){
      var touchobj = e.changedTouches[0]
      distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime // get time elapsed
      if (elapsedTime <= allowedTime){ // first condition for awipe met
          if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
              swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
          }
          else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
              swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
          }
      }
      handleswipe(swipedir)
      e.preventDefault()
  }, false)
}

//USAGE:

var el = document.getElementById('swipezone');
swipedetect(el, function(swipedir){
  // swipedir contains either "none", "left", "right", "top", or "down"
  switch (swipedir) {
    case "top":
      gameOver = false;
      if (velocity.y != 1) {
        velocity.x = 0;
        velocity.y = -1;
      }
      break;
    case "down":
      gameOver = false;
      if (velocity.y != -1) {
        velocity.x = 0;
        velocity.y = 1;
      }
      break;
    case "left":
      gameOver = false;
      if (velocity.x != 1) {
        velocity.x = -1;
        velocity.y = 0;
      }
      break;
    case "right":
      gameOver = false;
      if (velocity.x != -1) {
        velocity.x = 1;
        velocity.y = 0;
      }
      break;
  }
});

main();
