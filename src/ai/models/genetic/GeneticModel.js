import Model from '../Model';

export default class GeneticModel extends Model {
  train(chromosomes) {
    this.populateNextGeneration(chromosomes, 0.5);
    /*
    const parents = this.select(chromosomes);
    const offspring = this.crossOver(parents, chromosomes);
    this.mutate(offspring);
    */
  }

  fit(chromosomes) {
    this.train(chromosomes);
  }

  select(chromosomes) {
    const parents = [chromosomes[0], chromosomes[1]];
    return parents;
  }

  populateNextGeneration(chromosomes, mutateRate) {
    const fittest = chromosomes[0];

    for (let i = 1; i < chromosomes.length; i += 1) {
      chromosomes[i] = this.arithmeticRecombination([fittest, chromosomes[i]]);
    }

    this.mutate(chromosomes, mutateRate);
    chromosomes[0] = fittest; // Keep the fittest unmutated
  }

  crossOver(parents, chromosomes) {
    // const offspring = this.onePointCrossOver(parents);
    const offspring = this.onePointCrossOver(parents);
    // Replace the last 2 with the new offspring
    for (let i = 0; i < 2; i += 1) {
      chromosomes[chromosomes.length - i - 1] = offspring[i];
    }
    console.info("child: ",offspring)
    return offspring;
  }

  onePointCrossOver(parents) {
    console.info("doing One Point CrossOver");
    const offspring1 = parents[0];
    const offspring2 = parents[1];

    // Select a random crossover point
    const crossOverPoint = Math.floor(Math.random() * offspring1.length);
    // Swap values among parents
    for (let i = 0; i < crossOverPoint; i += 1) {
      [offspring1[i], offspring2[i]] = this.swap(offspring1[i], offspring2[i]);
    }
    return [offspring1, offspring2];
  }

  multiPointCrossOver(parents) {
    console.info("doing Multi Point CrossOver");
    const offspring1 = parents[0];
    const offspring2 = parents[1];
    console.info("off1:",offspring1);
    console.info("off2:",offspring2);

    // Select the number of points to cut
    const cutNumber = 1 + Math.floor(Math.random() * (offspring1.length - 1) / 2);
    console.info("cutNumber: ", cutNumber);

    // For the amount of cuts...
    for (let cut = 0, i = 0; cut < cutNumber; cut += 1) {

      // Get the point of this cut
      const maxPoint = (offspring1.length - i - cutNumber + cut);
      const crossOverPoint = i + Math.floor(Math.random() * maxPoint);
      console.info("cross here: ",crossOverPoint);
      while (i < crossOverPoint) {
        if (cut%2) {  // Alternate between crossing and dont crossing the genes
          [offspring1[i], offspring2[i]] = this.swap(offspring1[i], offspring2[i]);
        }
        i += 1;
      }
    }
    console.info("off1:",offspring1);
    console.info("off2:",offspring2);
    return [offspring1, offspring2];
  }

  uniformCrossOver(parents, crossChance){
    const offspring1 = parents[0];
    const offspring2 = parents[1];

    for (let i = 0; i < offspring1.length; i += 1) {
      if (Math.random() < crossChance) {
        [offspring1[i], offspring2[i]] = this.swap(offspring1[i], offspring2[i]);
      }
    }

    return [offspring1, offspring2];
  }

  arithmeticRecombination(parents) {
    const parent1 = parents[0];
    const offspring = parents[1];
    for (let i = 0; i < offspring.length; i += 1) {
      offspring[i] = (parent1[i] + offspring[i]) / 2;
    }

    return offspring;
  }

  // Mutates only one gene
  singleMutation(chromosome) {

  }

  // Mutates all genes with some probability
  globalMutation(chromosome) {
    for (let i = 0; i < chromosome.length ; i += 1) {
      if (Math.random() < 0.5) {
        chromosome[i] = (Math.random() - 0.5)*2;
      }
    }
  }

  // Selects a random start and end gene index and inverts the order of the values inbetween
  inversionMutation(chromosome) {

  }

  mutate(chromosomes, mutationRate) {
    console.info("mutationRate: ", mutationRate);
    for (let i = 0; i < chromosomes.length ; i += 1) {
      if (Math.random() < mutationRate) {
        this.globalMutation(chromosomes[i]);
      }
    }
  }
  mutateLegacy(chromosomes) {
    chromosomes.forEach(chromosome => {
      const mutationPoint = Math.floor(Math.random() * chromosomes.length);
      chromosome[mutationPoint] = (Math.random() - 0.5)*2;
    });
  }

  swap(a, b) {
    return [b, a];
  }
}
