var flowers = new Set();
  var robotStats = new Map();

function addRandomFlower() {
  if (flowers.size >= 100) {
    return;
  }
  let found = false;
  let x;
  let y;
  while (true) {
    x = Math.random() * kArenaSize;
    y = Math.random() * kArenaSize;
    let overlapping = false;
    for (rc of robotContainers) {
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

function checkFlower(f) {
  let overlappingRobot = null;
  let bestDistance2 = 2500;
  for (rc of robotContainers) {
    let d2 = distance2(f.x, f.y, rc.x, rc.y); 
    if (d2 < 2500) {
      overlappingRobot = rc;
      bestDistance2 = d2;
    }
  }
  if (overlappingRobot) {
    // TODO: points!
    let stats = robotStats.get(overlappingRobot);
    ++stats.score;
    flowers.delete(f);
    if (Math.random() < 0.5) {
      addRandomFlower();
    }
    return false;
  }
  return true;
}

function startRobot(robot, x, y, t) {
  let robotContainer = new RobotContainer(robot, x, y, t);
  robotContainers.push(robotContainer);
  let robotDisplay = new RobotDisplay(robotContainer);
  robotDisplays.push(robotDisplay);
  robotStats.set(robotContainer, new RobotScore(x, 50));
}


function setupGame(){
  startRobot(new KeyBot(), 100, 100, Math.PI / 4);
  startRobot(new CircleBot(), kArenaSize - 100, kArenaSize - 100, -3 * Math.PI / 4);

  for (let i = 0; i < 15; ++i) {
    addRandomFlower();
  }
}

/**
 * Runs the robots and physics simulation without any draw operations.
 */
function runFrame(robotContainers, flowers) {
    if (Math.random() < 0.005) {
      addRandomFlower();
    }
    for (rc of robotContainers) {
      let s = generateSenses(rc);
      rc.robot.run(s);
      let forward = Math.max(0, Math.min(1, s.speed - Math.abs(s.turn)));
      let turn = Math.max(-1, Math.min(1.0, s.turn));
      rc.t += turn / 10.0;
      rc.forward(forward * 5);
    }
    for (r1 of robotContainers) {
      for (r2 of robotContainers) {
        if (r1 != r2) {
          r1.collide(r2);
        }
      }
    }
    for (r of robotContainers) {
      r.update();
    }
    for (f of flowers) {
      checkFlower(f);
    }
  }
  