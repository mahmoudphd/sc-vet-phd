import React, { useState, useEffect, useRef } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Define TypeScript interfaces
interface EmissionData {
  category: string;
  emissions: number;
  cost: number;
  percentage: number;
  target: number;
  certification: string;
}

interface MaterialData {
  material: string;
  quantity: number;
  emissionFactor: number;
  emissions: number;
}

interface InitiativeData {
  name: string;
  reduction: number;
  cost: number;
}

const CO2Footprint: React.FC = () => {
  // State for dashboard data
  const [mode, setMode] = useState<string>('iot');
  const [product, setProduct] = useState<string>('product1');
  const [currency, setCurrency] = useState<string>('EGP');
  const [emissionData, setEmissionData] = useState<EmissionData[]>([
    { category: 'Raw Materials', emissions: 3.625, cost: 9062.50, percentage: 41.5, target: 2.900, certification: 'ISO 14001' },
    { category: 'Manufacturing', emissions: 1.598, cost: 3995.00, percentage: 18.3, target: 1.278, certification: 'ISO 50001' },
    { category: 'Packaging', emissions: 0.395, cost: 987.50, percentage: 4.5, target: 0.316, certification: 'ISO 14064' },
    { category: 'Transport', emissions: 0.600, cost: 1500.00, percentage: 6.9, target: 0.480, certification: 'GHG Protocol' },
    { category: 'Distribution', emissions: 0.058, cost: 145.00, percentage: 0.7, target: 0.046, certification: 'ISO 14067' },
    { category: 'Use', emissions: 0.130, cost: 325.00, percentage: 1.5, target: 0.104, certification: 'Cradle to Cradle' },
    { category: 'End of Life', emissions: 0.380, cost: 950.00, percentage: 4.4, target: 0.304, certification: 'None' },
  ]);
  const [materialData, setMaterialData] = useState<MaterialData[]>([
    { material: 'Vitamin B1', quantity: 0.001, emissionFactor: 85, emissions: 0.085 },
    { material: 'Vitamin B2', quantity: 0.006, emissionFactor: 92, emissions: 0.552 },
    { material: 'Vitamin B12', quantity: 0.001, emissionFactor: 120, emissions: 0.120 },
    { material: 'Nicotinamide (B3)', quantity: 0.010, emissionFactor: 78, emissions: 0.780 },
    { material: 'Pantothenic Acid', quantity: 0.004, emissionFactor: 65, emissions: 0.260 },
  ]);
  const [initiativesData, setInitiativesData] = useState<InitiativeData[]>([
    { name: 'Energy Efficiency', reduction: 2.5, cost: 5000 },
    { name: 'Renewable Energy', reduction: 1.8, cost: 8500 },
    { name: 'Waste Reduction', reduction: 1.2, cost: 3000 },
    { name: 'Supply Chain Optimization', reduction: 1.0, cost: 7000 },
  ]);

  // Refs for intervals
  const iotIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate totals
  const totalEmissions = emissionData.reduce((sum, item) => sum + item.emissions, 0);
  const totalCost = emissionData.reduce((sum, item) => sum + item.cost, 0);
  const carbonIntensity = totalEmissions / (55000 / 1000);
  const emissionReduction = 6.5; // From sustainability initiatives

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#8884D8', '#FF6B6B'];
  const INITIATIVE_COLORS = ['#2c974b', '#1e5128', '#4caf50', '#8bc34a'];

  // Chart data for emissions by category
  const emissionsChartData = emissionData.map(item => ({
    name: item.category,
    value: item.emissions
  }));

  // Chart data for initiatives
  const initiativesChartData = initiativesData.map(item => ({
    name: item.name,
    reduction: item.reduction,
    cost: item.cost
  }));

  // Simulate IoT data updates
  const simulateIoTData = () => {
    if (mode !== 'iot') return;
    
    setEmissionData(prevData => {
      return prevData.map(item => {
        const randomChange = (Math.random() * 0.1) - 0.05; // Random change between -5% and +5%
        const newEmissions = item.emissions * (1 + randomChange);
        const costPerKg = totalCost / totalEmissions;
        const newCost = newEmissions * costPerKg;
        
        return {
          ...item,
          emissions: parseFloat(newEmissions.toFixed(3)),
          cost: parseFloat(newCost.toFixed(2))
        };
      });
    });
  };

  // Handle mode change
  useEffect(() => {
    // Clear any existing interval
    if (iotIntervalRef.current) {
      clearInterval(iotIntervalRef.current);
      iotIntervalRef.current = null;
    }
    
    // Set new interval if in IoT mode
    if (mode === 'iot') {
      iotIntervalRef.current = setInterval(simulateIoTData, 3000);
    }
    
    // Cleanup on unmount
    return () => {
      if (iotIntervalRef.current) {
        clearInterval(iotIntervalRef.current);
      }
    };
  }, [mode]);

  // Update material emissions when inputs change
  const handleMaterialChange = (index: number, field: keyof MaterialData, value: number) => {
    setMaterialData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [field]: value
      };
      
      // Recalculate emissions if quantity or factor changed
      if (field === 'quantity' || field === 'emissionFactor') {
        newData[index].emissions = newData[index].quantity * newData[index].emissionFactor;
      }
      
      return newData;
    });
  };

  // Calculate material subtotal
  const materialSubtotal = materialData.reduce((sum, item) => ({
    quantity: sum.quantity + item.quantity,
    emissions: sum.emissions + item.emissions,
    emissionFactor: 0, // Not used for sum
    material: '' // Not used for sum
  }), { material: '', quantity: 0, emissionFactor: 0, emissions: 0 });

  return (
    <div className="container">
      <div className="header">
        <h1>Sustainability Dashboard - Carbon Footprint Analysis</h1>
        <p>Monitor and analyze carbon emissions across product lifecycle for improved sustainability</p>
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label>Mode:</label>
          <select 
            id="mode-select" 
            value={mode} 
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
            <option value="iot">IoT Mode</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Product:</label>
          <select 
            id="product-select" 
            value={product} 
            onChange={(e) => setProduct(e.target.value)}
          >
            <option value="product1">Poultry Product 1</option>
            <option value="product2">Poultry Product 2</option>
            <option value="product3">Poultry Product 3</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Currency:</label>
          <select 
            id="currency-select" 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="EGP">Egyptian Pound (EGP)</option>
          </select>
        </div>
        
        {mode === 'iot' && (
          <div className="iot-indicator">
            <div className="pulsing-dot"></div>
            <span>Sensors Active</span>
          </div>
        )}
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Emissions</h3>
          <div className="value">{totalEmissions.toFixed(3)} kg CO₂e</div>
          <div className="label"><span className="positive-change">▼ 12%</span> YoY reduction</div>
        </div>
        
        <div className="stat-card">
          <h3>Environmental Cost</h3>
          <div className="value">{totalCost.toFixed(2)} {currency}</div>
          <div className="label">Carbon price: $50/ton</div>
        </div>
        
        <div className="stat-card">
          <h3>Carbon Intensity</h3>
          <div className="value">{carbonIntensity.toFixed(4)} kg/1K {currency}</div>
          <div className="label"><span className="positive-change">▼ 8%</span> from last quarter</div>
        </div>
        
        <div className="stat-card">
          <h3>Emission Reduction</h3>
          <div className="value">{emissionReduction.toFixed(1)} kg CO₂e</div>
          <div className="label">From sustainability initiatives</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart">
          <h3>Emissions by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emissionsChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {emissionsChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} kg CO₂e`, 'Emissions']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart">
          <h3>Emission Reduction Initiatives</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={initiativesChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} kg CO₂e`, 'Reduction']} />
              <Legend />
              <Bar dataKey="reduction" name="Reduction (kg CO₂e)" fill="#2c974b">
                {initiativesChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={INITIATIVE_COLORS[index % INITIATIVE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="data-table">
        <h3>Emission and Cost Details</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Emissions (kg CO₂e)</th>
              <th>Environmental Cost ({currency})</th>
              <th>% of Total</th>
              <th>Target (kg CO₂e)</th>
              <th>Certification</th>
            </tr>
          </thead>
          <tbody>
            {emissionData.map((item, index) => {
              const percentage = (item.emissions / totalEmissions) * 100;
              return (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td>{item.emissions.toFixed(3)}</td>
                  <td>{item.cost.toFixed(2)}</td>
                  <td>
                    {percentage.toFixed(1)}%
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${percentage}%`}}></div>
                    </div>
                  </td>
                  <td>{item.target.toFixed(3)}</td>
                  <td>{item.certification}</td>
                </tr>
              );
            })}
            <tr style={{backgroundColor: '#f0f7ff', fontWeight: 600}}>
              <td>Total</td>
              <td>{totalEmissions.toFixed(3)}</td>
              <td>{totalCost.toFixed(2)}</td>
              <td>100%</td>
              <td>{emissionData.reduce((sum, item) => sum + item.target, 0).toFixed(3)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="stage-details">
        <h3>Raw Materials Detailed Emissions</h3>
        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantity (kg)</th>
              <th>Emission Factor (kg CO₂e/kg)</th>
              <th>Emissions (kg CO₂e)</th>
            </tr>
          </thead>
          <tbody>
            {materialData.map((item, index) => (
              <tr key={index}>
                <td>{item.material}</td>
                <td>
                  <input 
                    type="number" 
                    className="material-input" 
                    value={item.quantity} 
                    step="0.0001"
                    onChange={(e) => handleMaterialChange(index, 'quantity', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    className="emission-factor-input" 
                    value={item.emissionFactor}
                    onChange={(e) => handleMaterialChange(index, 'emissionFactor', parseFloat(e.target.value))}
                  />
                </td>
                <td>{item.emissions.toFixed(3)}</td>
              </tr>
            ))}
            <tr style={{backgroundColor: '#f0f7ff', fontWeight: 600}}>
              <td>Subtotal</td>
              <td>{materialSubtotal.quantity.toFixed(3)}</td>
              <td></td>
              <td>{materialSubtotal.emissions.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={{textAlign: 'center', margin: '30px 0'}}>
        <button className="action-button">Submit Carbon Report</button>
      </div>
      
      <div className="footer">
        <p>Last updated: {new Date().toLocaleDateString()} | Carbon Management System © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default CO2Footprint;
