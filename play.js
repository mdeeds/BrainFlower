var entries = [];
var robotDisplays = [];

var flower;

function setup() {
  createCanvas(800, 800);
  
  entries.push(new KeyBot());
  entries.push(new CircleBot());

  let x = 100;
  for (let e of entries) {
    let robotContainer = new RobotContainer(e, x, 100, 0);
    let robotDisplay = new RobotDisplay(robotContainer);
    robotDisplays.push(robotDisplay);
    x += 250;
  }
  flower = new Flower(200, 200);
}

var angle = 0;

function generateSenses()  {
  return new SensorState();
}

function draw() {
  background(220);
  let x = 50;
  for (r of robotDisplays) {
    r.draw();
    let rc = r.robotContainer;
    let s = generateSenses(rc);
    rc.robot.run(s);
    let forward = Math.max(0, Math.min(1, s.speed - Math.abs(s.turn)));
    let turn = Math.max(-1, Math.min(1.0, s.turn));
    rc.t += turn / 20.0;
    rc.forward(forward * 5);
  }
  flower.draw();
}
