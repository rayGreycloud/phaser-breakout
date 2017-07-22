let width = 480;
let height = 320;

var game = new Phaser.Game(width, height, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update
});

var ball;
var paddle;

function preload() {
  // Scale canvas but respect aspect ratio
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  // Center image
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  // Add custom canvas background color
  game.stage.backgroundColor = '#eee';

  // Load ball image
  game.load.image('ball', '/assets/images/ball.png');
  // Load paddle image
  game.load.image('paddle', '/assets/images/paddle.png');
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

}

function update() {
  // Enable collision btwn ball and paddle
  game.physics.arcade.collide(ball, paddle);
  // Set paddle control
  paddle.x = game.input.x || game.world.width*0.5;
}
