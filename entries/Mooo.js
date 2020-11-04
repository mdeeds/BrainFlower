class Mooo {
  draw(c) {
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
    c.ellipse(70, 50, 20, 20);
  }
  s1(s) {
    if (s.leftFlowerDistance < s.rightFlowerDistance) {
      return -0.25;
    } else if (s.leftFlowerDistance > s.rightFlowerDistance) {
      return 0.25;
    }
    
    else if (s.leftFlowerDistance = s.rightFlowerDistance) {
      return 0;
    }
    return 1;
  }
  s2(s)
  { 
    if (s.opponentAngle < -10) {
      return -0.89;
    } else if (s.opponentAngle < 10) {

      return 0;
    }

    else {
      return 0.89;
    }}
  
  /*@param {SensorState} s 
  /*@returns {number} - Turn rate [-2 to 2]
 /****/
  run(s) {
    if (s.opponentScore > s.myScore) {
      return this.s2(s);
    } else if (s.opponentScore < s.myScore) {
      return this.s1(s);
    }
    if (s.opponentScore = s.myScore) {
      return this.s2(s);




    }

  }
}