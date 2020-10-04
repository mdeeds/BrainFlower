/**
 * contains a RobotContainer as well as graphics.
 */
class RobotDisplay {
  /**
   * 
   * @param {RobotContainer} robotContainer 
   */
  constructor(robotContainer) {
    this.robotContainer = robotContainer;
    this.image = createGraphics(100, 100);
    if (robotContainer.robot.draw) {
      robotContainer.robot.draw(this.image);
    }
  }

  draw() {
    translate(this.robotContainer.x, this.robotContainer.y);
    rotate(this.robotContainer.t);
    image(this.image, -50, -50);
    resetMatrix();
  }
}

class Flower {
  /**
   * Constructs a flower at the specified location.
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.t = 0.0;
  }

  draw() {
    translate(this.x, this.y);
    rotate(this.t);
    fill(color("pink"));
    stroke(color("LightCoral"));
    strokeWeight(1);
    ellipse(0, 5, 7, 10);
    ellipse(0, -5, 7, 10);
    ellipse(5, 0, 10, 7);
    ellipse(-5, 0, 10, 7);
    resetMatrix();
    this.t += 0.1;
  }
}
