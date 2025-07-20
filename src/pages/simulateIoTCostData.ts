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
  cost: number;
  concentrationKg?: number;
  pricePerKg?: number;
  weightKg?: number;
}

export const simulatedIoTCostData: Record<string, any> = {
  rawMaterials: [
    { name: 'Vitamin B1', concentrationKg: 0.001, pricePerKg: 540, weightKg: 0.001, cost: 0.54 },
    { name: 'Vitamin B2', concentrationKg: 0.006, pricePerKg: 600, weightKg: 0.006, cost: 3.6 },
    { name: 'Vitamin B12', concentrationKg: 0.001, pricePerKg: 2300, weightKg: 0.001, cost: 2.3 },
    { name: 'Nicotinamide B3', concentrationKg: 0.01, pricePerKg: 400, weightKg: 0.01, cost: 4 },
    { name: 'Pantothenic Acid B5', concentrationKg: 0.0015, pricePerKg: 350, weightKg: 0.0015, cost: 0.525 },
  ],

  packagingMaterials: [
    { name: 'Bottle', qty: 1, unitPrice: 2, cost: 2 },
    { name: 'Cap', qty: 1, unitPrice: 0.5, cost: 0.5 },
    { name: 'Label', qty: 1, unitPrice: 0.2, cost: 0.2 },
    { name: 'Box', qty: 1, unitPrice: 0.5, cost: 0.5 },
  ],

  directLabor: [
    { name: 'Mixing', qty: 0.2, unitPrice: 30, cost: 6 },
    { name: 'Filling', qty: 0.15, unitPrice: 25, cost: 3.75 },
    { name: 'Labeling', qty: 0.1, unitPrice: 20, cost: 2 },
  ],

  overheadItems: [
    { name: 'Electricity', qty: 40, unitPrice: 0.01, cost: 0.4 },
    { name: 'Rent', qty: 1, unitPrice: 1.2, cost: 1.2 },
    { name: 'Maintenance', qty: 10, unitPrice: 0.04, cost: 0.4 },
  ],

  otherCosts: [
    { name: 'Transportation', qty: 1, unitPrice: 0.6, cost: 0.6 },
    { name: 'Packaging Waste Disposal', qty: 1, unitPrice: 0.3, cost: 0.3 },
    { name: 'Rework', qty: 1, unitPrice: 0.4, cost: 0.4 },
  ],

  totals: {
    'Direct Materials': { actual: 10.965, budget: 9, costAfter: 8 },
    'Packaging Materials': { actual: 3.2, budget: 3, costAfter: 2.5 },
    'Direct Labor': { actual: 11.75, budget: 10, costAfter: 9 },
    'Overhead': { actual: 2, budget: 1.5, costAfter: 1.2 },
    'Other Costs': { actual: 1.3, budget: 1, costAfter: 0.9 },
  },
};
