class Roomba {
  constructor() {
    this.newHeading = 0;
    this.onCourse = true;
  }

  /**
   * Draws the bot.
   * @param {Renderer} c 
   */
  draw(c) {
    c.noStroke();
    c.fill(color(10, 10, 20));
    c.ellipse(50, 50, 95, 95);
    c.fill(color(128, 128, 138));
    c.ellipse(50, 50, 40, 40);
    c.ellipse(80, 50, 15, 15);
  }

  /**
   * @param {SensorState} s 
   * @returns {number} - Turn rate [-1 to 1]
   */

  run(s) {

    if (this.onCourse) {
      if (s.rightDistanceToWall <= 70.7) {
        this.newHeading = s.myHeading - 90 * (Math.random() + 0.5);
        this.onCourse = false;
      }
      if (s.leftDistanceToWall <= 70.7 || s.opponentDistance <= 120) {
        this.newHeading = s.myHeading + 90 * (Math.random() + 0.5);
        this.onCourse = false;
      }
      //console.log("new heading" + this.newHeading.toFixed(3));
    }
    else // off Course
    {
      var turn = this.newHeading - s.myHeading;
      if (turn > 180) {
        turn -= 360;
      }
      if (turn < -180) {
        turn += 360;
      }
      if (Math.abs(turn) < 10) {
        this.onCourse = true;
      }
      return turn;
    }
    return 0.0;
  }
};