class SensorState {
  constructor() {
    // The overlap of the left and right sensors
    this.sensorOverlap = 30;
    // The breadth of the combined sensors
    this.sensorWidth = 180;
    
    this.leftFlowers = 0;
    this.rightFlowers = 0;

    // Current driving speed.  Range 0.0 to 1.0.
    this.speed = 0.0;
    // Current turning speed.  -1.0 Left, 1.0 Right, 0.0 Straight
    this.turn = 0.0;
  }

  asArray() {
    let result = [];
    result.push(this.sensorOverlap);
    result.push(this.sensorWidth);
    result.push(this.leftFlowers);
    result.push(this.rightFlowers);
    result.push(this.speed);
    result.push(this.turn);
  }

  setFromArray(a) {
    this.sensorOverlap = a[0];
    this.sensorWidth = a[1];
    this.leftFlowers = a[2];
    this.rightFlowers = a[3];
    this.speed = a[4];
    this.turn = a[5];
  }
}
