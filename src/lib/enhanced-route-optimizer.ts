import { OpenAI } from 'openai';

// Enhanced Route Optimization Engine with AI Integration
export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  priority: number;
  timeWindow?: {
    start: string;
    end: string;
  };
  serviceTime?: number; // minutes
  demand?: number; // weight/volume
}

export interface Vehicle {
  id: string;
  name: string;
  capacity: number;
  maxDistance: number;
  costPerKm: number;
  startLocation: Location;
  endLocation?: Location;
  availableFrom: string;
  availableTo: string;
}

export interface RouteOptimizationResult {
  routes: Route[];
  totalDistance: number;
  totalTime: number;
  totalCost: number;
  efficiency: number;
  aiInsights: string[];
  optimizationScore: number;
}

export interface Route {
  vehicleId: string;
  locations: Location[];
  distance: number;
  time: number;
  cost: number;
  load: number;
  polyline?: string;
}

export class EnhancedRouteOptimizer {
  private openai: OpenAI;
  private osrmEndpoint = 'https://router.project-osrm.org';
  
  constructor(openaiApiKey?: string) {
    if (openaiApiKey) {
      this.openai = new OpenAI({ apiKey: openaiApiKey });
    }
  }

  // Main optimization function combining multiple algorithms
  async optimizeRoutes(
    locations: Location[],
    vehicles: Vehicle[],
    options: OptimizationOptions = {}
  ): Promise<RouteOptimizationResult> {
    try {
      // Step 1: Pre-process and validate data
      const validatedData = this.validateAndPreprocess(locations, vehicles);
      
      // Step 2: Calculate distance matrix
      const distanceMatrix = await this.calculateDistanceMatrix(validatedData.locations);
      
      // Step 3: Apply multiple optimization algorithms
      const algorithms = [
        this.geneticAlgorithm,
        this.simulatedAnnealing,
        this.antColonyOptimization,
        this.nearestNeighborWithImprovements
      ];
      
      const results = await Promise.all(
        algorithms.map(algo => algo.call(this, validatedData, distanceMatrix, options))
      );
      
      // Step 4: Select best result using AI evaluation
      const bestResult = await this.selectBestResult(results, options);
      
      // Step 5: Apply AI-powered post-optimization
      const aiOptimizedResult = await this.applyAIOptimization(bestResult, validatedData, options);
      
      // Step 6: Generate AI insights and recommendations
      const insights = await this.generateAIInsights(aiOptimizedResult, validatedData);
      
      return {
        ...aiOptimizedResult,
        aiInsights: insights,
        optimizationScore: this.calculateOptimizationScore(aiOptimizedResult)
      };
      
    } catch (error) {
      console.error('Route optimization failed:', error);
      throw new Error(`Route optimization failed: ${error.message}`);
    }
  }

  // Genetic Algorithm Implementation
  private async geneticAlgorithm(
    data: ValidatedData,
    distanceMatrix: number[][],
    options: OptimizationOptions
  ): Promise<RouteOptimizationResult> {
    const populationSize = options.populationSize || 100;
    const generations = options.generations || 500;
    const mutationRate = options.mutationRate || 0.1;
    const crossoverRate = options.crossoverRate || 0.8;
    
    // Initialize population
    let population = this.initializePopulation(data, populationSize);
    
    for (let gen = 0; gen < generations; gen++) {
      // Evaluate fitness
      const fitness = population.map(individual => 
        this.evaluateFitness(individual, distanceMatrix, data)
      );
      
      // Selection
      const selected = this.tournamentSelection(population, fitness);
      
      // Crossover
      const offspring = this.crossover(selected, crossoverRate);
      
      // Mutation
      this.mutate(offspring, mutationRate);
      
      // Replace population
      population = this.selectSurvivors(population, offspring, fitness);
      
      // Early termination if convergence
      if (gen % 50 === 0 && this.hasConverged(fitness)) {
        break;
      }
    }
    
    // Return best solution
    const bestIndex = this.getBestIndividualIndex(population, distanceMatrix, data);
    return this.convertToRouteResult(population[bestIndex], distanceMatrix, data);
  }

