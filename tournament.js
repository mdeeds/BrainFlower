
var kMaxGames = 10;

class GameResult {
  constructor() {
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
  }

  let gr = matches.get(key);
  gr.score += containerA.score;
  gr.winCount += (containerA.score > containerB.score) ? 1 : 0;
  gr.thoughts += containerA.thoughts;
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
  let startTime= window.performance.now();
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
}

function renderTable(cols, a) {
  let oldTable = document.getElementById("tab");
  if (oldTable) {
    oldTable.parentElement.removeChild(oldTable);
  }
  
  let names = [];
  for (e of entries) {
    names.push(e.constructor.name);
  }


  let table = document.createElement("table");
  table.id = "tab";
  {
    let tr = document.createElement("tr");
    {
      let td = document.createElement("th");
      tr.appendChild(td);
      td.innerText = "vs.";
    }
    table.appendChild(tr);
    for (let n of names) {
      let td = document.createElement("th");
      tr.appendChild(td);
      td.innerText = n;
    }
  }

  for (n1 of names) {
    let tr = document.createElement("tr");
    table.appendChild(tr);
    let td = document.createElement("th");
    td.innerText = n1;
    tr.appendChild(td);
    table.appendChild(tr);
    for (n2 of names) {
      td = document.createElement("td");
      tr.appendChild(td);
      if (n1 == n2) {
        td.innerText = "-";
      } else {
        let key = n1 + " vs. " + n2;
        let gr = matches.get(key);
        td.innerText = gr.score;
      }
    }
  }
  let b = document.getElementById("body");
  b.appendChild(table);
}

function runAndDisplay() {
  runGames();
  renderTable();
}

function setup() {
  tf.setBackend('cpu');

  startButton = createButton("Start");
  startButton.size(60, 40);
  startButton.position(kArenaSize / 2 - 25 + 50, 200);
  startButton.mousePressed(runAndDisplay);

  entries.push(new CircleBot());
  entries.push(new MattBot2());
  entries.push(new RudeBot());
  entries.push(new CloseBot());
  entries.push(new LearnBot());
  entries.push(new SquareBot());
}

