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

  // Raw materials specific
  composition?: number;
  concentrationKg?: number;
  pricePerKg?: number;
  weightKg?: number;

  // Labor specific
  hours?: number;
  hourlyRate?: number;
}

export const simulatedIoTCostData: Record<string, any> = {
  rawMaterials: [
    { name: 'Vitamin B1', concentrationKg: 0.001, pricePerKg: 540, weightKg: 0.001, cost: 0.54 },
    { name: 'Vitamin B2', concentrationKg: 0.006, pricePerKg: 600, weightKg: 0.006, cost: 3.6 },
    { name: 'Vitamin B12', concentrationKg: 0.001, pricePerKg: 2300, weightKg: 0.001, cost: 2.3 },
    { name: 'Nicotinamide B3', concentrationKg: 0.01, pricePerKg: 400, weightKg: 0.01, cost: 4 },
    { name: 'Pantothenic Acid B5', concentrationKg: 0.002, pricePerKg: 2500, weightKg: 0.002, cost: 5 },
    { name: 'Pyridoxine B6', concentrationKg: 0.001, pricePerKg: 1900, weightKg: 0.001, cost: 1.9 },
    { name: 'Folic Acid B9', concentrationKg: 0.0002, pricePerKg: 6000, weightKg: 0.0002, cost: 1.2 },
  ],

  packagingMaterials: [
    { name: 'Bottle', qty: 1, unitPrice: 2.5, cost: 2.5 },
    { name: 'Label', qty: 1, unitPrice: 0.5, cost: 0.5 },
    { name: 'Cap', qty: 1, unitPrice: 0.8, cost: 0.8 },
  ],

  directLabor: [
    { name: 'Mixing', hours: 0.2, hourlyRate: 50, cost: 10 },
    { name: 'Filling', hours: 0.1, hourlyRate: 50, cost: 5 },
  ],

  overheadItems: [
    { name: 'Electricity', qty: 40, unitPrice: 0.01, cost: 0.4 },
    { name: 'Rent', qty: 1, unitPrice: 1.2, cost: 1.2 },
    { name: 'Maintenance', qty: 10, unitPrice: 0.04, cost: 0.4 },
  ],

  otherCosts: [
    { name: 'Transportation', qty: 1, unitPrice: 0.5, cost: 0.5 },
    { name: 'Packaging Waste Disposal', qty: 1, unitPrice: 0.3, cost: 0.3 },
    { name: 'Rework', qty: 1, unitPrice: 0.2, cost: 0.2 },
  ],

  totals: {
    'Direct Materials': {
      actual: 19.04,
      budget: 17,
      costAfter: 15,
    },
    'Packaging Materials': {
      actual: 3.8,
      budget: 3.5,
      costAfter: 3.2,
    },
    'Direct Labor': {
      actual: 15,
      budget: 13,
      costAfter: 12,
    },
    'Overhead': {
      actual: 2,
      budget: 2.2,
      costAfter: 1.8,
    },
    'Other Costs': {
      actual: 1,
      budget: 1.2,
      costAfter: 0.9,
    },
  },
};
