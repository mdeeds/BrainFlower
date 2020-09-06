var robotDisplays = [];

var kArenaSize = 800;

var flowers = new Set();

function distance2(x1, y1, x2, y2) {
  return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}

function addRandomFlower() {
  let found = false;
  let x;
  let y;
  while (true) {
    x = Math.random() * kArenaSize;
    y = Math.random() * kArenaSize;
    let overlapping = false;
    for (rd of robotDisplays) {
      let rc = rd.robotContainer;
      if (distance2(rc.x, rc.y, x, y) < 10000) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      break;
    }
  }
  let flower = new Flower(x, y);
  flowers.add(flower);
}

function startRobot(robot, x, y, t) {
  let robotContainer = new RobotContainer(robot, x, y, t);
  let robotDisplay = new RobotDisplay(robotContainer);
  robotDisplays.push(robotDisplay);
}

function setup() {
  createCanvas(kArenaSize, kArenaSize);
  
  startRobot(new KeyBot(), 100, 100, Math.PI / 4);
  startRobot(new CircleBot(), kArenaSize - 100, kArenaSize - 100, -3 * Math.PI / 4);

  for (let i = 0; i < 100; ++i) {
    addRandomFlower();
  }
}

var angle = 0;

function generateSenses()  {
  return new SensorState();
}

function checkFlower(f) {
  let overlappingRobot = null;
  let bestDistance2 = 2500;
  for (rd of robotDisplays) {
    let d2 = distance2(f.x, f.y, rd.robotContainer.x, rd.robotContainer.y); 
    if (d2 < 2500) {
      overlappingRobot = rd;
      bestDistance2 = d2;
    }
  }
  if (overlappingRobot) {
    // TODO: points!
    flowers.delete(f);
    addRandomFlower();
    return false;
  }
  return true;
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
    if (rc.x > kArenaSize - 50) {
      rc.x = kArenaSize - 50;
    } else if (rc.x < 50) {
      rc.x = 50;
    }
    if (rc.y > kArenaSize - 50) {
      rc.y = kArenaSize - 50;
    } else if (rc.y < 50) {
      rc.y = 50;
    }
  }
  for (f of flowers) {
    if (checkFlower(f)) {
      f.draw();
    }
  }
}
