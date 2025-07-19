// simulateIoTCostData.ts

export const simulatedIoTCostData = {
  totals: {
    'Direct Materials': {
      actual: 133.11,
      budget: 140,
      costAfter: 120
    },
    'Packaging Materials': {
      actual: 18,
      budget: 20,
      costAfter: 17
    },
    'Direct Labor': {
      actual: 3,
      budget: 4,
      costAfter: 2.8
    },
    'Overhead': {
      actual: 0.5,
      budget: 1,
      costAfter: 0.4
    },
    'Other Costs': {
      actual: 2,
      budget: 3,
      costAfter: 1.5
    }
  },
  rawMaterials: [
    { name: 'Vitamin B1', concentrationKg: 0.001, pricePerKg: 540, weightKg: 0.001, cost: 0.54 },
    { name: 'Vitamin B2', concentrationKg: 0.006, pricePerKg: 600, weightKg: 0.006, cost: 3.6 },
    { name: 'Vitamin B12', concentrationKg: 0.001, pricePerKg: 2300, weightKg: 0.001, cost: 2.3 },
    { name: 'Nicotinamide B3', concentrationKg: 0.01, pricePerKg: 400, weightKg: 0.01, cost: 4 },
    { name: 'Pantothenic Acid', concentrationKg: 0.004, pricePerKg: 1700, weightKg: 0.004, cost: 6.8 },
    { name: 'Vitamin B6', concentrationKg: 0.0015, pricePerKg: 900, weightKg: 0.0015, cost: 1.35 },
    { name: 'Leucine', concentrationKg: 0.03, pricePerKg: 200, weightKg: 0.03, cost: 6 },
    { name: 'Threonine', concentrationKg: 0.01, pricePerKg: 950, weightKg: 0.01, cost: 9.5 },
    { name: 'Taurine', concentrationKg: 0.0025, pricePerKg: 3000, weightKg: 0.0025, cost: 7.5 },
    { name: 'Glycine', concentrationKg: 0.0025, pricePerKg: 4200, weightKg: 0.0025, cost: 10.5 },
    { name: 'Arginine', concentrationKg: 0.0025, pricePerKg: 5000, weightKg: 0.0025, cost: 12.5 },
    { name: 'Cynarin', concentrationKg: 0.0025, pricePerKg: 3900, weightKg: 0.0025, cost: 9.75 },
    { name: 'Silymarin', concentrationKg: 0.025, pricePerKg: 700, weightKg: 0.025, cost: 17.5 },
    { name: 'Sorbitol', concentrationKg: 0.01, pricePerKg: 360, weightKg: 0.01, cost: 3.6 },
    { name: 'Carnitine', concentrationKg: 0.005, pricePerKg: 1070, weightKg: 0.005, cost: 5.35 },
    { name: 'Betaine', concentrationKg: 0.02, pricePerKg: 1250, weightKg: 0.02, cost: 25 },
    { name: 'Tween-80', concentrationKg: 0.075, pricePerKg: 90, weightKg: 0.075, cost: 6.75 },
    { name: 'Water', concentrationKg: 0.571, pricePerKg: 1, weightKg: 0.571, cost: 0.571 }
  ],
  packagingMaterials: [
    { name: 'Plastic Bottle 1L', quantity: 1, pricePerUnit: 5, cost: 5 },
    { name: 'Screw Cap', quantity: 1, pricePerUnit: 1.2, cost: 1.2 },
    { name: 'Safety Seal', quantity: 1, pricePerUnit: 1.8, cost: 1.8 },
    { name: 'Label', quantity: 1, pricePerUnit: 2, cost: 2 },
    { name: 'Outer Carton', quantity: 0.1, pricePerUnit: 20, cost: 2 }
  ],
  directLabor: [
    { role: 'Machine Operator', hours: 0.25, ratePerHour: 20, cost: 5 },
    { role: 'Packaging Staff', hours: 0.3, ratePerHour: 15, cost: 4.5 },
    { role: 'Quality Control', hours: 0.15, ratePerHour: 25, cost: 3.75 }
  ],
  overhead: [
    { name: 'Electricity', unit: 'kWh', quantity: 0.5, pricePerUnit: 1.2, cost: 0.6 },
    { name: 'Water', unit: 'L', quantity: 1, pricePerUnit: 0.5, cost: 0.5 },
    { name: 'Maintenance', unit: 'Per Batch', quantity: 0.1, pricePerUnit: 3, cost: 0.3 }
  ],
  otherCosts: [
    { name: 'Transport', type: 'Per Unit', cost: 0.8 },
    { name: 'Storage', type: 'Per Unit', cost: 0.6 },
    { name: 'Insurance', type: 'Per Unit', cost: 0.6 }
  ]
};
