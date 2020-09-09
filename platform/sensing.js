// Describes the current state of the world as percieved by the robot.
// May be modified to indicate intention of movement.

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

    /** @member {number} - Current driving speed.  Range 0.0 to 1.0. */
    this.speed = 0.0;
    /** @member {number} 
     * Current turning speed.  -1.0 Left, 1.0 Right, 0.0 Straight */
    this.turn = 0.0;
  }

  /**
   * Returns the sensor state as an array of numbers.
   * @returns number[]
   */
  asArray() {
    let result = [];
    result.push(this.leftFlowers);
    result.push(this.rightFlowers);
    result.push(this.leftFlowerDistance);
    result.push(this.rightFlowerDistance);
    result.push(this.speed);
    result.push(this.turn);
  }

  /**
   * Sets this sensor state from the numbers provided.
   * @param {number[]} a 
   */
  setFromArray(a) {
    this.leftFlowers = a[0];
    this.rightFlowers = a[1];
    this.leftFlowerDistance = a[2];
    this.rightFlowerDistance = a[3];
    this.speed = a[4];
    this.turn = a[5];
  }
}
