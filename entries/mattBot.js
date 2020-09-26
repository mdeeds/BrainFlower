/**
 * Matt's entry in the BrainFlower Game
 */
class MattBot {
    /**
     * 
     * @param {number} left 
     * @param {number} right 
     */
    constructor(left, right) {
        this.left = left || 0.3;
        this.right = right || -0.4;
        if (typeof right == "undefined") {
            this.name = "MattBot";
        } else {
            this.name =
                "MatBot:" + this.left.toFixed(2)
                + ":" + this.right.toFixed(2);
        }
    }

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
            return this.left;
        } else {
            return this.right;
        }
    }
}