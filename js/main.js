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
}

function create() {
  // Add physics
  game.physics.startSystem(Phaser.Physics.ARCADE);
  // Add ball
  ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
  ball.anchor.set(0.5);
  // Enable physics on ball
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  // Set velocity
  ball.body.velocity.set(150, -150);
  // Make ball bounce off world boundaries
  ball.body.collideWorldBounds = true;
  // Disable bottom edge collision
  game.physics.arcade.checkCollision.down = false;
  // Set ball bounce
  ball.body.bounce.set(1);
  // Detect losing condition
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(function () {
    alert('Game Over!');
    location.reload();
  }, this);
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

  // Add score text to Display
  scoreText = game.add.text(5, 5, 'Points: 0', {font: '18px Arial', fill: '#0095DD'});

}

function update() {
  // Enable ball/paddle collision
  game.physics.arcade.collide(ball, paddle);
  // Enable brick/ball collision
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  // Set paddle control
  paddle.x = game.input.x || game.world.width*0.5;
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
  // Remove brick from canvas
  brick.kill()
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
