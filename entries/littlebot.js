class littlebot{/**
   * Draws the CircleBot.
   * @param {Renderer} c 
   */
  draw(c) {
    c.noStroke();
    c.fill(color("hotpink"));
    c.ellipse(50, 50, 95, 95); 
    c.stroke(color("aqua"));
    c.fill(color("magenta"));
    c.ellipse(80, 50, 20, 20);
    c.ellipse(80, 50, 15, 15);
    
    c.rect(40, 40, 20, 20);
  }

  /**
   * @param {SensorState} s 
   * @returns {number} - turn 
   */
  run(s) {
    // Try adding an "if" statement like one from "closeBot.js" or "lesson3.js"
    return 0.15;
  }
};