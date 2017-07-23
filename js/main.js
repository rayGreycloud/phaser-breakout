let width = 480;
let height = 320;

var game = new Phaser.Game(width, height, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update
});

var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;
var textStyle;
var playing = false;
var startButton;

function preload() {
  // Scale canvas but respect aspect ratio
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  // Center image
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  // Add custom canvas background color
  game.stage.backgroundColor = '#eee';

  // Load images
  game.load.image('ball', '/assets/images/ball.png');
  game.load.image('paddle', '/assets/images/paddle.png');
  game.load.image('brick', '/assets/images/brick.png');
  game.load.spritesheet('ball', '/assets/images/wobble.png', 20, 20);
  game.load.spritesheet('button', '/assets/images/button.png', 120, 40);
}

function create() {
  // Add physics
  game.physics.startSystem(Phaser.Physics.ARCADE);
  // Add ball
  ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
  // Add animation
  ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
  ball.anchor.set(0.5);
  // Enable physics on ball
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  // Make ball bounce off world boundaries
  ball.body.collideWorldBounds = true;
  // Disable bottom edge collision
  game.physics.arcade.checkCollision.down = false;
  // Set ball bounce
  ball.body.bounce.set(1);
  // Detect losing condition
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(ballLeavesScreen, this);
  // Add paddle, position in middle
  paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
  // Set anchor
  paddle.anchor.set(0.5,1);
  // Enable physics on paddle
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  // Make paddle stay in place
  paddle.body.immovable = true;
  // Draw bricks
  initBricks();
  // Styles for text
  textStyle = {font: '18px Arial', fill: '#0095DD'};
  // Display score text
  scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
  // Display lives left
  livesText = game.add.text(game.world.width-5, 5, 'Lives: ' + lives, textStyle);
  livesText.anchor.set(1,0);
  // Display life lost message
  lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'Life lost, click to continue', textStyle);
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;

  // Add start button
  startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5);

}

function update() {
  // Enable ball/paddle collision
  game.physics.arcade.collide(ball, paddle, ballHitPaddle);
  // Enable brick/ball collision
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  // Only allow paddle to move after game start
  if (playing) {
      paddle.x = game.input.x || game.world.width*0.5;
  }
}

function initBricks() {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 7,
      col: 3
    },
    offset: {
      top: 50,
      left: 60
    },
    padding: 10
  };

  // Add brick group
  bricks = game.add.group();
  for (c = 0; c < brickInfo.count.col; c++) {
    for (r = 0; r < brickInfo.count.row; r++) {
      // Create new brick and add to group
      var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
      var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;

      newBrick = game.add.sprite(brickX, brickY, 'brick');
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
}

function ballHitBrick(ball, brick) {
  // Ball animation
  ball.animations.play('wobble');
  // Add tween for brick disappear
  var killTween = game.add.tween(brick.scale);
  // Define state at end
  killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
  // Add event handler to kill brick after tween done
  killTween.onComplete.addOnce(function () {
    brick.kill();
  }, this);
  // Start tween
  killTween.start();
  // Increase score
  score += 10;
  // Update score text
  scoreText.setText('Points: ' + score);

  // Initialize variable for win check
  var count_alive = 0;
  // Iterate thru bricks
  for (i = 0; i < bricks.children.length; i++) {
    // check if brick alive
    if (bricks.children[i].alive == true) {
      count_alive++;
    }
  }
  // If count is 0, all bricks are gone and game won
  if (count_alive == 0) {
    alert('Winner Winner Chicken Dinner!');
    location.reload();
  }
}

function ballLeavesScreen() {
  // Decrement lives left
  lives--;
  // Check if non-zero
  if (lives) {
    // Show lives left
    livesText.setText('Lives: ' + lives);
    lifeLostText.visible = true;
    // Reset ball and paddle positions
    ball.reset(game.world.width*0.5, game.world.height-25);
    paddle.reset(game.world.width*0.5, game.world.height-5);
    // Hide message and start ball
    game.input.onDown.addOnce(function () {
      lifeLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this);
  }
    else {
      alert('Game Over!');
      location.reload();
    }
}

function ballHitPaddle(ball, paddle) {
  ball.animations.play('wobble');
  ball.body.velocity.x = -1*5*(paddle.x-ball.x);
}

function startGame() {
  // Remove button
  startButton.destroy();
  // Start ball moving
  ball.body.velocity.set(150, -150);
  // Set playing
  playing = true;
}
