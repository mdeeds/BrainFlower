class Roomba {
    constructor()
    {
        this.newHeading = 0;
        this.onCource = true;
    }

    /**
     * Draws the bot.
     * @param {Renderer} c 
     */
    draw(c) {
      c.noStroke();
      c.fill(color(10, 10, 20));
      c.ellipse(50, 50, 95, 95);
      c.fill(color(128, 128, 138));
      c.ellipse(50, 50, 40, 40);
      c.ellipse(80, 50, 15, 15);
    }
  
    /**
     * @param {SensorState} s 
     * @returns {number[]} - [ speed, turn ] 
     */

    run(s) {
        
        if(this.onCource)
        {
            if(s.leftDistanceToWall <= 70.7)
            {
                this.newHeading = s.myHeading + 90 * (Math.random() + 0.5);
                this.onCource = false;
            }
            if(s.rightDistanceToWall <= 70.7 || s.opponentDistance <= 120)
            {
                this.newHeading = s.myHeading - 90 * (Math.random() + 0.5);
                this.onCource = false;
            }
            //console.log("new heading" + this.newHeading.toFixed(3));
        }
        else // off cource
        {
            var turn = this.newHeading-s.myHeading;
            if (turn > 180)
            {
                turn -= 360;
            }
            if(turn < -180)
            {
                turn += 360;
            }
            if(Math.abs(turn) < 10)
            {
                this.onCource = true;
            }
            return turn;
        }
        return Math.random() / 20;
    }
  };