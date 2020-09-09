/**
 * Matt's entry for Brain Flower
 */
 class MattBot1 {
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
}
