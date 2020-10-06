/**
 * Matt's entry in the BrainFlower Game
 */
class MattBot {
  draw(c) {
    c.strokeWeight(10);
    c.stroke(color("PaleTurquoise"));
    c.fill(color("LightSkyBlue"));
    c.ellipse(50, 50, 90, 90);
    c.rect(75, 30, 20, 40);
  }

  /**
   * 
   * @param {SensorState} s 
   * @returns {number} - Turn rate [-1 to 1]
   */
  run(s) {
    if (s.leftFlowers == 0 && s.rightFlowers == 0) {
      return 1.0;
    } 
    if (s.rightFlowers > s.leftFlowers) {
      return -0.3;
    } else {
      return 0.2;
    }
  }
}