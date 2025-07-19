// src/pages/simulateIoTCostData.ts

export const simulatedIoTCostData = {
  rawMaterials: [
    { name: 'Vitamin B1', concentrationKg: 0.001, pricePerKg: 540, weightKg: 0.001, cost: 0.54 },
    { name: 'Vitamin B2', concentrationKg: 0.006, pricePerKg: 600, weightKg: 0.006, cost: 3.60 },
    { name: 'Vitamin B12', concentrationKg: 0.001, pricePerKg: 2300, weightKg: 0.001, cost: 2.30 },
    { name: 'Nicotinamide B3', concentrationKg: 0.01, pricePerKg: 400, weightKg: 0.01, cost: 4.00 },
    { name: 'Pantothenic Acid', concentrationKg: 0.004, pricePerKg: 1700, weightKg: 0.004, cost: 6.80 },
    { name: 'Vitamin B6', concentrationKg: 0.0015, pricePerKg: 900, weightKg: 0.0015, cost: 1.35 },
    { name: 'Leucine', concentrationKg: 0.03, pricePerKg: 200, weightKg: 0.03, cost: 6.00 },
    { name: 'Threonine', concentrationKg: 0.01, pricePerKg: 950, weightKg: 0.01, cost: 9.50 },
    { name: 'Taurine', concentrationKg: 0.0025, pricePerKg: 3000, weightKg: 0.0025, cost: 7.50 },
    { name: 'Glycine', concentrationKg: 0.0025, pricePerKg: 4200, weightKg: 0.0025, cost: 10.50 },
    { name: 'Arginine', concentrationKg: 0.0025, pricePerKg: 5000, weightKg: 0.0025, cost: 12.50 },
    { name: 'Cynarin', concentrationKg: 0.0025, pricePerKg: 3900, weightKg: 0.0025, cost: 9.75 },
    { name: 'Silymarin', concentrationKg: 0.025, pricePerKg: 700, weightKg: 0.025, cost: 17.50 },
    { name: 'Sorbitol', concentrationKg: 0.01, pricePerKg: 360, weightKg: 0.01, cost: 3.60 },
    { name: 'Carnitine', concentrationKg: 0.005, pricePerKg: 1070, weightKg: 0.005, cost: 5.35 },
    { name: 'Betaine', concentrationKg: 0.02, pricePerKg: 1250, weightKg: 0.02, cost: 25.00 },
    { name: 'Tween-80', concentrationKg: 0.075, pricePerKg: 90, weightKg: 0.075, cost: 6.75 },
    { name: 'Water', concentrationKg: 0.571, pricePerKg: 1, weightKg: 0.571, cost: 0.571 }
  ],
  totals: {
    'Direct Materials': { actual: 133.11, budget: 140, costAfter: 120 },
    'Packaging Materials': { actual: 45, budget: 50, costAfter: 43 },
    'Direct Labor': { actual: 38, budget: 40, costAfter: 37 },
    'Overhead': { actual: 30, budget: 32, costAfter: 29 },
    'Other Costs': { actual: 20, budget: 25, costAfter: 19 }
  }
};
