var started = false;
var startButton;
var game;
var messageBox;
var testMode = false;
var robotDisplays = [];
var left;

function setup() {
  let p = window.getURLParams();

  createCanvas(kArenaSize, kArenaSize);

  startButton = createButton("Start");
  startButton.size(60, 40);
  startButton.position(kArenaSize / 2 - 25 + 50, 200);
  startButton.mousePressed(startGame);

  const body = document.getElementById("body");
  let main = document.createElement("div");
  main.id = "main";
  body.appendChild(main);
  let leftSpan = document.createElement("span");
  leftSpan.id = "leftSpan";
  let rightSpan = document.createElement("span");
  rightSpan.id = "rightSpan";
  main.appendChild(leftSpan);
  main.appendChild(rightSpan);

  for (c of document.getElementsByTagName("canvas")) {
    c.classList.add("medium");
    c.style.setProperty("width", null);
    c.style.setProperty("height", null);
    leftSpan.appendChild(c);
  }

  codeBox = document.createElement("div");
  codeBox.innerHTML =
    "<div>function run(s) {</div>" +
    "<div>  return <span contenteditable>0.5</span>;</div>" +
    "<div>}</div>";
  codeBox.id = "code";
  codeBox.classList.add("code");
  rightSpan.appendChild(codeBox);
  console.log(codeBox.innerText);

  messageBox = document.createElement("div");
  messageBox.classList.add("errors");
  messageBox.classList.add("code");

  rightSpan.appendChild(messageBox);

  left = new Programmable(messageBox);
  let right = new SpinBot();
  game = new Game(left, right, { noFlowers: true });
  robotDisplays.push(new RobotDisplay(game.leftContainer));
  robotDisplays.push(new RobotDisplay(game.rightContainer));

  for (s of document.getElementsByTagName("span")) {
    if (s.contentEditable == "true") {
      s.classList.add("editable");
    }
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
  startButton.remove();

  left.setCode(
    document.getElementById("code").innerText +
    "run(s)");
}


function playFrame() {
  background("DarkSeaGreen");
  if (started) {
    let frameState = game.runFrame();
    if (testMode) {
      textAlign(LEFT);
      textSize(24);
      noStroke();
      fill(color("Black"))
      text(JSON.stringify(frameState.leftSenses, null, '  '), 0, 20);
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
      textSize(200);
      text("STOP", kArenaSize / 2, 450);
    } else {
      text(secondsRemaining.toFixed(0), kArenaSize / 2, 600);
    }
  }
}

var frameNumber = 0;
function draw() {
  playFrame();
  if (started) {
    ++frameNumber;
    if (frameNumber >= kFramesPerRound) {
      started = false;
    }
  }
}
