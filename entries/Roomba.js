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
            if(s.leftDistanceToWall <=60)
            {
                this.newHeading = s.myHeading + 1.5+Math.random()/5;
                this.onCource = false;
            }
            if(s.rightDistanceToWall <=60 || s.opponentDistance <= 120)
            {
                this.newHeading = s.myHeading - 1.5-Math.random()/5;
                this.onCource = false;
            }
            //console.log("new heading" + this.newHeading.toFixed(3));
        }
        else // off cource
        {
            var turn = this.newHeading-s.myHeading;
            if (turn > Math.PI)
            {
                turn -= (2*Math.PI);
            }
            if(turn < -Math.PI)
            {
                turn += (2*Math.PI);
            }
            if(Math.abs(turn) < 0.1)
            {
                this.onCource = true;
            }
            return[-1.0,turn]
        }
        return [0.5,Math.random()/20];
    }
  };