"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = process.argv, populationSizeArg = _a[2], generationsMaxArg = _a[3], epsilonArg = _a[4];
var POPULATION_SIZE = parseInt(populationSizeArg) || 101;
var GENERATIONS_MAX = parseInt(generationsMaxArg) || 200;
var epsilon = parseFloat(epsilonArg) || 1e-5;
var tau1 = 1 / Math.sqrt(2 * POPULATION_SIZE), tau2 = 1 / Math.sqrt(2 * Math.sqrt(POPULATION_SIZE));
var fs = require("fs");
var file = fs.readFileSync('ES_data_2.dat', 'utf8');
var lines = file.split("\n");
var xarray = [];
var yarray = [];
lines.forEach(function (line) {
    var _a = line.trim().split(/['  ',' -']+/).map(Number), x = _a[0], y = _a[1];
    xarray.push(x);
    yarray.push(y);
});
var current_population = [];
var offsprings = [];
var best_individual = [];
function calculateMSE(a, b, c) {
    var MSE = 0;
    for (var i = 0; i < yarray.length; i++) {
        var prediction = a * (xarray[i] * xarray[i] - b * Math.cos(c * Math.PI * xarray[i]));
        MSE += Math.pow(prediction - yarray[i], 2);
    }
    MSE /= yarray.length;
    return MSE;
}
function initialPopulation() {
    for (var i = 0; i < POPULATION_SIZE; i++) {
        var individual = [];
        for (var j = 0; j < 3; j++) {
            individual[j] = Math.random() * 11 * (Math.random() < 0.5 ? -1 : 1);
        }
        for (var j = 3; j <= 5; j++) {
            individual[j] = Math.random() * 11;
        }
        individual[6] = calculateMSE(individual[0], individual[1], individual[2]);
        current_population[i] = individual;
    }
}
function normalDist() {
    var u = Math.random();
    var v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
// Tournament selection
function generateNextPopulation() {
    offsprings = [];
    for (var j = 0; j < POPULATION_SIZE; j++) {
        var parent_1 = current_population[j];
        var a = parent_1[0] + normalDist() * parent_1[3];
        var b = parent_1[1] + normalDist() * parent_1[4];
        var c = parent_1[2] + normalDist() * parent_1[5];
        var R1 = normalDist() * tau1;
        var sigma_a = parent_1[3] * Math.exp(R1) * Math.exp(normalDist() * tau2);
        var sigma_b = parent_1[4] * Math.exp(R1) * Math.exp(normalDist() * tau2);
        var sigma_c = parent_1[5] * Math.exp(R1) * Math.exp(normalDist() * tau2);
        var MSE = calculateMSE(a, b, c);
        offsprings.push([a, b, c, sigma_a, sigma_b, sigma_c, MSE]);
    }
    var bestInCurrent = current_population.reduce(function (a, b) { return a[6] < b[6] ? a : b; }, current_population[0]);
    var bestInOffsprings = offsprings.reduce(function (a, b) { return a[6] < b[6] ? a : b; }, offsprings[0]);
    var union = current_population.concat(offsprings).sort(function (a, b) { return a[6] - b[6]; });
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
function runEvolutionStrategy() {
    var time = Date.now();
    initialPopulation();
    for (var i = 0; i < GENERATIONS_MAX; i++) {
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
var yPredicted = [];
// Generate y values
for (var i = 0; i < xarray.length; i++) {
    var y = best_individual[0] * (xarray[i] * xarray[i] - best_individual[1] * Math.cos(best_individual[2] * Math.PI * xarray[i]));
    yPredicted.push(y);
}
var chart_1 = require("./chart");
(0, chart_1.serveChart)(xarray, yarray, yPredicted);
