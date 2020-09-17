
var kMaxGames = 10;

class GameResult {
  constructor() {
    this.robotName = "";
    this.score = 0;
    this.winCount = 0;
    this.thoughts = 0;
  }
}

function addScore(containerA, containerB) {
  let key = containerA.robot.constructor.name
    + " vs. "
    + containerB.robot.constructor.name;

  if (!matches.get(key)) {
    matches.set(key, new GameResult());
    matches.get(key).robotName = containerA.robot.constructor.name;
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
    let nameA = robotA.constructor.name;
    let nameB = robotB.constructor.name;

    containerA = rcs[0];
    containerB = rcs[1];

    for (let i = 0; i < kFramesPerRound; ++i) {
      runFrame();
    }
    addScore(containerA, containerB);
    addScore(containerB, containerA);
}

entries = [];

function runGames() {
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
}

function sortedNames() {
  let names = [];
  for (e of entries) {
    names.push(e.constructor.name);
  }
  let totalScore = new Map();
  for (gr of matches.values()) {
    if (!totalScore.has(gr.robotName)) {
      totalScore.set(gr.robotName, 0);
    }
    totalScore.set(gr.robotName, totalScore.get(gr.robotName) + gr.score);
  }

  // Sort descending by score.  (b - a)
  names.sort(function(a, b) { return totalScore.get(b) - totalScore.get(a); });
  return names;
}

function renderTable(name, dataFn) {
  let id = "tab" + name;
  let oldTable = document.getElementById(id);
  if (oldTable) {
    oldTable.parentElement.removeChild(oldTable);
  }
  
  let names = sortedNames();
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
    for (let n of names) {
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

  for (n1 of names) {
    let tr = document.createElement("tr");
    table.appendChild(tr);
    let td = document.createElement("th");
    td.innerText = n1;
    tr.appendChild(td);
    table.appendChild(tr);
    let total = 0;
    for (n2 of names) {
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
    function(gr) {return gr.score; });
  renderTable("wins", 
    function(gr) {return gr.winCount; });
  renderTable("thought", 
    function(gr) {return gr.thoughts; });
}

function setup() {
  tf.setBackend('cpu');

  startButton = createButton("Run");
  startButton.size(60, 40);
  startButton.mousePressed(runAndDisplay);

  entries.push(new CircleBot());
  entries.push(new MattBot2());
  entries.push(new RudeBot());
  entries.push(new CloseBot());
  entries.push(new LearnBot());
  entries.push(new SquareBot());
}

