class LearnBot {
  constructor() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({
      inputShape: [kInputSize], units:7, activation: 'relu'}));
    this.model.add(tf.layers.dense({
      units: kOutputSize, activation: 'sigmoid'}));
    this.model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
    let body = document.getElementById('body');
    body.addEventListener('keydown', LearnBot.prototype.handleKey.bind(this));
    this.learning = true;

    this.referenceBot = new CircleBot();
  }
  /**
   * Draws the LearnBot.
   * @param {Renderer} c 
   */
  draw(c) {
    c.noStroke();
    c.fill(color("LightGreen"));
    c.stroke(color("PaleGray"));
    c.strokeWeight(8);
    c.ellipse(40, 50, 80, 80);
    c.ellipse(50, 40, 80, 80);
    c.ellipse(50, 60, 80, 80);
    c.ellipse(60, 50, 80, 80);
  }

  handleKey(e) {
    if (e.type === 'keydown') {
      if (e.code === 'KeyA') {
        this.learning = false;    
      } else if (e.code === 'KeyL') {
        this.learning = true;
      }
    }
  }

  /**
   * @param {SensorState} s 
   */
  async run(s) {
    let arr = s.asArray();
    let input = arr.slice(0, kInputSize);
    if (this.learning) {
      this.referenceBot.run(s);
      let referenceArray = s.asArray();
      const ys = tf.tensor2d(
        [referenceArray.slice(kInputSize)], [1, kOutputSize]);
      const xs = tf.tensor2d([input], [1, kInputSize]);
      await this.model.fit(xs, ys, {epochs: 1});
    } else {
      let outputTensor = 
        this.model.predict(tf.tensor2d([input], [1, kInputSize]));
      let output = outputTensor.dataSync();
      s.setOutputFromArray(output);
    }
  }
};
