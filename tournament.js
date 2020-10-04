var kMaxGames = 10;

leftEntries = [];
rightEntries = [];

function setup() {
  tf.setBackend('cpu');

  buildEntryMap();

  startButton = createButton("Run");
  startButton.size(60, 40);
  startButton.mousePressed(runAndDisplay);

  let blockList = ["LearnBot", "KeyBot", "KeyBot2"];
  for (r of entryMap.values()) {
    if (!blockList.includes(r.constructor.name)) {
      rightEntries.push(r);
    }
  }

  leftEntries = rightEntries;

  // // Example code for parameter sweep:
  // for (let l of [0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1.0]) {
  //   for (let r of [-0.01, -0.1, -0.2, -0.3, -0.4, -0.5, -0.8, -1.0]) {
  //     leftEntries.push(new MattBot(l, r));
  //   }
  // }
}

class GameResult {
  constructor() {
    this.robotName = "";
    this.score = 0;
    this.winCount = 0;
    this.thoughts = 0;
  }
}

function getName(robot) {
  return robot.name || robot.constructor.name;
}

function getMatchKey(robotA, robotB) {
  return getName(robotA) + " vs. " + getName(robotB);
}

function addScore(containerA, containerB) {
  let key = getMatchKey(containerA.robot, containerB.robot);
  console.log(key);

  if (!matches.get(key)) {
    matches.set(key, new GameResult());
    matches.get(key).robotName = getName(containerA.robot);
  }

  let gr = matches.get(key);
  gr.score += containerA.score;
  gr.winCount += (containerA.score > containerB.score) ? 1 : 0;
  gr.thoughts += containerA.elapsed;
}

/**
 * key: "foo vs. bar"
 * value: {GameResult}
 */
var matches = new Map();

function runOneGame(robotA, robotB) {
  rcs = setupGame(robotA, robotB);
  containerA = rcs[0];
  containerB = rcs[1];

  for (let i = 0; i < kFramesPerRound; ++i) {
    runFrame();
  }
  addScore(containerA, containerB);
  addScore(containerB, containerA);
}

function runGames() {
  let gameCount = 0;
  while (gameCount < kMaxGames) {
    let playedMatches = new Set();
    for (let i = 0; i < leftEntries.length; ++i) {
      for (let j = 0; j < rightEntries.length; ++j) {
        robotA = leftEntries[i];
        robotB = rightEntries[j];
        let key = getMatchKey(robotA, robotB);
        if (playedMatches.has(key)) {
          continue;
        }
        playedMatches.add(key);
        runOneGame(robotA, robotB);
        ++gameCount;
      }
    }
  }
}

function sortedNames(entries) {
  let totalScore = new Map();
  let names = [];
  for (e of entries) {
    let name = getName(e);
    names.push(name);
    totalScore.set(name, 0);
  }
  for (gr of matches.values()) {
    if (!totalScore.has(gr.robotName)) {
      totalScore.set(gr.robotName, 0);
    }
    totalScore.set(gr.robotName, totalScore.get(gr.robotName) + gr.score);
  }

  // Sort descending by score.  (b - a)
  names.sort(function (a, b) { return totalScore.get(b) - totalScore.get(a); });
  return names;
}

function renderTable(name, dataFn) {
  let id = "tab" + name;
  let oldTable = document.getElementById(id);
  if (oldTable) {
    oldTable.parentElement.removeChild(oldTable);
  }

  let leftNames = sortedNames(leftEntries);
  let rightNames = sortedNames(rightEntries);
  let table = document.createElement("table");
  table.id = id;
  {
    let tr = document.createElement("tr");
    {
      let td = document.createElement("th");
      tr.appendChild(td);
      td.innerText = name;
    }
    table.appendChild(tr);
    for (let n of rightNames) {
      let td = document.createElement("th");
      tr.appendChild(td);
      td.innerText = n;
    }
    {
      let td = document.createElement("th");
      td.innerText = "total";
      tr.appendChild(td);
    }
  }

  for (n1 of leftNames) {
    let tr = document.createElement("tr");
    table.appendChild(tr);
    let td = document.createElement("th");
    td.innerText = n1;
    tr.appendChild(td);
    table.appendChild(tr);
    let total = 0;
    for (n2 of rightNames) {
      td = document.createElement("td");
      tr.appendChild(td);
      if (n1 == n2) {
        td.innerText = "-";
      } else {
        let key = n1 + " vs. " + n2;
        let gr = matches.get(key);
        td.innerText = dataFn(gr).toFixed(0);
        total += dataFn(gr);
      }
    }
    td = document.createElement("td");
    tr.appendChild(td);
    td.innerText = total.toFixed(0);
  }
  let b = document.getElementById("body");
  b.appendChild(table);
}

function runAndDisplay() {
  runGames();
  renderTable("score",
    function (gr) { return gr.score; });
  renderTable("wins",
    function (gr) { return gr.winCount; });
  renderTable("thought",
    function (gr) { return gr.thoughts; });
}


