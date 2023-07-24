var gameContainer = document.getElementById('game-container');
var bird = document.getElementById('bird');
var pipeTop = document.getElementById('pipe-top');
var pipeBottom = document.getElementById('pipe-bottom');
var scoreElement = document.createElement('div');
var highScoreElement = document.createElement('div');

var homeScreen = document.getElementById('home-screen');
var playButton = document.getElementById('play-button');

var birdY = 250;
var birdYSpeed = 0;
var pipeX = gameContainer.offsetWidth;
var pipeHoleSize = 250;  // The size of the gap between the top and bottom pipes.
var pipeHolePosition = Math.random() * (gameContainer.offsetHeight - pipeHoleSize) + pipeHoleSize / 2;

var gameOver = false;
var score = 0;
var highScore = localStorage.getItem('highScore') ? localStorage.getItem('highScore') : 0;

var gameOverMessage = document.getElementById('game-over');
var restartButton = document.getElementById('restart-button');

var jumpSpeed = -16; // Decrease the jump speed for desktop
var fallSpeed = 1.0; // Increase the fall speed for desktop


var basePipeSpeed = 4;

scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.fontSize = '20px';
scoreElement.textContent = 'Score: ' + score;
gameContainer.appendChild(scoreElement);

highScoreElement.style.position = 'absolute';
highScoreElement.style.top = '40px';
highScoreElement.style.left = '10px';
highScoreElement.style.fontSize = '20px';
highScoreElement.textContent = 'High Score: ' + highScore;
gameContainer.appendChild(highScoreElement);

var jumpSound = new Audio();
var scoreSound = new Audio('sounds/score.wav');
scoreSound.volume = 1;

var bgMusic = new Audio('sounds/theme2.wav');
bgMusic.volume = 0.2;
bgMusic.loop = true;
var bgMusicPlayed = false;

var instructions = document.getElementById('instructions');

var isMobile = window.navigator.maxTouchPoints > 0 || /Mobi|Android/i.test(navigator.userAgent);



var instructionElement = document.querySelector("#home-screen p");

if (isMobile) {
  instructionElement.textContent = "How to play: Tap the screen to fly!";
} else {
  instructionElement.textContent = "How to play: Press the space bar to fly!";
}

window.addEventListener('touchstart', function(e) {
  if (e.target.id !== "play-button" && e.target.id !== "restart-button") {
    e.preventDefault();
    if (!gameOver) {
      birdYSpeed = jumpSpeed;
      jumpSound.play();

      if (!bgMusicPlayed) {
        bgMusic.play();
        bgMusicPlayed = true;
      }
    }
  }
}, {passive: false});

homeScreen.style.display = 'block';


bird.style.width = '100px';
bird.style.height = '100px';

function adjustForMobile() {
  if (isMobile) {
    // Set bird size to a larger size for mobile
    bird.style.width = '14vw';
    bird.style.height = '14vw';

    // Adjust pipe size and gap for mobile
    pipeTop.style.width = '20vw';
    pipeBottom.style.width = '20vw';
    pipeTop.style.height = '1vh'; // Adjust the height of pipeTop for mobile
    pipeBottom.style.height = '1vh'; // Adjust the height of pipeBottom for mobile

    // Increase the pipeHoleSize for mobile
    var pipeHoleSize = 250; // Set the desired pipe hole size for mobile
    pipeHolePosition = Math.random() * (gameContainer.offsetHeight - pipeHoleSize) + pipeHoleSize / 2;

    // Adjust jumpSpeed and fallSpeed for mobile
    jumpSpeed = -20; // Increase the jump speed for mobile
    fallSpeed = 1.5; // Decrease the fall speed for mobile
  }
}


adjustForMobile();

function gameLoop() {
  if (gameOver) {
    return;
  }

  birdYSpeed += fallSpeed;
  birdY += birdYSpeed;

  var pipeSpeed = basePipeSpeed + score / 20;

  pipeX -= pipeSpeed;

  if (pipeX < -100) {
    pipeX = gameContainer.offsetWidth;
    pipeHolePosition = Math.random() * (gameContainer.offsetHeight - pipeHoleSize) + pipeHoleSize / 2;
    if (!gameOver) {
      score++;
      scoreElement.textContent = 'Score: ' + score;
      scoreSound.play();

      if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = 'High Score: ' + highScore;
        localStorage.setItem('highScore', highScore);
      }
    }
  }

  bird.style.top = birdY + 'px';
  pipeTop.style.height = pipeHolePosition - pipeHoleSize / 2 + 'px';
  pipeTop.style.left = pipeX + 'px';
  pipeBottom.style.height = gameContainer.offsetHeight - pipeHolePosition - pipeHoleSize / 2 + 'px';
  pipeBottom.style.top = pipeHolePosition + pipeHoleSize / 2 + 'px';
  pipeBottom.style.left = pipeX + 'px';
  var birdRect = bird.getBoundingClientRect();
  var pipeTopRect = pipeTop.getBoundingClientRect();
  var pipeBottomRect = pipeBottom.getBoundingClientRect();

  var birdCollisionRect = {
    top: birdRect.top + 10,
    bottom: birdRect.bottom - 10,
    left: birdRect.left + 10,
    right: birdRect.right - 10
  };

  var pipeTopCollisionRect = {
    bottom: pipeTopRect.bottom - 10,
    left: pipeTopRect.left + 10,
    right: pipeTopRect.right - 10
  };

  var pipeBottomCollisionRect = {
    top: pipeBottomRect.top + 10,
    left: pipeBottomRect.left + 10,
    right: pipeBottomRect.right - 10
  };

  if (
    birdCollisionRect.top <= 0 ||
    birdCollisionRect.bottom >= gameContainer.offsetHeight ||
    (birdCollisionRect.right >= pipeTopCollisionRect.left &&
      birdCollisionRect.left <= pipeTopCollisionRect.right &&
      (birdCollisionRect.top <= pipeTopCollisionRect.bottom || birdCollisionRect.bottom >= pipeBottomCollisionRect.top))
  ) {
    gameOver = true;
    gameOverMessage.style.display = 'block';
    return;
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', function(e) {
  if (e.key == ' ' && !gameOver) {
    e.preventDefault();
    birdYSpeed = jumpSpeed;
    jumpSound.play();

    if (!bgMusicPlayed) {
      bgMusic.play();
      bgMusicPlayed = true;
    }
  }
});

bird.style.display = 'none';

pipeTop.style.display = 'none';
pipeBottom.style.display = 'none';

// Show the pipes when the game starts.
playButton.addEventListener('click', function() {
  homeScreen.style.display = 'none';
  pipeTop.style.display = 'block';
  pipeBottom.style.display = 'block';
  bird.style.display = 'block';
  gameLoop();
});

restartButton.addEventListener('click', function() {
  birdY = 250;
  birdYSpeed = 0;
  pipeX = gameContainer.offsetWidth;
  pipeHolePosition = Math.random() * 300 + 150;
  gameOver = false;
  score = 0;
  scoreElement.textContent = 'Score: ' + score;
  gameOverMessage.style.display = 'none';

  gameLoop();
});
