export type CostCategory =
  | 'Direct Materials'
  | 'Packaging Materials'
  | 'Direct Labor'
  | 'Overhead'
  | 'Other Costs';

export interface Item {
  id: string;
  name: string;
  qty?: number;
  unitPrice?: number;
  cost: number;
  concentrationKg?: number;
  pricePerKg?: number;
  weightKg?: number;
  hours?: number;
  hourlyRate?: number;
  basis?: number;
}

interface CostTotals {
  actual: number;
  budget: number;
  costAfter: number;
}

export interface IoTCostData {
  totals: Record<CostCategory, CostTotals>;
  rawMaterials: Item[];
  packagingMaterials: Item[];
  directLabor: Item[];
  overheadItems: Item[];
  otherCosts: Item[];
}

export const simulatedIoTCostData: IoTCostData = {
  totals: {
    'Direct Materials': {
      actual: 133.11,
      budget: 129,
      costAfter: 120,
    },
    'Packaging Materials': {
      actual: 45,
      budget: 40,
      costAfter: 38,
    },
    'Direct Labor': {
      actual: 38,
      budget: 35,
      costAfter: 32,
    },
    'Overhead': {
      actual: 30,
      budget: 28,
      costAfter: 25,
    },
    'Other Costs': {
      actual: 20,
      budget: 18,
      costAfter: 15,
    },
  },
  rawMaterials: [
    { id: 'rm1', name: 'Vitamin B1', concentrationKg: 0.001, pricePerKg: 540, cost: 0.54 },
    { id: 'rm2', name: 'Vitamin B2', concentrationKg: 0.006, pricePerKg: 600, cost: 3.6 },
    { id: 'rm3', name: 'Vitamin B12', concentrationKg: 0.001, pricePerKg: 2300, cost: 2.3 },
    { id: 'rm4', name: 'Nicotinamide B3', concentrationKg: 0.01, pricePerKg: 400, cost: 4 },
    { id: 'rm5', name: 'Pantothenic Acid', concentrationKg: 0.004, pricePerKg: 1700, cost: 6.8 },
    { id: 'rm6', name: 'Vitamin B6', concentrationKg: 0.0015, pricePerKg: 900, cost: 1.35 },
    { id: 'rm7', name: 'Leucine', concentrationKg: 0.03, pricePerKg: 200, cost: 6 },
    { id: 'rm8', name: 'Threonine', concentrationKg: 0.01, pricePerKg: 950, cost: 9.5 },
    { id: 'rm9', name: 'Taurine', concentrationKg: 0.0025, pricePerKg: 3000, cost: 7.5 },
    { id: 'rm10', name: 'Glycine', concentrationKg: 0.0025, pricePerKg: 4200, cost: 10.5 },
    { id: 'rm11', name: 'Arginine', concentrationKg: 0.0025, pricePerKg: 5000, cost: 12.5 },
    { id: 'rm12', name: 'Cynarin', concentrationKg: 0.0025, pricePerKg: 3900, cost: 9.75 },
    { id: 'rm13', name: 'Silymarin', concentrationKg: 0.025, pricePerKg: 700, cost: 17.5 },
    { id: 'rm14', name: 'Sorbitol', concentrationKg: 0.01, pricePerKg: 360, cost: 3.6 },
    { id: 'rm15', name: 'Carnitine', concentrationKg: 0.005, pricePerKg: 1070, cost: 5.35 },
    { id: 'rm16', name: 'Betaine', concentrationKg: 0.02, pricePerKg: 1250, cost: 25 },
    { id: 'rm17', name: 'Tween-80', concentrationKg: 0.075, pricePerKg: 90, cost: 6.75 },
    { id: 'rm18', name: 'Water', concentrationKg: 0.571, pricePerKg: 1, cost: 0.571 },
  ],
  packagingMaterials: [
    { id: 'pm1', name: 'Plastic Bottle (1 L)', qty: 1, unitPrice: 10, cost: 10 },
    { id: 'pm2', name: 'Safety Seal', qty: 1, unitPrice: 3, cost: 3 },
    { id: 'pm3', name: 'Cap', qty: 1, unitPrice: 5, cost: 5 },
    { id: 'pm4', name: 'Label', qty: 1, unitPrice: 2, cost: 2 },
    { id: 'pm5', name: 'Shipping Box', qty: 1, unitPrice: 15, cost: 15 },
  ],
  directLabor: [
    { id: 'dl1', name: 'Operator', hours: 40, hourlyRate: 0.95, cost: 38 },
    { id: 'dl2', name: 'Supervisor', hours: 20, hourlyRate: 1.5, cost: 30 },
    { id: 'dl3', name: 'Quality Control', hours: 25, hourlyRate: 1.2, cost: 30 },
  ],
  overheadItems: [
    { id: 'oh1', name: 'Rent', totalCost: 10000, basis: 1000, cost: 10 },
    { id: 'oh2', name: 'Electricity', totalCost: 5000, basis: 1000, cost: 5 },
    { id: 'oh3', name: 'Maintenance', totalCost: 3000, basis: 1000, cost: 3 },
    { id: 'oh4', name: 'Insurance', totalCost: 2000, basis: 1000, cost: 2 },
    { id: 'oh5', name: 'Depreciation', totalCost: 10000, basis: 1000, cost: 10 },
  ],
  otherCosts: [
    { id: 'oc1', name: 'Transportation', qty: 1, unitPrice: 6.67, cost: 6.67 },
    { id: 'oc2', name: 'Packaging Waste Disposal', qty: 1, unitPrice: 3.33, cost: 3.33 },
    { id: 'oc3', name: 'Rework', qty: 1, unitPrice: 5.0, cost: 5 },
    { id: 'oc4', name: 'Quality Testing', qty: 1, unitPrice: 5.0, cost: 5 },
  ],
};

// دالة مساعدة لإنشاء بيانات محاكاة ديناميكية
export const generateSimulatedData = (productId: string): IoTCostData => {
  // يمكن تعديل هذه الدالة لإنشاء بيانات مختلفة حسب المنتج
  return {
    ...simulatedIoTCostData,
    totals: {
      ...simulatedIoTCostData.totals,
      'Direct Materials': {
        actual: simulatedIoTCostData.totals['Direct Materials'].actual * (productId === 'P1' ? 1 : 1.2),
        budget: simulatedIoTCostData.totals['Direct Materials'].budget,
        costAfter: simulatedIoTCostData.totals['Direct Materials'].costAfter
      }
    }
  };
};
