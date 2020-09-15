var entries = [];
var robotDisplays = [];

function setup() {
  createCanvas(800, 800);
  
  entries.push(new KeyBot());
  entries.push(new CircleBot());
  entries.push(new MattBot2());

  let dt = 2 * Math.PI / entries.length;
  let t = 0;
  for (let e of entries) {
    let x = Math.cos(t) * 300;
    let y = Math.sin(t) * 300;
    let robotContainer = new RobotContainer(e, x, y, t + Math.PI/2);
    let robotDisplay = new RobotDisplay(robotContainer);
    robotDisplays.push(robotDisplay);
    t += dt;
  }
}

var angle = 0;

function draw() {
  background("DarkSeaGreen");
  let x = 50;
  for (let r of robotDisplays) {
    r.draw();
    r.robotContainer.t += 0.01;
    r.robotContainer.forward(1.0);
  }
}
