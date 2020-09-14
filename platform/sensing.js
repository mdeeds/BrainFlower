// Describes the current state of the world as percieved by the robot.
// May be modified to indicate intention of movement.

kInputSize = 9;
kOutputSize = 2;

/**
 * Describes the current state of the world as percieved by the robot.
 * May be modified to indicate intention of movement.
 */
class SensorState {
  constructor() {
    // The overlap of the left and right sensors
    /** @member {number} */  
    this.leftFlowers = 0;
    /** @member {number} */
    this.rightFlowers = 0;

    /** @member {number} */
    this.leftFlowerDistance = 0;
    /** @member {number} */
    this.rightFlowerDistance = 0;

    /** @member {number} */
    this.opponentDistance = 0;
    this.opponentAngle = 0;

    this.distanceToWall = 0;
    this.leftDistanceToWall = 0;
    this.rightDistanceToWall = 0;

    this.myScore = 0;
    this.opponentScore = 0;
    this.myHeading = 0;
    this.opponentHeading = 0;
  }

  /**
   * Returns the sensor state as an array of numbers.
   * @returns number[]
   */
  asArray() {
    let result = [];
    result.push(this.leftFlowers / 10.0);
    result.push(this.rightFlowers / 10.0);
    result.push(this.leftFlowerDistance / 400);
    result.push(this.rightFlowerDistance / 400);
    result.push(this.opponentDistance / 400);
    result.push(this.opponentAngle / Math.PI);
    result.push(this.distanceToWall / 400);
    result.push(this.leftDistanceToWall / 400);
    result.push(this.rightDistanceToWall / 400);
    
    result.push(this.speed);
    result.push(this.turn);
    return result;
  }
}
