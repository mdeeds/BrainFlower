var entries = [];
var robotImages = [];

function setup() {
  createCanvas(400, 400);
  
  entries.push(new KeyBot());
  entries.push(new CircleBot());
  // Add other entries here.

  for (e of entries) {
    console.log("Entry: " + JSON.stringify(e));
    let canvas = createGraphics(100, 100);
    if (e.draw) {
      e.draw(canvas);
    }
    robotImages.push(canvas);
  }
}

var angle = 0;

function draw() {
  background(220);
  let x = 50;
  for (r of robotImages) {
    translate(x, 100);
    rotate(angle);
    translate(-20, 0);
    image(r, -50, -50);
    resetMatrix();
    x += 100;
  }

  angle += 0.02;
}
