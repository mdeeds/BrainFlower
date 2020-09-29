class LearnBot {
  constructor(referenceBot, recordExamples, alwaysLearning) {
    this.brain = new Brain("LearnBot");

    let body = document.getElementById('body');
    body.addEventListener('keydown', LearnBot.prototype.handleKey.bind(this));
    this.learning = !!alwaysLearning;
    this.alwaysLearning = !!alwaysLearning;
    this.referenceBot = referenceBot || new CircleBot();
    this.recordExamples = !!recordExamples;
    this.observedInputs = [];
    this.observedOutputs = [];
  }

  setReference(referenceBot) {
    this.referenceBot = referenceBot;
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
    if (this.alwaysLearning) {
      return;
    }
    if (e.type === 'keydown') {
      if (e.code === 'KeyA') {
        this.learning = false;
      } else if (e.code === 'KeyL') {
        this.learning = true;
      }
    }
  }

  /**
   * @returns {Tensor[]} an array of two Tensors representing the 
   * output from the reference robot.
   */
  getExamples() {
    let N = this.observedInputs.length;
    console.assert(N == this.observedOutputs.length);
    let inputTensor = tf.tensor2d(this.observedInputs, [N, kInputSize]);
    let outputTensor = tf.tensor2d(this.observedOutputs, [N, kOutputSize]);
    return [inputTensor, outputTensor];
  }

  /**
   * 
   * @returns {tf.Model} model 
   */
  getModel() {
    return this.brain.model;
  }

  /**
   * @param {SensorState} s 
   * @returns {number[]} - [ speed, turn ] 
   */
  run(s) {
    let input = s.asArray();
    if (this.learning) {
      let turn = this.referenceBot.run(s);
      // this.brain.train(input, [turn]);
      if (this.recordExamples) {
        this.observedInputs.push(input);
        this.observedOutputs.push([turn]);
      }
      return turn;
    } else {
      return this.brain.infer(input)[0];
    }
  }
};
