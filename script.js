//Define Html Elements

const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
//Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0 ;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

//draw game map , snake , food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

//draw snake

function drawSnake() {
  snake.forEach((segment , index) => {
    const snakeElement = createGameElement("div", "snake snake-dir-right");
    setPosition(snakeElement, segment);
    if (index === 0) {
        snakeElement.classList.add(`snake-dir-${direction}`);
      }
    board.appendChild(snakeElement);
  });
}



//Create a snake or food cube/div

function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  //return
  return element;
}

// Set the position of snake or food

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// draw Food

function drawFood() {
    if(gameStarted){
        const foodElement = createGameElement("div", "food");
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
  
}
// generate food positions randomly
function generateFood() {
    let foodPosition;
    let isOnSnake;
  
    do {
      const x = Math.floor(Math.random() * gridSize) + 1;
      const y = Math.floor(Math.random() * gridSize) + 1;
      foodPosition = { x, y };
  
      // Check if the food position is on the snake
      isOnSnake = snake.some(segment => segment.x === x && segment.y === y);
    } while (isOnSnake);
  
    return foodPosition;
  }

//moving the snake

function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "right":
      head.x++;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
  }
  const eleSnake = document.querySelector('.snake:first-child');
  if (eleSnake) {
    eleSnake.classList.remove('snake-dir-up', 'snake-dir-right', 'snake-dir-down', 'snake-dir-left');
    eleSnake.classList.add(`snake-dir-${direction}`);
  }
  snake.unshift(head);

  //   snake.pop();
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

//start game func

function startGame() {
  gameStarted = true; // keep track of running game .
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// key press event listner

function handleKeyPress(e) {
  if ((!gameStarted && e.code === "Space") || (!gameStarted && e.key === " ")) {
    startGame();
  } else {
    switch (e.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowRight":
        direction = "right";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
    }
  }
}

document.addEventListener('keydown' , handleKeyPress);

function increaseSpeed() {
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    } else if(gameSpeedDelay > 100 ) {
        gameSpeedDelay -= 3;
    }
    else if(gameSpeedDelay > 50 ) {
        gameSpeedDelay -= 2;
    }
    else if(gameSpeedDelay > 25 ) {
        gameSpeedDelay -= 1;
    }
}

// check collision 

function checkCollision() {
    const head = snake[0];
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }

    for (let i = 1 ; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

//reset game func

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x : 10 , y : 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length -1 ;
    score.textContent = `Score ${currentScore.toString().padStart(3,'0')}`;
    
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length -1 ;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = `Highest ${highScore.toString().padStart(3,'0')}`;
    }
    highScoreText.style.display= 'block';
}