  // Simulated Annealing Implementation
  private async simulatedAnnealing(
    data: ValidatedData,
    distanceMatrix: number[][],
    options: OptimizationOptions
  ): Promise<RouteOptimizationResult> {
    let currentSolution = this.generateRandomSolution(data);
    let bestSolution = [...currentSolution];
    let temperature = options.initialTemperature || 1000;
    const coolingRate = options.coolingRate || 0.995;
    const minTemperature = options.minTemperature || 1;
    
    while (temperature > minTemperature) {
      const newSolution = this.generateNeighborSolution(currentSolution);
      const currentCost = this.calculateSolutionCost(currentSolution, distanceMatrix, data);
      const newCost = this.calculateSolutionCost(newSolution, distanceMatrix, data);
      
      if (newCost < currentCost || Math.random() < Math.exp(-(newCost - currentCost) / temperature)) {
        currentSolution = newSolution;
        
        if (newCost < this.calculateSolutionCost(bestSolution, distanceMatrix, data)) {
          bestSolution = [...newSolution];
        }
      }
      
      temperature *= coolingRate;
    }
    
    return this.convertToRouteResult(bestSolution, distanceMatrix, data);
  }

  // Ant Colony Optimization Implementation
  private async antColonyOptimization(
    data: ValidatedData,
    distanceMatrix: number[][],
    options: OptimizationOptions
  ): Promise<RouteOptimizationResult> {
    const numAnts = options.numAnts || 50;
    const iterations = options.acoIterations || 100;
    const alpha = options.alpha || 1; // pheromone importance
    const beta = options.beta || 2; // distance importance
    const evaporationRate = options.evaporationRate || 0.1;
    const pheromoneDeposit = options.pheromoneDeposit || 100;
    
    // Initialize pheromone matrix
    const pheromones = this.initializePheromoneMatrix(data.locations.length);
    let bestSolution: any = null;
    let bestCost = Infinity;
    
    for (let iter = 0; iter < iterations; iter++) {
      const solutions = [];
      
      // Each ant constructs a solution
      for (let ant = 0; ant < numAnts; ant++) {
        const solution = this.constructAntSolution(
          data, distanceMatrix, pheromones, alpha, beta
        );
        solutions.push(solution);
        
        const cost = this.calculateSolutionCost(solution, distanceMatrix, data);
        if (cost < bestCost) {
          bestCost = cost;
          bestSolution = solution;
        }
      }
      
      // Update pheromones
      this.updatePheromones(pheromones, solutions, distanceMatrix, data, evaporationRate, pheromoneDeposit);
    }
    
    return this.convertToRouteResult(bestSolution, distanceMatrix, data);
  }

  // Nearest Neighbor with 2-opt and 3-opt improvements
  private async nearestNeighborWithImprovements(
    data: ValidatedData,
    distanceMatrix: number[][],
    options: OptimizationOptions
  ): Promise<RouteOptimizationResult> {
    let solution = this.nearestNeighborConstruction(data, distanceMatrix);
    
    // Apply 2-opt improvements
    solution = this.apply2Opt(solution, distanceMatrix, data);
    
    // Apply 3-opt improvements
    solution = this.apply3Opt(solution, distanceMatrix, data);
    
    // Apply Or-opt improvements
    solution = this.applyOrOpt(solution, distanceMatrix, data);
    
    return this.convertToRouteResult(solution, distanceMatrix, data);
  }

  // AI-powered optimization using OpenAI
  private async applyAIOptimization(
    result: RouteOptimizationResult,
    data: ValidatedData,
    options: OptimizationOptions
  ): Promise<RouteOptimizationResult> {
    if (!this.openai) return result;
    
    try {
      const prompt = this.buildOptimizationPrompt(result, data);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert logistics optimization AI. Analyze the given route optimization result and suggest improvements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });
      
