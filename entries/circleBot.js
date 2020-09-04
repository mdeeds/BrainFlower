class CircleBot {
  CircleBot() {
  }

  draw(c) {
    c.noStroke();
    c.fill(color(240, 255, 34));
    c.ellipse(50, 50, 50, 50);
    c.stroke(color(0,0,0));
    c.fill(color(255, 255, 200));
    c.ellipse(50, 35, 20, 20);
  }
};
