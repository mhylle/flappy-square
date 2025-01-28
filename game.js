import { saveHighScore, getHighScore } from './firebase.js';

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const bird = {
      x: 100,
      y: 300,
      width: 40,
      height: 40,
      gravity: 0.5,
      lift: -10, // Reduced lift value
      velocity: 0,
      color: 'yellow'
    };

    let pipes = [];
    let score = 0; // Initialize score
    let highScore = 0; // Initialize high score
    const pipeWidth = 100;
    const pipeGap = 240;
    const pipeSpeed = 3;

    async function initializeHighScore() {
      highScore = await getHighScore();
      drawHighScore();
    }

    function drawBird() {
      ctx.fillStyle = bird.color;
      ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }

    function updateBird() {
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;
    }

    function drawPipes() {
      pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
      });
    }

    function updatePipes() {
      pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
      });

      if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        const top = Math.random() * (canvas.height - pipeGap);
        pipes.push({
          x: canvas.width,
          top: top,
          width: pipeWidth,
          height: canvas.height,
          speed: pipeSpeed,
          scored: false // Add scored property to track if the pipe has been scored
        });
      }

      pipes = pipes.filter(pipe => pipe.x > -pipeWidth);

      // Check if bird has passed through a pipe
      pipes.forEach(pipe => {
        if (bird.x > pipe.x + pipeWidth && !pipe.scored) {
          score++;
          pipe.scored = true;
        }
      });
    }

    function checkCollision() {
      for (let pipe of pipes) {
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)) {
          resetGame();
        }
      }

      if (bird.y + bird.height > canvas.height || bird.y < 0) {
        resetGame();
      }
    }

    async function resetGame() {
      if (score > highScore) {
        highScore = score;
        await saveHighScore(highScore);
      }
      bird.y = 300;
      bird.velocity = 0;
      pipes = [];
      score = 0; // Reset score
      drawHighScore();
    }

    function drawScore() {
      ctx.fillStyle = 'black';
      ctx.font = '48px Arial';
      ctx.fillText(`Score: ${score}`, 10, 50);
    }

    function drawHighScore() {
      ctx.fillStyle = 'black';
      ctx.font = '48px Arial';
      ctx.fillText(`High Score: ${highScore}`, 10, 100);
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBird();
      updateBird();
      drawPipes();
      updatePipes();
      checkCollision();
      drawScore(); // Draw the score
      drawHighScore(); // Draw the high score
      requestAnimationFrame(gameLoop);
    }

    function jump() {
      bird.velocity = bird.lift;
    }

    canvas.addEventListener('click', jump);

    initializeHighScore();
    gameLoop();
