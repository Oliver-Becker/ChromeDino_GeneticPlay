import { format } from "path";
import PriorityQueue from "priorityqueue";
import 'babel-polyfill';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import { Runner } from '../game';
import GeneticModel from '../ai/models/genetic/GeneticModel';
import RandomModel from '../ai/models/random/RandomModel';

const comparator = (a, b) => {
  const x = a.fitness;
  const y = b.fitness;
//  console.info("TESTEEE %d %d", x, y);
  return (a.fitness > b.fitness)? -1: 1;
};
// const DINO_COUNT = 10;

let runner = null;

const fitList = new PriorityQueue( {comparator} );
const fitList2 = [];
const rankList = [];
const geneticModel = new GeneticModel();

let firstTime = true;

function setup() {
  // Initialize the game Runner.
  runner = new Runner('.game', {
    DINO_COUNT:10,
    onReset: handleReset,
    onCrash: handleCrash,
    onRunning: handleRunning
  });
  // Set runner as a global variable if you need runtime debugging.
  window.runner = runner;
  // console.info(runner)
  // Initialize everything in the game and start the game.
  runner.init();
}


function handleReset(Dinos) {
  if (firstTime) {
    firstTime = false;
    // console.info("in here")
    // console.info(Dinos)
    Dinos.forEach((dino) => {
      // console.info("happened");
      dino.model = new RandomModel();
      dino.model.init();
    });
    
  }
  else {
    // Train the model before restarting.
    // console.info('Training');
    let k;
    const chromosomes = fitList2.map((dino) => dino.model.getChromosome());
    const chromosomes2 = rankList.map((dino) => dino.model.getChromosome());
    // Clear rankList
    fitList2.splice(0);
    rankList.splice(0);
    geneticModel.fit(chromosomes);
    Dinos.forEach((dino, i) => {
      dino.model.setChromosome(chromosomes[i]);
    });
    Dinos.forEach((dino, i) => {
      dino.fitness = 0;
    });
  }
}

function handleRunning(dino, state) {
  let action = 0;
  if (!dino.jumping) {
    action = dino.model.predictSingle(convertStateToVector(state));
  }
  return action;
}

function handleCrash(dino) {
  console.info("i was called");
  console.info("Fitness: %d", dino.fitness);
  fitList.push(dino);
  let k;
  if (!rankList.includes(dino)&& !fitList2.includes(dino)){
    rankList.unshift(dino);
    if(fitList2.length === 0){
      fitList2.push(dino);
    }
    else{
      let flag=0;
      for(k=0; k<fitList2.length; k+=1){
        if(dino.fitness > fitList2[k].fitness){
          fitList2.splice(k, 0, dino);
          flag = 1;
          break;
        }
      }
      if(!flag){
        fitList2.push(dino);
      }
    }

  }
  // for(k=0; k<fitList2.length; k+=1){
  //   console.info("socorro: %d",fitList2[k].fitness);
  // }

  // dino.fitness = 0; 
}

function convertStateToVector(state) {
  if (state) {
    let a = 0;
    if(state.obstacleType === 'PTERODACTYL')
      a = 1;
    return [
      state.obstacleX / CANVAS_WIDTH,
      (CANVAS_HEIGHT - state.obstacleY)/CANVAS_HEIGHT,
      state.obstacleWidth / CANVAS_WIDTH,
      state.speed / 100,
      a
    ];
  }
  return [0, 0, 0, 0, 0];
}

document.addEventListener('DOMContentLoaded', setup);
