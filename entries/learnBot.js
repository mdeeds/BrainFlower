class LearnBot {
  constructor() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({
      inputShape: [kInputSize], units:7, activation: 'relu'}));
    this.model.add(tf.layers.dense({
      units: kOutputSize, activation: 'sigmoid'}));
    this.model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

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

  /**
   * @param {SensorState} s 
   */
  run(s) {
    let arr = s.asArray();
    let input = arr.slice(0, kInputSize);
    let outputTensor = 
      this.model.predict(tf.tensor2d([input], [1, kInputSize]));
    let output = outputTensor.dataSync();
    s.setOutputFromArray(output);
  }

  /**
   * 
   * @param {SensorState} s 
   */
  async learn(s) {
    let arr = s.asArray();
    let input = arr.slice(0, kInputSize);
    let output = arr.slice(kInputSize);
    const xs = tf.tensor2d([input], [1, kInputSize]);
    const ys = tf.tensor2d([output], [1, kOutputSize]);
    await this.model.fit(xs, ys, {epochs: 1});
  }
};