      const aiSuggestions = response.choices[0]?.message?.content;
      if (aiSuggestions) {
        return this.applyAISuggestions(result, aiSuggestions, data);
      }
      
    } catch (error) {
      console.warn('AI optimization failed, using original result:', error);
    }
    
    return result;
  }

  // Generate AI insights and recommendations
  private async generateAIInsights(
    result: RouteOptimizationResult,
    data: ValidatedData
  ): Promise<string[]> {
    if (!this.openai) return ['AI insights unavailable - OpenAI API key not provided'];
    
    try {
      const prompt = `
        Analyze this route optimization result and provide actionable insights:
        
        Total Distance: ${result.totalDistance}km
        Total Time: ${result.totalTime} minutes
        Total Cost: $${result.totalCost}
        Efficiency Score: ${result.efficiency}%
        Number of Routes: ${result.routes.length}
        
        Routes:
        ${result.routes.map((route, i) => 
          `Route ${i + 1}: ${route.locations.length} stops, ${route.distance}km, ${route.time}min`
        ).join('\n')}
        
        Provide 5-7 specific, actionable insights for improving logistics operations.
      `;
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a logistics optimization expert. Provide specific, actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1000
      });
      
      const insights = response.choices[0]?.message?.content;
      return insights ? insights.split('\n').filter(line => line.trim()) : [];
      
    } catch (error) {
      console.warn('Failed to generate AI insights:', error);
      return ['AI insights temporarily unavailable'];
    }
  }

  // Calculate distance matrix using OSRM
  private async calculateDistanceMatrix(locations: Location[]): Promise<number[][]> {
    const coordinates = locations.map(loc => `${loc.lng},${loc.lat}`).join(';');
    
    try {
      const response = await fetch(
        `${this.osrmEndpoint}/table/v1/driving/${coordinates}?annotations=distance,duration`
      );
      
      if (!response.ok) {
        throw new Error(`OSRM API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.distances || this.calculateHaversineMatrix(locations);
      
    } catch (error) {
      console.warn('OSRM unavailable, using Haversine distance:', error);
      return this.calculateHaversineMatrix(locations);
    }
  }

  // Fallback Haversine distance calculation
  private calculateHaversineMatrix(locations: Location[]): number[][] {
    const matrix: number[][] = [];
    
    for (let i = 0; i < locations.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < locations.length; j++) {
        if (i === j) {
          matrix[i][j] = 0;
        } else {
          matrix[i][j] = this.haversineDistance(locations[i], locations[j]);
        }
      }
    }
    
    return matrix;
  }

  private haversineDistance(loc1: Location, loc2: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(loc2.lat - loc1.lat);
    const dLng = this.toRadians(loc2.lng - loc1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(loc1.lat)) * Math.cos(this.toRadians(loc2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Validation and preprocessing
  private validateAndPreprocess(locations: Location[], vehicles: Vehicle[]): ValidatedData {
    if (!locations || locations.length === 0) {
      throw new Error('No locations provided');
    }
    
    if (!vehicles || vehicles.length === 0) {
      throw new Error('No vehicles provided');
    }
    
    // Validate coordinates
    const validLocations = locations.filter(loc => 
      loc.lat >= -90 && loc.lat <= 90 && 
      loc.lng >= -180 && loc.lng <= 180
    );
    
    if (validLocations.length !== locations.length) {
      console.warn(`Filtered out ${locations.length - validLocations.length} invalid locations`);
    }
    
    return {
      locations: validLocations,
      vehicles: vehicles.filter(v => v.capacity > 0)
    };
  }

  // Helper methods for optimization algorithms
  private initializePopulation(data: ValidatedData, size: number): any[] {
    const population = [];
    for (let i = 0; i < size; i++) {
      population.push(this.generateRandomSolution(data));
    }
    return population;
  }

  private generateRandomSolution(data: ValidatedData): any {
    // Implementation for generating random solution
    const solution = {
      routes: data.vehicles.map(vehicle => ({
        vehicleId: vehicle.id,
        locationIds: []
      }))
    };
    
    // Randomly assign locations to vehicles
    const availableLocations = [...data.locations];
    while (availableLocations.length > 0) {
      const randomVehicle = Math.floor(Math.random() * solution.routes.length);
      const randomLocation = Math.floor(Math.random() * availableLocations.length);
      
      solution.routes[randomVehicle].locationIds.push(
        availableLocations.splice(randomLocation, 1)[0].id
      );
    }
    
    return solution;
  }

  private evaluateFitness(individual: any, distanceMatrix: number[][], data: ValidatedData): number {
    return 1 / (1 + this.calculateSolutionCost(individual, distanceMatrix, data));
  }

  private calculateSolutionCost(solution: any, distanceMatrix: number[][], data: ValidatedData): number {
    let totalCost = 0;
    
    for (const route of solution.routes) {
      let routeCost = 0;
      for (let i = 0; i < route.locationIds.length - 1; i++) {
        const fromIndex = data.locations.findIndex(loc => loc.id === route.locationIds[i]);
        const toIndex = data.locations.findIndex(loc => loc.id === route.locationIds[i + 1]);
        routeCost += distanceMatrix[fromIndex][toIndex];
      }
      totalCost += routeCost;
    }
    
    return totalCost;
  }

  private calculateOptimizationScore(result: RouteOptimizationResult): number {
    // Calculate optimization score based on multiple factors
    const distanceScore = Math.max(0, 100 - (result.totalDistance / 10));
    const timeScore = Math.max(0, 100 - (result.totalTime / 60));
    const costScore = Math.max(0, 100 - (result.totalCost / 100));
    const efficiencyScore = result.efficiency;
    
    return Math.round((distanceScore + timeScore + costScore + efficiencyScore) / 4);
  }

  // Additional helper methods would be implemented here...
  private tournamentSelection(population: any[], fitness: number[]): any[] {
    // Tournament selection implementation
    return population; // Simplified
  }

  private crossover(selected: any[], rate: number): any[] {
    // Crossover implementation
    return selected; // Simplified
  }

  private mutate(offspring: any[], rate: number): void {
    // Mutation implementation
  }

  private selectSurvivors(population: any[], offspring: any[], fitness: number[]): any[] {
    // Survivor selection implementation
    return population; // Simplified
  }

  private hasConverged(fitness: number[]): boolean {
    // Convergence check implementation
    return false; // Simplified
  }

  private getBestIndividualIndex(population: any[], distanceMatrix: number[][], data: ValidatedData): number {
    // Get best individual implementation
    return 0; // Simplified
  }

  private convertToRouteResult(solution: any, distanceMatrix: number[][], data: ValidatedData): RouteOptimizationResult {
    // Convert solution to route result implementation
    return {
      routes: [],
      totalDistance: 0,
      totalTime: 0,
      totalCost: 0,
      efficiency: 0,
      aiInsights: [],
      optimizationScore: 0
    }; // Simplified
  }

  private generateNeighborSolution(solution: any): any {
    // Generate neighbor solution for simulated annealing
    return solution; // Simplified
  }

  private initializePheromoneMatrix(size: number): number[][] {
    // Initialize pheromone matrix for ACO
    return Array(size).fill(null).map(() => Array(size).fill(1));
  }

  private constructAntSolution(
    data: ValidatedData,
    distanceMatrix: number[][],
    pheromones: number[][],
    alpha: number,
    beta: number
  ): any {
    // Construct ant solution for ACO
    return this.generateRandomSolution(data); // Simplified
  }

  private updatePheromones(
    pheromones: number[][],
    solutions: any[],
    distanceMatrix: number[][],
    data: ValidatedData,
    evaporationRate: number,
    pheromoneDeposit: number
  ): void {
    // Update pheromones for ACO
  }

  private nearestNeighborConstruction(data: ValidatedData, distanceMatrix: number[][]): any {
    // Nearest neighbor construction
    return this.generateRandomSolution(data); // Simplified
  }

  private apply2Opt(solution: any, distanceMatrix: number[][], data: ValidatedData): any {
    // 2-opt improvement
    return solution; // Simplified
  }

  private apply3Opt(solution: any, distanceMatrix: number[][], data: ValidatedData): any {
    // 3-opt improvement
    return solution; // Simplified
  }

  private applyOrOpt(solution: any, distanceMatrix: number[][], data: ValidatedData): any {
    // Or-opt improvement
    return solution; // Simplified
  }

  private buildOptimizationPrompt(result: RouteOptimizationResult, data: ValidatedData): string {
    // Build prompt for AI optimization
    return `Optimize this route result: ${JSON.stringify(result)}`;
  }

  private applyAISuggestions(
    result: RouteOptimizationResult,
    suggestions: string,
    data: ValidatedData
  ): RouteOptimizationResult {
    // Apply AI suggestions to result
    return result; // Simplified
  }

  private async selectBestResult(
    results: RouteOptimizationResult[],
    options: OptimizationOptions
  ): Promise<RouteOptimizationResult> {
    // Select best result from multiple algorithms
    return results.reduce((best, current) => 
      current.optimizationScore > best.optimizationScore ? current : best
    );
  }
}

// Supporting interfaces
interface ValidatedData {
  locations: Location[];
  vehicles: Vehicle[];
}

interface OptimizationOptions {
  populationSize?: number;
  generations?: number;
  mutationRate?: number;
  crossoverRate?: number;
  initialTemperature?: number;
  coolingRate?: number;
  minTemperature?: number;
  numAnts?: number;
  acoIterations?: number;
  alpha?: number;
  beta?: number;
  evaporationRate?: number;
  pheromoneDeposit?: number;
  useAI?: boolean;
  prioritizeTime?: boolean;
  prioritizeCost?: boolean;
  prioritizeDistance?: boolean;
}

export default EnhancedRouteOptimizer;
