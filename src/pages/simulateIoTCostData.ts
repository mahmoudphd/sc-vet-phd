// src/pages/simulateIoTCostData.ts

export type CostCategory =
  | 'Direct Materials'
  | 'Packaging Materials'
  | 'Direct Labor'
  | 'Overhead'
  | 'Other Costs';

export interface Item {
  name: string;
  qty?: number;
  unitPrice?: number;
  cost?: number;
  concentrationKg?: number;
  pricePerKg?: number;
  weightKg?: number;
  hours?: number;
  hourlyRate?: number;
}

export const simulatedIoTCostData = {
  totals: {
    'Direct Materials': {
      actual: 133.11,
      budget: 140,
      costAfter: 120,
    },
    'Packaging Materials': {
      actual: 45,
      budget: 50,
      costAfter: 43,
    },
    'Direct Labor': {
      actual: 38,
      budget: 40,
      costAfter: 37,
    },
    Overhead: {
      actual: 30,
      budget: 32,
      costAfter: 29,
    },
    'Other Costs': {
      actual: 20,
      budget: 25,
      costAfter: 19,
    },
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
    { name: 'Water', concentrationKg: 0.571, pricePerKg: 1, weightKg: 0.571, cost: 0.571 },
  ],
  packagingMaterials: [
    { name: 'Plastic Bottle (1 L)', qty: 1, unitPrice: 10, cost: 10 },
    { name: 'Safety Seal', qty: 1, unitPrice: 3, cost: 3 },
    { name: 'Cap', qty: 1, unitPrice: 5, cost: 5 },
  ],
  directLabor: [
    { name: 'Operator', hours: 3, hourlyRate: 0.585, cost: 1.755 },
    { name: 'Supervisor', hours: 6, hourlyRate: 0.1465, cost: 0.879 },
    { name: 'Quality Control', hours: 5, hourlyRate: 0.0732, cost: 0.366 },
  ],
  overheadItems: [
    { name: 'Electricity', qty: 50, unitPrice: 0.5, cost: 25 },
    { name: 'Rent', qty: 1, unitPrice: 1000, cost: 1000 },
  ],
  otherCosts: [
    { name: 'Transportation', qty: 1, unitPrice: 6.67, cost: 6.67 },
    { name: 'Packaging Waste Disposal', qty: 1, unitPrice: 3.33, cost: 3.33 },
    { name: 'Rework', qty: 1, unitPrice: 5.0, cost: 5 },
  ],
};
