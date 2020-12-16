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

var lastCompletedPuzzle = -1;
var puzzleIndex = 0;
var puzzleNames = [
  "puzzle_0.txt",
  "puzzle_1.txt",
  "puzzle_2.txt",
  "puzzle_3.txt",
  "puzzle_4.txt",
  "puzzle_7.txt",
  "puzzle_5.txt",
  "mattbot.txt",
  "puzzle_6.txt",
  "steve.txt",

];

function setup() {
  let p = window.getURLParams();
  buildMode = !!p.build;
  if (buildMode) {
    lastCompletedPuzzle = 100;
  }

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

  titleBox = document.createElement("div");
  titleBox.id = "titleBox";
  rightSpan.appendChild(titleBox);

  {
    const b = createButton("<-");
    b.size(40, 40);
    rightSpan.appendChild(b.elt);
    b.elt.id = "previousPuzzle";
    b.elt.addEventListener("click",
      (e) => {
        --puzzleIndex;
        new Challenge(puzzleNames[puzzleIndex], loadGame);
      });
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
    // b.elt.disabled = true;
    b.elt.addEventListener("click",
      (e) => {
        ++puzzleIndex;
        new Challenge(puzzleNames[puzzleIndex], loadGame);
      });
  }

  instructionBox = document.createElement("div");
  instructionBox.id = "instructionBox";
  rightSpan.appendChild(instructionBox);

  goalBox = document.createElement("div");
  goalBox.id = "goalBox";
  rightSpan.appendChild(goalBox);

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
    notesBox = document.createElement("div");
    notesBox.contentEditable = "true";
    notesBox.classList.add("code");
    notesBox.id = "nodesBox";
    notesBox.addEventListener("paste", (e) => {
      setTimeout(() => {
        notesBox.innerText = notesBox.innerText
      }, 10);
    })
    notesBox.spellcheck = "false";

    notesArea = document.createElement("div");
    notesArea.id = "notesArea";
    notesArea.innerHTML =
      "<h2>Notes</h2> " +
      "Use this area to copy-paste code and make other notes.";
    notesArea.appendChild(notesBox);
    rightSpan.appendChild(notesArea);
  }

  new Challenge(puzzleNames[puzzleIndex], loadGame);
}

function loadGame(challenge) {
  let instructionBox = document.getElementById("instructionBox");
  instructionBox.innerHTML = challenge.instructions;
  let codeBox = document.getElementById("code");
  codeBox.innerHTML = challenge.code;
  if (challenge.goal == -1) {
    goalBox.innerText = 'Goal: Win the match.'
  } else {
    goalBox.innerText = 'Goal: Collect ' + challenge.goal.toFixed(0) +
      ' flowers.';
  }
  let titleBox = document.getElementById("titleBox");
  titleBox.innerHTML = challenge.title;

  currentChallenge = challenge;

  resetGame(challenge.opponent);

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
    resetGame(currentChallenge.opponent);
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

function updateButtons() {
  if (puzzleIndex == 0) {
    document.getElementById("previousPuzzle").disabled = true;
  } else {
    document.getElementById("previousPuzzle").disabled = false;
  }

  if (puzzleIndex > lastCompletedPuzzle ||
    puzzleIndex > puzzleNames.length - 1) {
    document.getElementById("nextPuzzle").disabled = true;
  } else {
    document.getElementById("nextPuzzle").disabled = false;
  }
}

function completeChallenge() {
  pauseGame();
  document.getElementById("nextPuzzle").enabled = true;
  lastCompletedPuzzle = Math.max(lastCompletedPuzzle, puzzleIndex);
  updateButtons();
}

function resetGame(opponent) {
  left = new Programmable(messageBox);
  let right = opponent;
  paused = false;
  game = new Game(left, right, {
    noFlowers: !currentChallenge.randomFlowers
  });

  for (f of currentChallenge.flowers) {
    game.addFlower(f.x, f.y);
  }
  updateButtons();

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
      completeChallenge();
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
      if (currentChallenge.goal == -1 &&
        frameState.leftSenses.myScore > frameState.rightSenses.myScore) {
        completeChallenge();
      }
    }
  } else {
    text(secondsRemaining.toFixed(0), kArenaSize / 2, 600);
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