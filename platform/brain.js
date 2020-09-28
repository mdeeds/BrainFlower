
class Regularizer1 {
  /**
   * 
   * @param {tf.Tensor} x
   * @returns {tf.Scalar} 
   */
  apply(x) {
    let regularization = tf.sum(
      tf.mul(tf.scalar(0.01),
        tf.relu(tf.sub(tf.abs(x), tf.scalar(0.1)))));
    return regularization.asScalar();
  }

  getClassName() {
    return this.className;
  }

  getConfig() {
    return {};
  }

  static className = 'Regularizer1';
};

tf.serialization.registerClass(Regularizer1);

class Brain {
  /**
   * 
   * @param {string} name - The name of the brain.  If a brain with this name
   * already exists, that one is returned, otherwise a new brain is created and
   * this name is used to periodically save the model. 
   */
  constructor(name) {
    console.log("New Brain.");
    this.name = name;
    this.loadOrCreate().then(() => {
      this.saveTimeout();
    });
    this.totalLoss = 0;
    this.lossObservations = 0;
  }

  async loadOrCreate() {
    try {
      this.model = await tf.loadLayersModel(
        'indexeddb://xx' + this.name);
      this.dirty = false;
      console.log("Model loaded.");
    } catch (e) {
      console.log(e);

      const input = tf.input({shape: [kInputSize]});
      const firstLayer = tf.layers.dense({
        inputShape: [kInputSize], units: 4,  activation: 'tanh',
        kernelRegularizer: 'l1l2',
      });
      const secondLayer = tf.layers.dense({
        units: kOutputSize, activation: 'linear', kernelRegularizer: 'l1l2',
      })
      const output = secondLayer.apply(firstLayer.apply(input));

      this.model = tf.model({inputs: input, outputs: output});

      this.dirty = true;
      console.log("New model created.");
    }
    this.model.compile({
      //optimizer: 'sgd',
      optimizer: tf.train.adam(),
      loss: 'meanSquaredError'
    });
  }

  saveTimeout() {
    console.log("Mean loss: " +
      (this.totalLoss / this.lossObservations));
    this.maybeSave();
    setTimeout(Brain.prototype.saveTimeout.bind(this), 1000);
  }

  maybeSave() {
    if (this.dirty) {
      this.model.save('indexeddb://' + this.name).then(() => {
        this.dirty = false;
        console.log("Saving model.");
      });
    }
  }

  /**
   * 
   * @param {number[]} x
   * @returns {number} - The result of running the model
   */
  infer(x) {
    if (!this.model) {
      console.log("Model not loaded yet...");
      return 0.0;
    }
    let outputTensor =
      this.model.predict(tf.tensor2d([x], [1, x.length]));
    let output = outputTensor.dataSync();
    return output;
  }

  /**
   * 
   * @param {number[]} x 
   * @param {number[]} y  - The desired result of running the model
   */
  train(x, y) {
    this.learn(x, y);
    return y;
  }

  async learn(x, y) {
    // TODO: add to the learning batch and start learning if it is not running.
    const ys = tf.tensor2d([y], [1, y.length]);
    const xs = tf.tensor2d([x], [1, x.length]);
    let result =
      await this.model.fit(xs, ys, { epochs: 1 });
    this.totalLoss += result.history.loss[0];
    ++this.lossObservations;
    this.dirty = true;
  }
}