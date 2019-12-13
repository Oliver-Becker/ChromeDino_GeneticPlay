import Model from '../Model';

export default class RandomModel extends Model {
  weights = [];
  biases = [];

  init() {    
    this.randomize();
  }

  predict(inputXs) {
    const inputX = inputXs[0];
    const y =
      this.weights[0] * inputX[0] +
      this.weights[1] * inputX[1] +
      this.weights[2] * inputX[2] +      
      this.weights[3] * inputX[3] +
      this.weights[4] * inputX[4] +
      this.biases[0];

      let aux;
      if(y < -.1)
        aux = 1;
      else if(y < .3)
        aux = 0;
      else 
        aux = -1;
    return aux;
  }

  train() {
    this.randomize();
  }

  randomize() {
    this.weights[0] = random();
    this.weights[1] = random();
    this.weights[2] = random();
    this.weights[3] = random();
    this.weights[4] = random();
    this.biases[0] = random();
  }
  getChromosome() {
    return this.weights.concat(this.biases);
  }

  setChromosome(chromosome) {
    this.weights[0] = chromosome[0];
    this.weights[1] = chromosome[1];
    this.weights[2] = chromosome[2];
    this.weights[3] = chromosome[3];
    this.weights[4] = chromosome[4];
    this.biases[0] = chromosome[5];
  }
}

function random() {
  return (Math.random() - .5) * 2;
}
