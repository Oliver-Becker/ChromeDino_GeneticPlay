import Runner from './Runner';
import Trex, { checkForCollision } from './Trex';
import { CANVAS_WIDTH } from './constants';

export default class TrexGroup {
  onReset = noop;
  onRunning = noop;
  onCrash = noop;

  constructor(count, canvas, spriteDef) {
    this.tRexes = [];
    for (let i = 0; i < count; i += 1) {
      const tRex = new Trex(canvas, spriteDef);
      tRex.id = i;
      this.tRexes.push(tRex);
    }
  }

  update(deltaTime, status) {
    this.tRexes.forEach((tRex) => {
      if (!tRex.crashed) {
        tRex.update(deltaTime, status);
      }
    });
  }

  draw(x, y) {
    this.tRexes.forEach((tRex) => {
      if (!tRex.crashed) {
        tRex.draw(x, y);
      }
    });
  }

  updateJump(deltaTime, speed) {
    this.tRexes.forEach((tRex) => {
      if (tRex.jumping) {
        tRex.updateJump(deltaTime, speed);
      }
    });
  }

  reset() {
    this.tRexes.forEach((tRex) => {
      tRex.reset();
      this.onReset({ tRex });
    });
  }

  lives() {
    return this.tRexes.reduce((count, tRex) => tRex.crashed ? count : count + 1, 0);
  }

  checkForCollision(obstacle) {
    let crashes = 0;
    const state = {
      obstacleX: obstacle.xPos,
      obstacleY: obstacle.yPos,
      obstacleWidth: obstacle.width,
      obstacleType: obstacle.typeConfig.type,
      speed: Runner.instance_.currentSpeed,
    };
    this.tRexes.forEach(async (tRex) => {
      if (!tRex.crashed) {
        const result = checkForCollision(obstacle, tRex);
        if (result) {
          crashes += 1;
          tRex.crashed = true;
          this.onCrash(tRex, state );
        } else {
          const action = await this.onRunning( tRex, state );
          if (action === 1) { // Jump action
            tRex.setDuck(false);
            tRex.startJump();

            if(state.obstacleX/CANVAS_WIDTH < 0.3 && state.obstacleType !== 'PTERODACTYL'){
              tRex.fitness += 1;
            } else if(state.obstacleX/CANVAS_WIDTH < 0.3 && state.obstacleType === 'PTERODACTYL' && state.obstacleY < 100){
              tRex.fitness -= 10;
              tRex.faults += 1;
              console.info("One more fault. Total = ", tRex.faults);
              if (tRex.faults > 10) {
                console.info("Killing this dino! Too much faults...");
                crashes += 1;
                tRex.crashed = true;
                this.onCrash(tRex, state );
              }
            } else if(state.obstacleX/CANVAS_WIDTH < 0.3 && state.obstacleType === 'PTERODACTYL'){
              tRex.fitness += 1;    
            } else{
              tRex.fitness -= 1;
            }
            // console.log(tRex.fitness);
            
          } else if (action === -1) { // Duck action
            if (tRex.jumping) {
              // Speed drop, activated only when jump key is not pressed.
              tRex.setSpeedDrop();
            } else if (!tRex.jumping && !tRex.ducking) {
              // Duck.
              tRex.setDuck(true);
              if(state.obstacleX/CANVAS_WIDTH < 0.02 && state.obstacleType === 'PTERODACTYL' && state.obstacleY < 100)
                tRex.fitness += 5;
            }
          }
        }
      } else {
        crashes += 1;
      }
    });
    return crashes === this.tRexes.length;
  }
}

function noop() { }
