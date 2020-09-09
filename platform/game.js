var flowers = new Set();
var robotStats = new Map();

var robotContainers = [];

/**
 * Generates a perception of the world from the perspective of `rc`.
 * @param {RobotContainer} rc 
 * @returns {SensorState}
 */
function generateSenses(rc, otherRobot)  {
  let state = new SensorState();
  state.leftFlowerDistance = 1200;
  state.rightFlowerDistance = 1200;
  for (f of flowers) {
    let dy = f.y - rc.y;
    let dx = f.x - rc.x;
    let distance = Math.sqrt(dx*dx + dy*dy);
    let t = Math.atan2(dy, dx);
    let dt = t - rc.t;
    if (dt < -Math.PI) {
      dt += 2 * Math.PI;
    } else if (dt > Math.PI) {
      dt -= 2 * Math.PI;
    }
    if (dt < Math.PI / 4 && dt > -Math.PI / 12) {
      state.leftFlowers++;
      state.leftFlowerDistance = 
        Math.min(state.leftFlowerDistance, distance);
    }
    if (dt < Math.PI / 12 && dt > -Math.PI / 4) {
      state.rightFlowers++;
      state.rightFlowerDistance =
        Math.min(state.rightFlowerDistance, distance);
    } 
  }
  {
    // Other robot
    let dx = otherRobot.x - rc.x;
    let dy = otherRobot.y - rc.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let t = Math.atan2(dy, dx) - rc.t;
    if (t < -Math.PI) {
      t += 2 * Math.PI;
    } else if (t > Math.PI) {
      t -= 2 * Math.PI;
    }
    state.opponentAngle = t;
    state.opponentDistance = distance;
  }
  return state;
}

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

/**
 * 
 * @param {Robot} robot 
 * @param {number} x 
 * @param {number} y 
 * @param {number} t
 * @returns {RobotContainer} 
 */
function startRobot(robot, x, y, t) {
  let robotContainer = new RobotContainer(robot, x, y, t);
  robotContainers.push(robotContainer);
  let robotDisplay = new RobotDisplay(robotContainer);
  robotStats.set(robotContainer, new RobotScore(x, 50));
  return robotContainer;
}

/**
 * 
 * @param {RobotContainer} left 
 * @param {RobotContainer} right 
 */
function setupGame(left, right){
  let leftContainer =
    startRobot(left, 100, 100, Math.PI / 4);
  let rightContainer =
    startRobot(right, kArenaSize - 100, kArenaSize - 100, -3 * Math.PI / 4);

  for (let i = 0; i < 15; ++i) {
    addRandomFlower();
  }

  return [ leftContainer, rightContainer ];
}

/**
 * Runs the robots and physics simulation without any draw operations.
 */
function runFrame(robotContainers, flowers) {
    if (Math.random() < 0.005) {
      addRandomFlower();
    }
    for (i of [0, 1]) {
      let rc = robotContainers[i];
      let otherRobot = robotContainers[i ^ 1];
      let s = generateSenses(rc, otherRobot);
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
  