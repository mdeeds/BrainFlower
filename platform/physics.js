// Robot and its position in the world.
// x, y - position of the center of the robot.
// t - angle of the robot (radians).  0 = rigth, PI/2 = up.
class RobotContainer {
  /**
   * 
   * @param {Object} robot 
   * @param {number} x The initial x position. 
   * @param {number} y The initial y position.
   * @param {number} t The initial angle (in radians).
   */
  constructor(robot, x, y, t) {
    this.robot = robot;
    this.x = x;
    this.y = y;
    this.t = t;
    this.score = 0;
    this.elapsed = 0;
  }

  /**
   * @param {number} d Distance to move in the forward direction.
   */
  forward(d) {
    this.newx = this.x + Math.cos(this.t) * d;
    this.newy = this.y + Math.sin(this.t) * d;
  }

  /**
   * 
   * @param {RobotContainer} other The other robot to check and handle collision.
   */
  collide(other) {
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let separation = Math.sqrt(dx*dx + dy*dy);
    if (separation > 100) {
      return;
    }
    let dhatx = dx / separation;
    let dhaty = dy / separation;
    let backset = 100 - separation;

    let linedUp = (dotRay(this.t, dx, dy) > 0.9);
    let fromBehind = (dotAngles(this.t, other.t) > 0.6);
    let played = false;
    if (linedUp && fromBehind) {
      backset += 50;
      other.newx += dhatx * 50;
      other.newy += dhaty * 50;
      if (other.score > 0) {
        --other.score;
        ++this.score;
        if (hitSound) {
          if (!hitSound.ended) {
            hitSound.currentTime = 0;
          }
          hitSound.play();
          played = true;
        }
      }
    }
    if (!played && wallSound) {
      if (!wallSound.ended) {
        wallSound.currentTime = 0;
      }
      wallSound.play();
    }
    this.newx -= dhatx * backset;
    this.newy -= dhaty * backset;
  }

  /**
   * Update the robots position.  Call this after applying movement to newx and newy.
   */
  update() {
    if (this.newx < 50 || this.newy < 50 || 
      this.newx > kArenaSize -50 || 
      this.newy > kArenaSize - 50) {
        if (wallSound) {
          wallSound.play();
        }
    }
    this.newx = Math.max(50, Math.min(kArenaSize - 50, this.newx));
    this.newy = Math.max(50, Math.min(kArenaSize - 50, this.newy));
    this.x = this.newx;
    this.y = this.newy;
  }
};

// Returns the dot product of t1 and t2.
dotAngles = function(t1, t2) {
  let dt = t2 - t1;
  if (dt < -Math.PI) {
    dt += 2 * Math.PI;
  }
  if (dt > Math.PI) {
    dt -= 2 * Math.PI;
  }
  return Math.cos(dt);
}

dotRay = function(t1, dx, dy) {
  let t2 = Math.atan2(dy, dx);
  return dotAngles(t1, t2);
}