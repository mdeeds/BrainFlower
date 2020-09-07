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
    let absd = Math.sqrt(dx*dx + dy*dy);
    if (absd > 100) {
      return;
    }
    let dhatx = dx / absd;
    let dhaty = dy / absd;
    let backset = 100 - absd;
    this.newx -= dhatx * backset;
    this.newy -= dhaty * backset;
  }

  /**
   * Update the robots position.  Call this after applying movement to newx and newy.
   */
  update() {
    this.newx = Math.max(50, Math.min(kArenaSize - 50, this.newx));
    this.newy = Math.max(50, Math.min(kArenaSize - 50, this.newy));
    this.x = this.newx;
    this.y = this.newy;
  }

}