var leftEntryChoice;
var rightEntryChoice;
var game;
var testMode = false;

function setup() {
  tf.setBackend('cpu');
  [leftEntryChoice, rightEntryChoice] = buildEntryMap();

  leftEntryChoice.position(70, 10);
  leftEntryChoice.size(380, 25);
  rightEntryChoice.position(470, 10);
  rightEntryChoice.size(380, 25);

  createCanvas(kArenaSize, kArenaSize);

  startButton = createButton("Start");
  startButton.size(60, 40);
  startButton.position(kArenaSize / 2 - 25 + 50, 200);
  startButton.mousePressed(startGame);

   for (c of document.getElementsByTagName("canvas")) {
     c.classList.add("biggest");
     c.style.setProperty("width", null);
     c.style.setProperty("height", null);     
   }
}


var started = false;
var startButton;
var match;
var robotDisplays = [];

function loadSound(path) {
  let audio = document.createElement("audio");
  audio.src = path;
  return audio;
}

function startGame() {
  music = loadSound("sfx/Music.mp3");
  music.volume = 0.5;
  music.play();
  flowerSound = loadSound("sfx/Flower.mp3");
  wallSound = loadSound("sfx/Wall.mp3");
  hitSound = loadSound("sfx/Hit.mp3");

  started = true;
  startButton.remove();
  let left = match.getEntry(0);
  let right = match.getEntry(1);
  match.remove();
  game = new Game(left, right, { noFlowers: testMode });

  robotDisplays.push(new RobotDisplay(game.leftContainer));
  robotDisplays.push(new RobotDisplay(game.rightContainer));
}

var angle = 0;

function playFrame() {
  game.runFrame();
  background("DarkSeaGreen");
  let x = 100;
  for (let r of robotDisplays) {
    r.draw();
    let rc = r.robotContainer;
    textAlign(CENTER);
    textSize(24);
    noStroke();
    fill(color("Black"))
    text(rc.robot.constructor.name + ": " + rc.score.toFixed(0), x, 30);
    x += 600;
  }
  game.drawFlowers();

  let framesRemaining = kFramesPerRound - frameNumber;
  let secondsRemaining = framesRemaining / 60.0;
  if (secondsRemaining <= 3) {
    textSize(600);
    textAlign(CENTER);
    strokeWeight(5);
    fill(color("red"));
    stroke(color("black"));
    if (framesRemaining === 0) {
      textSize(200);
      text("STOP", kArenaSize / 2, 450);
    } else {
      text(secondsRemaining.toFixed(0), kArenaSize / 2, 600);
    }
  }
}

function splashFrame() {
  background(color("LightSlateGray"));
  textSize(40);
  textAlign(CENTER);
  noStroke();
  fill(color("Teal"));
  text("choose your robots", kArenaSize / 2, 100);
}

var frameNumber = 0;
function draw() {
  if (!started) {
    splashFrame();
  } else {
    ++frameNumber;
    if (frameNumber <= kFramesPerRound) {
      playFrame();
    }
  }
}

function mouseClicked() {
  if (testMode) {
    if (mouseX >= 0 && mouseX < kArenaSize &&
      mouseY >= 0 && mouseY < kArenaSize) {
      game.addFlower(mouseX, mouseY);
    }
  }
}
