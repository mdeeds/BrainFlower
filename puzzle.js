var started = false;
var paused = false;
var startButton;
var game = null;
var messageBox;
var testMode = false;
var robotDisplays = [];
var left;
var buildMode = false;
var currentChallenge = null;

var puzzleNames = [
  "puzzle_1.txt",
  "puzzle_2.txt",
  "puzzle_3.txt",
];

function setup() {
  let p = window.getURLParams();
  buildMode = !!p.build;

  createCanvas(kArenaSize, kArenaSize);

  const body = document.getElementById("body");
  let main = document.createElement("div");
  main.id = "main";
  body.appendChild(main);
  let leftSpan = document.createElement("span");
  leftSpan.id = "leftSpan";
  main.appendChild(leftSpan);

  for (c of document.getElementsByTagName("canvas")) {
    c.classList.add("medium");
    c.style.setProperty("width", null);
    c.style.setProperty("height", null);
    leftSpan.appendChild(c);
  }

  // const main = document.getElementById("main");
  let rightSpan = document.createElement("span");
  rightSpan.id = "rightSpan";
  main.appendChild(rightSpan);

  goalBox = document.createElement("div");
  goalBox.id = "goalBox";
  rightSpan.appendChild(goalBox);

  instructionBox = document.createElement("div");
  instructionBox.id = "instructionBox";
  rightSpan.appendChild(instructionBox);

  codeBox = document.createElement("div");
  codeBox.id = "code";
  codeBox.classList.add("code");
  rightSpan.appendChild(codeBox);

  messageBox = document.createElement("div");
  messageBox.id = "messageBox";
  messageBox.classList.add("errors");
  messageBox.classList.add("code");
  rightSpan.appendChild(messageBox);


  {
    const b = createButton("<-");
    b.size(40, 40);
    rightSpan.appendChild(b.elt);
    b.elt.id = "previousPuzzle";
  }
  startButton = createButton("Start");
  startButton.size(60, 40);
  startButton.mousePressed(handleButtonClick);
  rightSpan.appendChild(startButton.elt);
  {
    const b = createButton("->");
    b.size(40, 40);
    rightSpan.appendChild(b.elt);
    b.elt.id = "nextPuzzle";
    b.elt.disabled = true;
  }

  new Challenge("puzzle_1.txt", loadGame);
}

function loadGame(challenge) {
  let instructionBox = document.getElementById("instructionBox");
  instructionBox.innerHTML = challenge.instructions;
  let codeBox = document.getElementById("code");
  codeBox.innerHTML = challenge.code;
  goalBox.innerText = 'Goal: Collect ' + challenge.goal.toFixed(0) +
    ' flowers.';

  currentChallenge = challenge;

  resetGame();

  for (s of document.getElementsByTagName("span")) {
    if (s.contentEditable == "true") {
      s.classList.add("editable");
    }
  }
}

function handleButtonClick() {
  const buttonText = startButton.elt.innerText;
  if (buttonText == "Start") {
    startGame();
    startButton.elt.innerText = "Stop";
  } else if (buttonText == "Stop") {
    pauseGame();
    startButton.elt.innerText = "Reset";
  } else {
    resetGame();
    startButton.elt.innerText = "Start";
  }
}

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
  paused = false;

  left.setCode(
    document.getElementById("code").innerText +
    "run(s)");
}

function pauseGame() {
  music.pause();
  started = false;
  paused = true;
}

function completeChallenge() {
  pauseGame();
  document.getElementById("nextPuzzle").enabled = true;
}

function resetGame() {
  left = new Programmable(messageBox);
  let right = new SpinBot();
  paused = false;
  game = new Game(left, right, { noFlowers: true });

  for (f of currentChallenge.flowers) {
    game.addFlower(f.x, f.y);
  }

  robotDisplays = [];
  robotDisplays.push(new RobotDisplay(game.leftContainer));
  robotDisplays.push(new RobotDisplay(game.rightContainer));
  frameNumber = 0;
}


function playFrame() {
  background("DarkSeaGreen");
  if (started) {
    let frameState = game.runFrame();
    if (frameState.leftSenses.myScore == currentChallenge.goal) {
      pauseGame();
    }
  }

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
      handleButtonClick();
      textSize(200);
      text("STOP", kArenaSize / 2, 450);
    } else {
      text(secondsRemaining.toFixed(0), kArenaSize / 2, 600);
    }
  }
  if (paused) {
    frameState = game.getFrameState();
    textAlign(LEFT);
    textSize(24);
    noStroke();
    fill(color("Black"))
    text(JSON.stringify(frameState.leftSenses,
      function (key, val) {
        return (typeof val === "number") ?
          val.toFixed(1) : val;
      }, ' '), 20, 100);
  }
}

var frameNumber = 0;
function draw() {
  if (!game) {
    return;
  }
  playFrame();
  if (started) {
    ++frameNumber;
    if (frameNumber >= kFramesPerRound) {
      started = false;
    }
  }
}

function mouseClicked() {
  if (buildMode) {
    if (mouseX >= 0 && mouseX < kArenaSize &&
      mouseY >= 0 && mouseY < kArenaSize) {
      game.addFlower(mouseX, mouseY);
      const messageBox = document.getElementById("messageBox");
      const flowers = game.getFlowers();
      let flowerArray = [];
      for (f of flowers) {
        flowerArray.push(f);
      }
      messageBox.innerText = JSON.stringify(
        flowerArray, null, 1);

      const range = document.createRange();
      range.selectNode(messageBox);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  }
}