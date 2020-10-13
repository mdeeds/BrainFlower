/**Sabrina's first robot */
class monsterbot {
    draw(c) {
        c.strokeWeight(8);
        c.fill(color("Azure"));
        c.ellipse(50, 50, 50, 100);
        c.ellipse(30, 30, 30, 30);
        c.rect(50, 50, 50, 50);
        c.ellipse(20, 60, 60, 60);
        // c.ellipse(20, 20, 20, 20)
        // c.rect(0, 0, 0, 0);
        // c.rect(0, 0, 0, 0); 

    }

    /**
     * @param {SensorState} s 
     * @returns {number} - Turn rate [-1 to 1]
     */
    run(s) {
        if (s.rightFlowers > s.leftFlowers) {
            return -0.2;
        if (s.leftFlowers > s.rightFlowers)
            return 0.2;    
        } else {
            return 0.2;
        
        }
    }
}