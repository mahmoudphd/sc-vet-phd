import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const CO2Footprint: React.FC = () => {
  const [mode, setMode] = useState('iot');
  const [product, setProduct] = useState('product1');
  const [currency, setCurrency] = useState('EGP');
  const [emissionsData, setEmissionsData] = useState([
    { category: 'Raw Materials', emissions: 3.625, cost: 9062.50, target: 2.900, certification: 'ISO 14001' },
    { category: 'Manufacturing', emissions: 1.598, cost: 3995.00, target: 1.278, certification: 'ISO 50001' },
    { category: 'Packaging', emissions: 0.395, cost: 987.50, target: 0.316, certification: 'ISO 14064' },
    { category: 'Transport', emissions: 0.600, cost: 1500.00, target: 0.480, certification: 'GHG Protocol' },
    { category: 'Distribution', emissions: 0.058, cost: 145.00, target: 0.046, certification: 'ISO 14067' },
    { category: 'Use', emissions: 0.130, cost: 325.00, target: 0.104, certification: 'Cradle to Cradle' },
    { category: 'End of Life', emissions: 0.380, cost: 950.00, target: 0.304, certification: 'None' },
  ]);
  
  const [rawMaterials, setRawMaterials] = useState([
    { material: 'Vitamin B1', quantity: 0.001, factor: 85, emissions: 0.085 },
    { material: 'Vitamin B2', quantity: 0.006, factor: 92, emissions: 0.552 },
    { material: 'Vitamin B12', quantity: 0.001, factor: 120, emissions: 0.120 },
    { material: 'Nicotinamide (B3)', quantity: 0.010, factor: 78, emissions: 0.780 },
    { material: 'Pantothenic Acid', quantity: 0.004, factor: 65, emissions: 0.260 },
  ]);

  const pieData = [
    { name: 'Raw Materials', value: 41.5, color: '#0088FE' },
    { name: 'Manufacturing', value: 18.3, color: '#00C49F' },
    { name: 'Packaging', value: 4.5, color: '#FFBB28' },
    { name: 'Transport', value: 6.9, color: '#FF8042' },
    { name: 'Distribution', value: 0.7, color: '#8884D8' },
    { name: 'Use', value: 1.5, color: '#82CA9D' },
    { name: 'End of Life', value: 4.4, color: '#FFC658' },
  ];

  const barData = [
    { name: 'Solar Power', reduction: 2.5, cost: 5000 },
    { name: 'Efficient Logistics', reduction: 1.8, cost: 3500 },
    { name: 'Recycled Packaging', reduction: 0.9, cost: 2000 },
    { name: 'Waste Reduction', reduction: 1.3, cost: 4000 },
  ];

  const totalEmissions = emissionsData.reduce((sum, item) => sum + item.emissions, 0);
  const totalCost = emissionsData.reduce((sum, item) => sum + item.cost, 0);
  const carbonIntensity = totalEmissions / (55000 / 1000);
  const emissionReduction = 6.5;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'iot') {
      interval = setInterval(simulateIoTData, 3000);
    }
    return () => clearInterval(interval);
  }, [mode]);

  const simulateIoTData = () => {
    const newData = emissionsData.map(item => {
      const randomChange = (Math.random() * 0.1) - 0.05;
      const newEmissions = item.emissions * (1 + randomChange);
      const costPerKg = totalCost / totalEmissions;
      return {
        ...item,
        emissions: parseFloat(newEmissions.toFixed(3)),
        cost: parseFloat((newEmissions * costPerKg).toFixed(2))
      };
    });
    setEmissionsData(newData);
  };

  const updateRawMaterial = (index: number, field: string, value: number) => {
    const updatedMaterials = [...rawMaterials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value
    };
    
    if (field === 'quantity' || field === 'factor') {
      updatedMaterials[index].emissions = 
        updatedMaterials[index].quantity * updatedMaterials[index].factor;
    }
    
    setRawMaterials(updatedMaterials);
  };

  const rawMaterialsSubtotal = {
    quantity: rawMaterials.reduce((sum, item) => sum + item.quantity, 0),
    emissions: rawMaterials.reduce((sum, item) => sum + item.emissions, 0)
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

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
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart">
          <h3>Emission Reduction Initiatives</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reduction" fill="#00C49F" name="CO₂ Reduction (kg)" />
              <Bar dataKey="cost" fill="#0088FE" name="Cost" />
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
            {emissionsData.map((item, index) => {
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
              <td>{emissionsData.reduce((sum, item) => sum + item.target, 0).toFixed(3)}</td>
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
            {rawMaterials.map((material, index) => (
              <tr key={index}>
                <td>{material.material}</td>
                <td>
                  <input 
                    type="number" 
                    className="material-input" 
                    value={material.quantity} 
                    step="0.0001"
                    onChange={(e) => updateRawMaterial(index, 'quantity', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    className="emission-factor-input" 
                    value={material.factor}
                    onChange={(e) => updateRawMaterial(index, 'factor', parseFloat(e.target.value))}
                  />
                </td>
                <td>{material.emissions.toFixed(3)}</td>
              </tr>
            ))}
            <tr style={{backgroundColor: '#f0f7ff', fontWeight: 600}}>
              <td>Subtotal</td>
              <td>{rawMaterialsSubtotal.quantity.toFixed(3)}</td>
              <td></td>
              <td>{rawMaterialsSubtotal.emissions.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={{textAlign: 'center', margin: '30px 0'}}>
        <button className="action-button">Submit Carbon Report</button>
      </div>
      
      <div className="footer">
        <p>Last updated: {new Date().toLocaleDateString()} | Carbon Management System © 2023</p>
      </div>
    </div>
  );
};

export default CO2Footprint;
