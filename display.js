kArenaSize = 800;

var entries = [];
var robotDisplays = [];

function setup() {
  createCanvas(kArenaSize, kArenaSize);

  entries.push(new monsterbot());
  entries.push(new KeyBot());
  entries.push(new CircleBot());
  entries.push(new CloseBot());
  entries.push(new RudeBot());
  entries.push(new Kili());
  entries.push(new SteveBot());
  entries.push(new MattBot());
  entries.push(new tinyBot());

  entries.push(new Mooo());
  let dt = 2 * Math.PI / entries.length;
  let t = 0;
  for (let e of entries) {
    let x = Math.cos(t) * 300 + kArenaSize / 2;
    let y = Math.sin(t) * 300 + kArenaSize / 2;
    let robotContainer = new RobotContainer(e, x, y, t + Math.PI / 2);
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
    r.robotContainer.forward(3.0);
    r.robotContainer.update();
  }
}
