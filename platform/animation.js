// contains a RobotContainer as well as graphics.
class RobotDisplay {
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

