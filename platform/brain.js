class BrainSpec {
  /**
   * Creates a brain specification from options
   *   layers - an array of integers the sizes of  the layers.
   *   activations - array of strings: activation functions for each layer
   *     plus one activation for the output layer.
   *   optimizer - name of the optimizer: 'sgd' or 'adam'
   *   simplify - boolean : activates model regularization.
   *   
   * @param {Object} options 
   */
  constructor(options) {
    options ||= {};
    this.options = options;
    if (!("layers" in options)) {
      options.layers = [4];
    }
    if (!("activations" in options)) {
      options.activations ||= ["tanh", "linear"];
    }
    if (!("optimizer" in options)) {
      options.optimizer ||= "adam";
    }
    if (!("simplify" in options)) {
      options.simplify = true;
    }
  }

  /**
   * Creates a model from the BrainSpec.
   * @returns {tf.Model} - a new model created from the spec.
   */
  createModel() {
    console.assert(
      this.options.layers.length + 1 == this.options.activations.length);
    let newModel = tf.tidy(() => {
      const input = tf.input({ shape: [kInputSize] });
      let previousLayerSize = kInputSize;
      let layerIndex = 0;
      let previousLayer = input;
      for (let layerSize of this.options.layers) {
        let layerOptions = {
          inputShape: [previousLayerSize],
          units: layerSize,
          activation: this.options.activations[layerIndex],
        }
        if (this.options.simplify) {
          layerOptions.kernelRegularizer = 'l1l2';
        }
        console.log("New layer: " + JSON.stringify(layerOptions));
        const layer = tf.layers.dense(layerOptions);
        previousLayer = layer.apply(previousLayer);
      }
      let outputOptions = {
        units: kOutputSize,
        activation: this.options.activations[
          this.options.activations.length - 1],
      }
      if (this.options.simplify) {
        outputOptions.kernelRegularizer = 'l1l2';
      }
      console.log("Output: " + JSON.stringify(outputOptions));
      const outputLayer = tf.layers.dense(outputOptions);
      const output = outputLayer.apply(previousLayer);
      let model = tf.model({ inputs: input, outputs: output });
      return model;
    });
    return newModel;
  }

  /**
   * Copies weights from `modelIn` into `modelOut` if they are the same
   * shape. 
   */
  copyWeights(modelIn, modelOut) {
    // TODO
  }

  /**
   * Compiles the model with the optimizer from the specification.
   * @param {tf.Model} model 
   */
  compile(model) {
    let compileOptions = {
      loss: 'meanSquaredError'
    };
    if (this.options.optimizer == "adam") {
      compileOptions.optimizer = tf.train.adam();
    } else {
      compileOptions.optimizer = this.options.optimizer;
    }
    model.compile(compileOptions);
  }
}

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
    this.brainSpec = new BrainSpec();
  }

  async loadOrCreate(modelName) {
    let name = modelName || this.name;
    try {
      this.model = await tf.loadLayersModel('indexeddb://' + name);
      this.dirty = false;
      console.log("Model loaded.");
    } catch (e) {
      console.log(e);
      this.model = this.createModel();
    }
    this.compileModel();
  }

  compileModel() {
    this.brainSpec.compile(this.model);
  }

  createModel(e) {
    const input = tf.input({ shape: [kInputSize] });
    let model = this.brainSpec.createModel();
    this.dirty = true;
    console.log("New model created.");
    return model;
  }

  reset() {
    this.model = this.createModel();
    this.compileModel();
    this.dirty = true;
  }

  saveTimeout() {
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
  resetModel123() {
    this.model.res
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
    this.dirty = true;
  }
}