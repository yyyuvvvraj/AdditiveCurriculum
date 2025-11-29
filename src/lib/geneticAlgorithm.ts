/**
 * Genetic Algorithm for Predictive Maintenance Scheduling Optimization
 * 
 * Evolves maintenance schedules to minimize:
 * - Machine downtime
 * - Maintenance costs
 * - Unexpected failures
 * 
 * Chromosome: Array of maintenance days (0-30 day window per machine)
 * Fitness: Lower cost + higher uptime + fewer failures = higher fitness
 */

export interface Machine {
  id: string;
  name: string;
  health: number; // 0-100%
  temp: number; // current temperature
  vibration: number; // current vibration
  lastMaintenance: number; // days ago
  failureRisk: number; // 0-100%
}

export interface MaintenanceSchedule {
  machineId: string;
  daysTillMaintenance: number; // when to schedule it
  priority: 'low' | 'medium' | 'high';
  estimatedCost: number;
  failureRiskReduction: number;
}

export interface GeneticAlgorithmResult {
  schedules: MaintenanceSchedule[];
  totalCost: number;
  expectedUptime: number;
  generation: number;
  fitness: number;
}

class MaintenanceGA {
  private populationSize: number;
  private generations: number;
  private mutationRate: number;
  private machines: Machine[];

  constructor(
    machines: Machine[],
    populationSize = 50,
    generations = 20,
    mutationRate = 0.15
  ) {
    this.machines = machines;
    this.populationSize = populationSize;
    this.generations = generations;
    this.mutationRate = mutationRate;
  }

  /**
   * Generate random chromosome (maintenance schedule for all machines)
   */
  private createChromosome(): number[] {
    return this.machines.map(() => Math.floor(Math.random() * 31)); // 0-30 days
  }

  /**
   * Evaluate fitness of a schedule
   * Higher fitness = better schedule
   */
  private calculateFitness(chromosome: number[]): number {
    let totalCost = 0;
    let totalFailureRisk = 0;
    let totalUptimeBoost = 0;

    chromosome.forEach((maintenanceDay, idx) => {
      const machine = this.machines[idx];
      
      // Cost increases with maintenance frequency
      const maintenanceCost = 500 + (machine.health > 80 ? 100 : 300);
      const frequencyPenalty = maintenanceDay === 0 ? maintenanceCost : maintenanceCost / (maintenanceDay + 1);
      totalCost += frequencyPenalty;

      // Failure risk decreases if we maintain before critical health
      const riskReduction = machine.failureRisk > 50 && maintenanceDay < 15 ? 30 : 5;
      totalFailureRisk -= riskReduction;

      // Uptime boost from proactive maintenance
      const uptimeGain = machine.health < 60 && maintenanceDay < 10 ? 15 : 5;
      totalUptimeBoost += uptimeGain;
    });

    // Fitness = maximize uptime, minimize cost & risk
    // Score = (uptime * 10) - (cost * 0.5) - (risk * 2)
    const fitness = totalUptimeBoost * 10 - totalCost * 0.5 - totalFailureRisk;
    return Math.max(fitness, 0.1); // avoid zero fitness
  }

  /**
   * Selection via tournament (better chromosomes selected more often)
   */
  private selectParents(population: number[][], fitnesses: number[]): number[][] {
    const parents: number[][] = [];
    for (let i = 0; i < this.populationSize; i++) {
      const idx1 = Math.floor(Math.random() * this.populationSize);
      const idx2 = Math.floor(Math.random() * this.populationSize);
      parents.push(
        fitnesses[idx1] > fitnesses[idx2] ? population[idx1] : population[idx2]
      );
    }
    return parents;
  }

  /**
   * Crossover: blend two parent schedules
   */
  private crossover(parent1: number[], parent2: number[]): number[] {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    return [
      ...parent1.slice(0, crossoverPoint),
      ...parent2.slice(crossoverPoint)
    ];
  }

  /**
   * Mutation: randomly adjust maintenance days
   */
  private mutate(chromosome: number[]): number[] {
    return chromosome.map(day =>
      Math.random() < this.mutationRate
        ? Math.floor(Math.random() * 31)
        : day
    );
  }

  /**
   * Run genetic algorithm
   */
  public evolve(): GeneticAlgorithmResult {
    let population = Array(this.populationSize)
      .fill(null)
      .map(() => this.createChromosome());

    let bestChromosome = population[0];
    let bestFitness = 0;

    for (let gen = 0; gen < this.generations; gen++) {
      const fitnesses = population.map(c => this.calculateFitness(c));
      const maxFitness = Math.max(...fitnesses);
      const maxIdx = fitnesses.indexOf(maxFitness);

      if (maxFitness > bestFitness) {
        bestFitness = maxFitness;
        bestChromosome = population[maxIdx];
      }

      // Elitism: keep top 10%
      const eliteCount = Math.ceil(this.populationSize * 0.1);
      const sortedIndices = fitnesses
        .map((f, i) => ({ f, i }))
        .sort((a, b) => b.f - a.f)
        .map(x => x.i);

      const elite = sortedIndices.slice(0, eliteCount).map(i => population[i]);

      // Create new generation
      const parents = this.selectParents(population, fitnesses);
      const newPopulation: number[][] = [...elite];

      while (newPopulation.length < this.populationSize) {
        const p1 = parents[Math.floor(Math.random() * parents.length)];
        const p2 = parents[Math.floor(Math.random() * parents.length)];
        let child = this.crossover(p1, p2);
        child = this.mutate(child);
        newPopulation.push(child);
      }

      population = newPopulation;
    }

    return this.scheduleFromChromosome(bestChromosome, bestFitness);
  }

  /**
   * Convert best chromosome to actionable maintenance schedules
   */
  private scheduleFromChromosome(
    chromosome: number[],
    fitness: number
  ): GeneticAlgorithmResult {
    const schedules: MaintenanceSchedule[] = chromosome.map((day, idx) => {
      const machine = this.machines[idx];
      const failureRiskReduction = machine.failureRisk > 50 ? 40 : 15;
      const cost = 500 + (machine.health > 80 ? 100 : 300);

      let priority: 'low' | 'medium' | 'high' = 'low';
      if (machine.failureRisk > 70) priority = 'high';
      else if (machine.failureRisk > 40) priority = 'medium';

      return {
        machineId: machine.id,
        daysTillMaintenance: day,
        priority,
        estimatedCost: cost,
        failureRiskReduction
      };
    });

    const totalCost = schedules.reduce((sum, s) => sum + s.estimatedCost, 0);
    const expectedUptime = 100 - schedules.reduce((avg, s) => avg + (100 - s.failureRiskReduction) / schedules.length, 0);

    return {
      schedules,
      totalCost,
      expectedUptime,
      generation: this.generations,
      fitness: Math.round(fitness)
    };
  }
}

/**
 * Main export function for use in React hooks
 */
export function optimizeMaintenanceSchedule(
  machines: Machine[],
  populationSize?: number,
  generations?: number,
  mutationRate?: number
): GeneticAlgorithmResult {
  const ga = new MaintenanceGA(machines, populationSize, generations, mutationRate);
  return ga.evolve();
}

/**
 * Standalone GA for testing
 */
export { MaintenanceGA };
