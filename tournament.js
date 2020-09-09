
function runOneGame(robotA, robotB) {
    setupGame(robotA, robotB);

    for (let i = 0; i < kFramesPerRound; ++i) {
        runFrame();
    }
    if (robotStats.get(robotA).score <
        robotStats.get(robotB).score) {
        createDiv("Right wins!")
    } else if (robotStats.get(robotA).score >
    robotStats.get(robotB).score) {
        createDiv("Left wins!");
    } else {
        createDiv("Tie!!!!")
    }
}

function setup() {
    let startTime = window.performance.now();
  let robotA = new MattBot2();
  let robotB = new CloseBot();
  for (let i = 0; i < 500; ++i) {
    runOneGame(robotA, robotB);
  }
  let elapsed = window.performance.now() - startTime;
  createDiv("Time per game: " 
    + (elapsed / 500).toFixed(3)
    + " ms");
}

