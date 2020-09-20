/**
 * Matt's robot for the BrainFlower tournament.
 */

 class MattBot {
     draw(c) {
         c.fill(color("LightBlue"));
         c.stroke(color("RoyalBlue"));
         c.strokeWeight(10);
         c.ellipse(50, 50, 90, 90);
         c.rect(80, 30, 20, 40);
     }
 }