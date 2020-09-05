// Robot and its position in the world.
// x, y - position of the center of the robot.
// t - angle of the robot (radians).  0 = rigth, PI/2 = up.
class RobotContainer {
  constructor(robot, x, y, t) {
    this.robot = robot;
    this.x = x;
    this.y = y;
    this.t = t;
  }

  forward(d) {
    this.x += Math.cos(this.t) * d;
    this.y += Math.sin(this.t) * d;
  }
}