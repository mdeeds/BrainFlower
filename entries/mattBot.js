/**
 * Matt's entry in the BrainFlower Game
 */
class MattBot {
    draw(c) {
        c.strokeWeight(10);
        c.stroke(color("PaleTurquoise"));
        c.fill(color("LightSkyBlue"));
        c.ellipse(50, 50, 90, 90);
        c.rect(75, 30, 20, 40);
    }

    /**
     * 
     * @param {SensorState} s 
     */
    run(s) {
        if (s.leftFlowers > s.rightFlowers) {
            return 0.3;
        } else {
            return -0.4;
        }
    }
}