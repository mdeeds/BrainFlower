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
            return -0.5


        } else if (s.rightFlowerDistance < s.leftFlowerDistance) {

            return 0.5


        }
        else if (s.leftDistanceToWall < 70.8 && s.rightDistanceToWall < 70.8) {
            return 0.9;
        } else if (s.leftDistanceToWall = 50) {
            return 0.
        } else if (s.leftDistanceToWall = 50)
            return 0.9;

        return 0.1;
    }
}