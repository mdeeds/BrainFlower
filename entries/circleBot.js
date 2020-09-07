class CircleBot {
  CircleBot() {
  }

  /**
   * Draws the CircleBot.
   * @param {Renderer} c 
   */
  draw(c) {
    c.noStroke();
    c.fill(color(240, 255, 34));
    c.ellipse(50, 50, 95, 95);
    c.stroke(color(0,0,0));
    c.fill(color(255, 255, 200));
    c.ellipse(80, 50, 20, 20);
    c.ellipse(80, 50, 15, 15);

    c.rect(40, 40, 20, 20);
  }

  /**
   * @param {SensorState} s 
   */
  run(s) {
    s.speed = 1.0;
    s.turn = 0.15;
  }
};
