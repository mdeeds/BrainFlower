class KeyBot {
  constructor() {
    this.x = 0;
  }

  draw(c) {
    c.fill(color(128, 32, 255));
    c.ellipse(50, 50, 95, 80);
    c.rect(0,30,10,10);
    c.rect(80,20,10,10);
  }
}
