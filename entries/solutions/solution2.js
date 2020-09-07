/**
 * Matt's entry for Robo Harvest
 */
 class MattBot {
     constructor() {
         this.turnRate = 0;
     }
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
     * 
     * @param {SensorState} s 
     */
    run(s) {
      s.turn = this.turnRate;
      this.turnRate += 1 / kFramesPerRound;
      s.speed = 1.0;
    }
}
