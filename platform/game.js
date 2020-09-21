var kArenaSize = 800;
var kFramesPerRound = 1800;

var flowers = new Set();
var robotContainers = [];

var flowerSound = false;
var wallSound = false;
var hitSound = false;

/**
 * Generates a perception of the world from the perspective of `rc`.
 * @param {RobotContainer} rc 
 * @returns {SensorState}
 */
function generateSenses(rc, otherRobot)  {
  let state = new SensorState();
  state.leftFlowerDistance = 1200;
  state.rightFlowerDistance = 1200;
  for (let f of flowers) {
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
    state.opponentAngle = t * 180 / Math.PI;
    state.opponentDistance = distance;
    state.opponentHeading = otherRobot.t * 180 / Math.PI;
    state.opponentScore = otherRobot.score;
  }

  {
    // Walls
    state.distanceToWall = findClosestWall(
      new Ray(rc.x, rc.y, rc.t));
    state.leftDistanceToWall = findClosestWall(
      new Ray(rc.x, rc.y, rc.t - Math.PI / 4));
    state.rightDistanceToWall = findClosestWall(
      new Ray(rc.x, rc.y, rc.t + Math.PI / 4));
  }
  state.myHeading = rc.t * 180 / Math.PI;
  state.myScore = rc.score;
  return state;
}

findClosestWall = function(robotRay) {
  // This should be a static const.
  const walls = [
    new Ray(0,0,0),
    new Ray(0,0,-Math.PI/2),
    new Ray(kArenaSize, kArenaSize, Math.PI),
    new Ray(kArenaSize, kArenaSize, Math.PI/2),
  ]
  let closestWall = 2 * kArenaSize;
  for (let w of walls) {
    let d = getDistanceToLine(robotRay, w);
    if (d >= 0) {
      closestWall = Math.min(d, closestWall);
    }
  }
  return closestWall;
}

class Ray {
  constructor(x, y, t) {
    this.x = x;
    this.y = y;
    this.t = t;
  }
}

/**
 * 
 */
getDistanceToLine = function(r1, r2) {
  let x1 = r1.x;
  let y1 = r1.y;
  let t1 = r1.t;
  let x2 = r2.x;
  let y2 = r2.y;
  let t2 = r2.t;

  if (t1 == t2) {
    return -1;
  }
  let cos1 = Math.cos(t1);
  if (Math.abs(cos1) < 0.001) {
    return getDistanceToLine(
      y1, x1, Math.PI / 4 - t1, 
      y2, x2, Math.PI / 4 - t2);
  }
  // p1 = (x1, y1); p2 = (x2, y2)
  // p1 + a1 v1 = p2 + a2 v2
  // solve for a1 and a2.
  let tan1 = Math.tan(t1);
  let sin2 = Math.sin(t2);
  let cos2 = Math.cos(t2);
  let a2 = (y1 - y2 + tan1 * (x2 - x1)) /
    (sin2 - tan1 * cos2);
  let a1 = (x2 + a2 * cos2 - x1) / (cos1);
  return a1;
}

function distance2(x1, y1, x2, y2) {
  return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
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
    for (let rc of robotContainers) {
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
  for (let rc of robotContainers) {
    let d2 = distance2(f.x, f.y, rc.x, rc.y); 
    if (d2 < 2500) {
      overlappingRobot = rc;
      bestDistance2 = d2;
    }
  }
  if (overlappingRobot) {
    ++overlappingRobot.score;
    if (flowerSound) {
      if (!flowerSound.ended) {
        flowerSound.currentTime = 0;
      }
      flowerSound.play();
    }
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
  return robotContainer;
}

/**
 * 
 * @param {RobotContainer} left 
 * @param {RobotContainer} right 
 */
function setupGame(left, right){
  robotContainers.length = 0;
  flowers.clear();

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
function runFrame() {
    if (Math.random() < 0.005) {
      addRandomFlower();
    }
    for (let i of [0, 1]) {
      let rc = robotContainers[i];
      let otherRobot = robotContainers[i ^ 1];
      let s = generateSenses(rc, otherRobot);
      let startTime = window.performance.now();
      let turn = rc.robot.run(s);
      rc.elapsed += window.performance.now() - startTime;
      turn = Math.max(-1, Math.min(1.0, turn));
      let forward = 1.0 - Math.abs(turn);
      rc.t += turn / 10.0;
      if (rc.t > Math.PI) {
        rc.t -= Math.PI * 2;
      } else if (rc.t < -Math.PI) {
        rc.t += Math.PI * 2;
      }
      rc.forward(forward * 5);
    }
    for (let r1 of robotContainers) {
      for (let r2 of robotContainers) {
        if (r1 != r2) {
          r1.collide(r2);
        }
      }
    }
    for (let r of robotContainers) {
      r.update();
    }
    for (let f of flowers) {
      checkFlower(f);
    }
  }
  