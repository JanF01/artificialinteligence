
const [,, populationSizeArg, generationsMaxArg, epsilonArg] = process.argv;

const POPULATION_SIZE = parseInt(populationSizeArg) || 101; 
const GENERATIONS_MAX = parseInt(generationsMaxArg) || 200; 
const epsilon = parseFloat(epsilonArg) || 1e-5; 
const tau1 = 1/Math.sqrt(2*POPULATION_SIZE), tau2 = 1/Math.sqrt(2*Math.sqrt(POPULATION_SIZE));

import * as fs from 'fs';
const file = fs.readFileSync('ES_data_2.dat','utf8');
const lines = file.split("\n");
const xarray: number[] = [];
const yarray: number[] = [];
lines.forEach(line => {
  const [x,y] = line.trim().split(/['  ',' -']+/).map(Number);
  xarray.push(x);
  yarray.push(y);
});

let current_population: number[][] = []; 
let offsprings: number[][] = [];
let best_individual: number[] = [];

function calculateMSE(a: number,b: number,c: number): number{
  let MSE = 0;
          for (let i = 0; i < yarray.length; i++) {
            let prediction = a*(xarray[i]*xarray[i] - b*Math.cos(c*Math.PI*xarray[i]));
            MSE += Math.pow(prediction - yarray[i], 2);
          }
   MSE /= yarray.length; 
  return MSE;
}

function initialPopulation(){
    for(let i = 0;i<POPULATION_SIZE;i++){
      let individual:number[] = [];
      for (let j = 0; j < 3; j++) {
        individual[j] = Math.random() * 11 * (Math.random() < 0.5 ? -1 : 1);
      }
      for (let j = 3; j <= 5; j++) {
        individual[j] = Math.random() * 11;
      }
      individual[6] = calculateMSE(individual[0], individual[1], individual[2]);
      current_population[i] = individual;
    }
}

function normalDist(): number {
  const u = Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Tournament selection
function generateNextPopulation(): boolean {
  offsprings = []; 

  for (let j = 0; j < POPULATION_SIZE; j++) {
    const parent = current_population[j];
          const a = parent[0] + normalDist() * parent[3];
          const b = parent[1] + normalDist() * parent[4];
          const c = parent[2] + normalDist() * parent[5];

          const R1 = normalDist() * tau1;
          const sigma_a = parent[3] * Math.exp(R1) * Math.exp(normalDist() * tau2);
          const sigma_b = parent[4] * Math.exp(R1) * Math.exp(normalDist() * tau2);
          const sigma_c = parent[5] * Math.exp(R1) * Math.exp(normalDist() * tau2);

          let MSE = calculateMSE(a, b, c);

          offsprings.push([a, b, c, sigma_a, sigma_b, sigma_c, MSE]);
  }

  const bestInCurrent = current_population.reduce((a, b) => a[6] < b[6] ? a : b, current_population[0]);
  const bestInOffsprings = offsprings.reduce((a, b) => a[6] < b[6] ? a : b, offsprings[0]);

  let union = current_population.concat(offsprings).sort((a, b) => a[6] - b[6]);

  if (Math.abs(bestInCurrent[6] - bestInOffsprings[6]) < epsilon) {
          best_individual = union[0];
          console.log("Best individual found:", best_individual);
          return true;
  }

  // New generation by selecting the top individuals from the union of offspring and current_population
  current_population = union.slice(0, POPULATION_SIZE);
  best_individual = current_population[0];  
  return false;
}


// Running the Evolution Strategy
function runEvolutionStrategy(){
  let time = Date.now();
  initialPopulation();
  for (let i = 0; i < GENERATIONS_MAX; i++) {
    if (generateNextPopulation()) {
      time = Date.now() - time;
      console.log(time);
      console.log("Convergence reached in generation: " + i);
      return; // convergence reached
    }
  }
  console.log("Best individual found:", best_individual);
  time = Date.now() - time;
  console.log(time);
}

runEvolutionStrategy();


const yPredicted: number[] = [];

// Generate y values
for (let i = 0; i < xarray.length; i++) {
    const y = best_individual[0] * (xarray[i] * xarray[i] - best_individual[1] * Math.cos(best_individual[2]* Math.PI * xarray[i]));
    yPredicted.push(y);
}

import { serveChart } from './chart';

serveChart(xarray, yarray, yPredicted);
