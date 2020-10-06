class Mooo  {
    draw(c)  {
        c.fill(color("black"))
        c.stroke(color("aquamarine"))
        c.strokeWeight(10)
        c.noStroke();
   
        
        
        c.noStroke();
        c.fill(color("black"))
        c.ellipse(50, 50, 100, 100);
        c.stroke(color("aquamarine"))
        c.strokeWeight(8);
        c.ellipse(60, 50, 80, 80);
        c.fill(color("gray"))
        c.ellipse(65, 50, 60, 60);
        c.fill(color("red"))
        c.stroke(color("red"))
        c.ellipse(70 , 50, 20, 20);
      }
  /**
   * @param {SensorState} s 
   * @returns {number} - Turn rate [-1 to 1]
   */
  run(s) {
    if (s.opponentAngle < -60) {
      return -0.8;
    } else if (s.opponentAngle < -10) {
      return -0.20;
    } else if (s.opponentAngle < -5) {
      return -0.20;
    } else if (s.opponentAngle < 5) {
      return 0.20;
    } else if (s.opponentAngle < 10) {
      return 0.20;
    } else if (s.opponentAngle < 60) {
      return 0.20;
    } else {
      return -0.10;
    }
  }  
}