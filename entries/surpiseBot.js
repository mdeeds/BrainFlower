class surpriseBot {
  constuctor(turn = 0.10) {
    this.turn = turn
  }


  draw(c) {
    c.noStroke();
    c.fill(color("Turquoise"));
    c.ellipse(50, 50, 100, 100);
    c.fill(color("DarkOrange"));
    c.arc(50, 50, 80, 80, radians(21.5), radians(360 - 21.5));
  }

  /**
   * @param {SensorState} s 
   * @returns {number} - Turn rate [-1 to 1]
   */
  run(s) {
    if (s.opponentScore > s.myScore) {
      let turn = s.opponentAngle / 45;
      return Math.max(-1, Math.min(1, turn));
     } else if ((s.leftFlowers > 0 || s.rightFlowers > 0)
      && s.leftFlowerDistance == s.rightFlowerDistance) {
      return 0;
    }
    else if (s.leftDistanceToWall < 70.8 || s.rightDistanceToWall < 70.8) {
      return 0.9;  // Try moving this "if" block to the top of the function.
    }
    else if (s.leftFlowers > s.rightFlowers) {
      return -this.turn;
    } else if (s.leftFlowerDistance < s.rightFlowerDistance) {
      return this.turn;
    }
    return 0.1;
  
}
}