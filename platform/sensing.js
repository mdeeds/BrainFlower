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
    /** @member {number} - Number of flowers to the left. */  
    this.leftFlowers = 0;
    /** @member {number} - Number of flowers to the right. */
    this.rightFlowers = 0;
    /** @member {number} - Distance to closest flower on the left. */
    this.leftFlowerDistance = 0;
    /** @member {number} - Distance to closest flower on the right. */
    this.rightFlowerDistance = 0;

    /** @member {number} - Distance to the oponent. */
    this.opponentDistance = 0;
    /** @member {number} - Angle to the opponent. */
    this.opponentAngle = 0;

    /** @member {number} - Distance to wall ahead. */
    this.distanceToWall = 0;
    /** @member {number} - Distance to wall left 45 degrees. */
    this.leftDistanceToWall = 0;
    /** @member {number} - Distance to wall right 45 degrees. */
    this.rightDistanceToWall = 0;

    /** @member {number} - My current score (flowers). */
    this.myScore = 0;
    /** @member {number} - The opponent's current score. */
    this.opponentScore = 0;
    /** @member {number} - My absolute heading (right = 0). */
    this.myHeading = 0;
    /** @member {number} - The opponent's current heading. */
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
