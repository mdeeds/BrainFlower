class SimpleBot {
  draw(c) {
    c.stroke(color("DarkBlue"));
    c.strokeWeight(5);
    c.fill("SlateGray");
    c.ellipse(50, 50, 95, 95);
    c.rect(50, 45, 20, 10);
  }

  run(s) {
    if (s.leftFlowers == 0 ||
      s.leftFlowerDistance > s.rightFlowerDistance) {
      return 1;
    } else {
      return 0;
    }
  }
}