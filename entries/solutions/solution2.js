/**
 * Matt's entry for Brain Flower
 */
 class MattBot2 {
        constructor() {}
    /**
     * @param {Renderer} c 
     */
    draw(c) {
        c.strokeWeight(10);
        c.stroke("LightSkyBlue");
        c.fill(color("CornflowerBlue"));
        c.ellipse(50, 50, 90, 90);
        c.rect(80, 50-12, 5, 24);
    }

    /**
     * @param {SensorState} s 
     * @returns {number} - turn 
     */
    run(s) {
        if (s.rightFlowers > s.leftFlowers) {
            return -0.3;
        } else {
            return 0.2;
        }
    }
}
