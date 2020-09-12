
var scores = new Map();
var winCount = new Map();
var thoughts = new Map();
var kMaxGames = 100;

function addScore(robot, score, otherScore, elapsed) {
  let name = robot.constructor.name;
  if (!scores.get(name)) {
    scores.set(name, score);
    thoughts.set(name, elapsed)
  } else {
    scores.set(name, scores.get(name) + score);
    thoughts.set(thoughts.get(name) + elapsed);
  }

  if (!winCount.get(name)) {
    winCount.set(name, (score > otherScore) ? 1 : 0);
  } else if (score > otherScore) {
    winCount.set(name, winCount.get(name) + 1);
  }
}

function runOneGame(robotA, robotB) {
    rcs = setupGame(robotA, robotB);
    let nameA = robotA.constructor.name;
    let nameB = robotB.constructor.name;

    containerA = rcs[0];
    containerB = rcs[1];

    for (let i = 0; i < kFramesPerRound; ++i) {
      runFrame();
    }
    addScore(robotA, containerA.score, containerB.score, containerA.elapsed);
    addScore(robotB, containerB.score, containerA.score, containerB.elapsed);
}

entries = [];

function setup() {
  tf.setBackend('cpu');
  let startTime = window.performance.now();
  entries.push(new CircleBot());
  entries.push(new MattBot2());
  entries.push(new RudeBot());
  entries.push(new CloseBot());
  entries.push(new LearnBot());
//  entries.push(new SquareBot());

  let gameCount = 0;
  while (gameCount < kMaxGames) {
    for (let i = 0; i < entries.length; ++i) {
        for (let j = i + 1; j < entries.length; ++j) {
            console.log("i,j: " + i + "," + j);
        robotA = entries[i];
        robotB = entries[j];
        runOneGame(robotA, robotB);
        ++gameCount;
        }
    }
  }
  let elapsed = window.performance.now() - startTime;
  createDiv("Game count: " + gameCount.toFixed(0));
  createDiv("Time per game: " 
    + (elapsed / gameCount).toFixed(3)
    + " ms");
  for (let name of scores.keys()) {
      createDiv(name + ": " + scores.get(name) + 
      " wins: " + winCount.get(name) +
      " thinking: " + thoughts.get(name).toFixed(2));
  };
}

