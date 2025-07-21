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
  hourlyRate?: number; // ✨ أضف هذا السطر
  totalCost?: number;
  basis?: number;
}
export const simulatedIoTCostData: Record<string, any> = {
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
    { name: 'Bottle', qty: 1, unitPrice: 0.5, cost: 0.5 },
    { name: 'Label', qty: 1, unitPrice: 0.2, cost: 0.2 },
    { name: 'Cap', qty: 1, unitPrice: 0.3, cost: 0.3 },
  ],
  directLabor: [
    { name: 'Mixing', hours: 0.2, unitPrice: 10, cost: 2 },
    { name: 'Filling', hours: 0.1, unitPrice: 12, cost: 1.2 },
    { name: 'Inspection', hours: 0.1, unitPrice: 15, cost: 1.5 },
  ],
  overheadItems: [
    { name: 'Electricity', qty: 40, unitPrice: 0.01, cost: 0.4 },
    { name: 'Rent', qty: 1, unitPrice: 1.2, cost: 1.2 },
    { name: 'Maintenance', qty: 10, unitPrice: 0.04, cost: 0.4 },
  ],
  otherCosts: [
    { name: 'Transportation', qty: 1, unitPrice: 0.3, cost: 0.3 },
    { name: 'Packaging Waste Disposal', qty: 1, unitPrice: 0.4, cost: 0.4 },
    { name: 'Rework', qty: 1, unitPrice: 0.3, cost: 0.3 },
  ],
  totals: {
    'Direct Materials': { actual: 134.591, budget: 130, costAfter: 125 },
    'Packaging Materials': { actual: 1, budget: 0.9, costAfter: 0.85 },
    'Direct Labor': { actual: 4.7, budget: 4.2, costAfter: 3.8 },
    'Overhead': { actual: 2, budget: 1.8, costAfter: 1.6 },
    'Other Costs': { actual: 1, budget: 0.8, costAfter: 0.7 },
  },
};
