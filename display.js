var entries = [];
var robotDisplays = [];

function setup() {
  createCanvas(400, 400);
  
  entries.push(new KeyBot());
  entries.push(new CircleBot());
  entries.push(new MattBot());

  let x = 100;
  for (let e of entries) {
    let robotContainer = new RobotContainer(e, x, 100, 0);
    let robotDisplay = new RobotDisplay(robotContainer);
    robotDisplays.push(robotDisplay);
    x += 110;
  }
}

var angle = 0;

function draw() {
  background(220);
  let x = 50;
  for (let r of robotDisplays) {
    r.draw();
    r.robotContainer.t += 0.01;
    r.robotContainer.forward(1.0);
  }
}
