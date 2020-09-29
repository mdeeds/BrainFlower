class Regularizer1 {
  /**
   * 
   * @param {tf.Tensor} x
   * @returns {tf.Scalar} 
   */
  apply(x) {
    let regularization = 
    tf.tidy(() => {
    tf.sum(
      tf.mul(tf.scalar(0.01),
        tf.relu(tf.sub(tf.abs(x), tf.scalar(0.1)))))});
        
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

class MultiplierLayer extends tf.layers.Layer {
  constructor(config) {
    super(config);
  }

  build(inputShape) {
    this.x = this.addWeight('x', [], 'float32', tf.initializers.ones());
  }

  call(input) {
    return tf.tidy(() => {
      return tf.mul(input[0], this.x.read());
    });
  }

  getConfig() {
    const config = super.getConfig();
    return config;
  }
  
  static get className() {
    return 'MultiplierLayer';
  }
}

tf.serialization.registerClass(MultiplierLayer);
