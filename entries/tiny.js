class tinyBot {
    /**
     * Draws the CircleBot.
     * @param {Renderer} c 
     */
    draw(c) {
      c.noStroke();
      c.fill(color("darkviolet"));
      c.ellipse(50, 50, 95, 95);
      c.stroke(color(0, 0, 0));
      c.fill(color(255, 255, 200));
      c.ellipse(80, 50, 20, 20);
      c.ellipse(80, 50, 15, 15);
  
      c.rect(40, 40, 20, 20);
    }
  
    /**
     * @param {SensorState} s 
     * @returns {number} - Turn rate [-1 to 1]
     */
    run(s) {
      // Try adding a "if" statement like the one in lesson3.js or closeBot.js.
      return 0.15;
    }
  };