/**
 * Runs the robots and physics simulation without any draw operations.
 */
function runFrame(robotDisplays, flowers) {
    if (Math.random() < 0.005) {
      addRandomFlower();
    }
    for (r of robotDisplays) {
      let rc = r.robotContainer;
      let s = generateSenses(rc);
      rc.robot.run(s);
      let forward = Math.max(0, Math.min(1, s.speed - Math.abs(s.turn)));
      let turn = Math.max(-1, Math.min(1.0, s.turn));
      rc.t += turn / 10.0;
      rc.forward(forward * 5);
    }
    for (r1 of robotDisplays) {
      for (r2 of robotDisplays) {
        if (r1 != r2) {
          r1.robotContainer.collide(r2.robotContainer);
        }
      }
    }
    for (r of robotDisplays) {
      r.robotContainer.update();
    }
    for (f of flowers) {
      checkFlower(f);
    }
  }
  