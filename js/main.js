let width = 480;
let height = 320;

var game = new Phaser.Game(width, height, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update
});

var ball;

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
}

function create() {
  // Add ball
  ball = game.add.sprite(50, 50, 'ball');

}

function update() {

}
