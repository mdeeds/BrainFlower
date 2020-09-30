class KeyBot {
  
  

  draw(c) {
    c.fill(color(128, 32, 255));
    c.ellipse(50, 50, 80, 95);
    c.rect(80,10,10,10);
    c.rect(80,80,10,10);
  }

  /**
   * @param {SensorState} s 
   * @returns {number[]} - [ speed, turn ] 
   */
  run(s) {
    return this.turn;
  }
}
