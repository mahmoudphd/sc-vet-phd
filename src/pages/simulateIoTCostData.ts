// src/pages/simulateIoTCostData.ts

export type CostCategory =
  | 'Direct Materials'
  | 'Packaging Materials'
  | 'Direct Labor'
  | 'Overhead'
  | 'Other Costs';

export type Item = {
  name: string;
  qty: number;
  unitPrice: number;
  cost: number;
};

export const simulatedIoTCostData = {
  totals: {
    'Direct Materials': { actual: 133.11, budget: 140, costAfter: 120 },
    'Packaging Materials': { actual: 18, budget: 20, costAfter: 17 },
    'Direct Labor': { actual: 3, budget: 3.5, costAfter: 2.8 },
    Overhead: { actual: 0.5, budget: 0.7, costAfter: 0.45 },
    'Other Costs': { actual: 20, budget: 25, costAfter: 19 },
  },
  rawMaterials: [
    { name: 'Vitamin B1', qty: 1, unitPrice: 540, cost: 540 },
    { name: 'Vitamin B2', qty: 6, unitPrice: 600, cost: 3600 },
    { name: 'Vitamin B12', qty: 1, unitPrice: 2300, cost: 2300 },
    { name: 'Nicotinamide B3', qty: 10, unitPrice: 400, cost: 4000 },
    { name: 'Pantothenic Acid', qty: 4, unitPrice: 1700, cost: 6800 },
    { name: 'Vitamin B6', qty: 1.5, unitPrice: 900, cost: 1350 },
    { name: 'Leucine', qty: 30, unitPrice: 200, cost: 6000 },
    { name: 'Threonine', qty: 10, unitPrice: 950, cost: 9500 },
    { name: 'Taurine', qty: 2.5, unitPrice: 3000, cost: 7500 },
    { name: 'Glycine', qty: 2.5, unitPrice: 4200, cost: 10500 },
    { name: 'Arginine', qty: 2.5, unitPrice: 5000, cost: 12500 },
    { name: 'Cynarin', qty: 2.5, unitPrice: 3900, cost: 9750 },
    { name: 'Silymarin', qty: 25, unitPrice: 700, cost: 17500 },
    { name: 'Sorbitol', qty: 10, unitPrice: 360, cost: 3600 },
    { name: 'Carnitine', qty: 5, unitPrice: 1070, cost: 5350 },
    { name: 'Betaine', qty: 20, unitPrice: 1250, cost: 25000 },
    { name: 'Tween-80', qty: 75, unitPrice: 90, cost: 6750 },
    { name: 'Water', qty: 571, unitPrice: 1, cost: 571 },
  ],
  packagingMaterials: [
    { name: 'Plastic Bottle (1 L)', qty: 1, unitPrice: 10, cost: 10 },
    { name: 'Safety Seal', qty: 1, unitPrice: 3, cost: 3 },
    { name: 'Cap', qty: 1, unitPrice: 5, cost: 5 },
  ],
  directLabor: [
    { name: 'Operator', qty: 40, unitPrice: 3, cost: 120 },
    { name: 'Supervisor', qty: 10, unitPrice: 6, cost: 60 },
    { name: 'Quality Control', qty: 5, unitPrice: 5, cost: 25 },
  ],
  overheadItems: [
    { name: 'Electricity', qty: 1, unitPrice: 500, cost: 500 },
    { name: 'Rent', qty: 1, unitPrice: 2000, cost: 2000 },
    { name: 'Maintenance', qty: 1, unitPrice: 300, cost: 300 },
  ],
  otherCosts: [
    { name: 'Transportation', qty: 1, unitPrice: 100, cost: 100 },
    { name: 'Packaging Waste Disposal', qty: 1, unitPrice: 50, cost: 50 },
    { name: 'Rework', qty: 1, unitPrice: 75, cost: 75 },
  ],
};
