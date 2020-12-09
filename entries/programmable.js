class Programmable {
  constructor(messageBox) {
    this.code = "";
    this.messageBox = messageBox;
  }
  draw(c) {
    c.stroke(color("DarkBlue"));
    c.strokeWeight(5);
    c.fill("SlateGray");
    c.ellipse(50, 50, 95, 95);
    c.rect(50, 45, 20, 10);
  }

  setCode(code) {
    this.code = code;
  }

  run(s) {
    let result = 0;
    try {
      result = eval(this.code);
    } catch (e) {
      this.messageBox.innerText = e.message;
    }
    if (!result) {
      result = 0;
    }
    return result;
  }
}