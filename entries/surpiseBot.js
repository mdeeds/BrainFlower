class Kili {

    draw(c) {
        c.noStroke();
        c.fill(color("Turquoise"));
        c.ellipse(50, 50, 100, 100);
        c.fill(color("DarkOrange"));
        c.arc(50, 50, 80, 80, radians(21.5), radians(360 - 21.5));
    }

    /**
     * @param {SensorState} s 
     * @returns {number} - Turn rate [-1 to 1]
     */
    run(s) {
        if (s.rightFlowers > s.leftFlowers) {
            return -0.5;
        } else {
            return 0.5;
        }
    }

}