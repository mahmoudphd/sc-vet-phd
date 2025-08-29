<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sustainability Dashboard - Carbon Footprint Analysis</title>
    <link rel="stylesheet" href="https://unpkg.com/@radix-ui/themes@latest/styles.css" />
    <script src="https://cdn.jsdelivr.net/npm/recharts@2.8.0/umd/Recharts.min.js"></script>
    <style>
        :root {
            --primary-green: #2c974b;
            --dark-green: #1e5128;
            --light-green: #e6f4ea;
            --accent-blue: #0088FE;
            --accent-teal: #00C49F;
            --accent-yellow: #FFBB28;
            --accent-orange: #FF8042;
            --accent-purple: #8884D8;
            --accent-green: #82CA9D;
            --accent-red: #FF6B6B;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
            color: #333;
            line-height: 1.6;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 25px;
            background: linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%);
            color: white;
            border-radius: 16px;
            box-shadow: 0 6px 15px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            margin: 0;
            font-size: 2.8rem;
            font-weight: 700;
        }
        
        .header p {
            margin: 15px 0 0;
            font-size: 1.3rem;
            opacity: 0.9;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            flex-wrap: wrap;
            gap: 15px;
            background: white;
            padding: 20px;
            border-radius: 16px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }
        
        .control-group {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .control-group label {
            font-weight: 600;
            color: var(--dark-green);
        }
        
        select, input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 35px;
        }
        
        .stat-card {
            text-align: center;
            padding: 25px 20px;
            border-radius: 16px;
            background: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }
        
        .stat-card h3 {
            margin: 0;
            font-size: 1.3rem;
            color: var(--primary-green);
            font-weight: 600;
        }
        
        .stat-card .value {
            font-size: 2.4rem;
            font-weight: 800;
            margin: 15px 0;
            color: var(--dark-green);
        }
        
        .stat-card .label {
            font-size: 1rem;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        
        .charts-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 35px;
        }
        
        @media (max-width: 900px) {
            .charts-container {
                grid-template-columns: 1fr;
            }
        }
        
        .chart {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            height: 400px;
        }
        
        .chart h3 {
            margin-top: 0;
            color: var(--primary-green);
            text-align: center;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 20px;
        }
        
        .data-table {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            margin-bottom: 30px;
        }
        
        .data-table h3 {
            margin: 0;
            padding: 20px 25px;
            background: linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%);
            color: white;
            font-size: 1.4rem;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 15px 20px;
            text-align: right;
            border-bottom: 1px solid #eee;
        }
        
        th {
            background-color: var(--light-green);
            font-weight: 600;
            color: var(--dark-green);
        }
        
        tr:hover {
            background-color: #f9f9f9;
        }
        
        .progress-bar {
            height: 10px;
            background: #eee;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 5px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-teal) 0%, var(--accent-blue) 100%);
            border-radius: 5px;
        }
        
        .iot-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 15px;
            background: var(--light-green);
            border-radius: 20px;
            font-weight: 600;
            color: var(--dark-green);
        }
        
        .pulsing-dot {
            width: 12px;
            height: 12px;
            background: var(--primary-green);
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            margin-top: 30px;
            color: #666;
            font-size: 0.9rem;
        }
        
        .positive-change {
            color: #2c974b;
            font-weight: 600;
        }
        
        .negative-change {
            color: #e53e3e;
            font-weight: 600;
        }
        
        .action-button {
            background: linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            font-size: 1rem;
        }
        
        .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .material-input {
            width: 80px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-align: center;
        }
        
        .emission-factor-input {
            width: 100px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-align: center;
            font-weight: 600;
            color: var(--dark-green);
        }
        
        .stage-details {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            margin-bottom: 30px;
        }
        
        .stage-details h3 {
            margin-top: 0;
            color: var(--primary-green);
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--light-green);
        }
        
        .recharts-wrapper {
            margin: 0 auto;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: var(--primary-green);
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s, transform 0.3s;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Sustainability Dashboard - Carbon Footprint Analysis</h1>
            <p>Monitor and analyze carbon emissions across product lifecycle for improved sustainability</p>
        </div>
        
        <div class="controls">
            <div class="control-group">
                <label>Mode:</label>
                <select id="mode-select">
                    <option value="auto">Auto</option>
                    <option value="manual">Manual</option>
                    <option value="iot" selected>IoT Mode</option>
                </select>
            </div>
            
            <div class="control-group">
                <label>Product:</label>
                <select id="product-select">
                    <option value="product1">Poultry Product 1</option>
                    <option value="product2">Poultry Product 2</option>
                    <option value="product3">Poultry Product 3</option>
                </select>
            </div>
            
            <div class="control-group">
                <label>Currency:</label>
                <select id="currency-select">
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EGP" selected>Egyptian Pound (EGP)</option>
                </select>
            </div>
            
            <div class="iot-indicator">
                <div class="pulsing-dot"></div>
                <span>Sensors Active</span>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Emissions</h3>
                <div class="value">8.725 kg CO₂e</div>
                <div class="label"><span class="positive-change">▼ 12%</span> YoY reduction</div>
            </div>
            
            <div class="stat-card">
                <h3>Environmental Cost</h3>
                <div class="value">21,812.50 EGP</div>
                <div class="label">Carbon price: $50/ton</div>
            </div>
            
            <div class="stat-card">
                <h3>Carbon Intensity</h3>
                <div class="value">0.1586 kg/1K EGP</div>
                <div class="label"><span class="positive-change">▼ 8%</span> from last quarter</div>
            </div>
            
            <div class="stat-card">
                <h3>Emission Reduction</h3>
                <div class="value">6.5 kg CO₂e</div>
                <div class="label">From sustainability initiatives</div>
            </div>
        </div>
        
        <div class="charts-container">
            <div class="chart">
                <h3>Emissions by Category</h3>
                <div id="pie-chart"></div>
            </div>
            
            <div class="chart">
                <h3>Emission Reduction Initiatives</h3>
                <div id="bar-chart"></div>
            </div>
        </div>
        
        <div class="data-table">
            <h3>Emission and Cost Details</h3>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Emissions (kg CO₂e)</th>
                        <th>Environmental Cost (EGP)</th>
                        <th>% of Total</th>
                        <th>Target (kg CO₂e)</th>
                        <th>Certification</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Raw Materials</td>
                        <td>3.625</td>
                        <td>9,062.50</td>
                        <td>
                            41.5%
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 41.5%"></div>
                            </div>
                        </td>
                        <td>2.900</td>
                        <td>ISO 14001</td>
                    </tr>
                    <tr>
                        <td>Manufacturing</td>
                        <td>1.598</td>
                        <td>3,995.00</td>
                        <td>
                            18.3%
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 18.3%"></div>
                            </div>
                        </td>
                        <td>1.278</td>
                        <td>ISO 50001</td>
                    </tr>
                    <tr>
                        <td>Packaging</td>
                        <td>0.395</td>
                        <td>987.50</td>
                        <td>
                            4.5%
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 4.5%"></div>
                            </div>
                        </td>
                        <td>0.316</td>
                        <td>ISO 14064</td>
                    </tr>
                    <tr>
                        <td>Transport</td>
                        <td>0.600</td>
                        <td>1,500.00</td>
                        <td>
                            6.9%
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 6.9%"></div>
                            </div>
                        </td>
                        <td>0.480</td>
                        <td>GHG Protocol</td>
                    </tr>
                    <tr>
                        <td>Distribution</td>
                        <td>0.058</td>
                        <td>145.00</td>
                        <td>
                            0.7%
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0.7%"></div>
                            </div>
                        </td>
                        <td>0.046</td>
                        <td>ISO 14067</td>
                    </tr>
                    <tr>
                        <td>Use</td>
                        <td>0.130</td>
                        <td>325.00</td>
                        <td>
                            1.5%
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 1.5%"></div>
                            </div>
                        </td>
                        <td>0.104</td>
                        <td>Cradle to Cradle</td>
                    </tr>
                    <tr>
                        <td>End of Life</td>
                        <td>0.380</td>
                        <td>950.00</td>
                        <td>
                            4.4%
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 4.4%"></div>
                            </div>
                        </td>
                        <td>0.304</td>
                        <td>None</td>
                    </tr>
                    <tr style="background-color: #f0f7ff; font-weight: 600;">
                        <td>Total</td>
                        <td>8.725</td>
                        <td>21,812.50</td>
                        <td>100%</td>
                        <td>6.980</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="stage-details">
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
                    <tr>
                        <td>Vitamin B1</td>
                        <td><input type="number" class="material-input" value="0.001" step="0.0001"></td>
                        <td><input type="number" class="emission-factor-input" value="85"></td>
                        <td>0.085</td>
                    </tr>
                    <tr>
                        <td>Vitamin B2</td>
                        <td><input type="number" class="material-input" value="0.006" step="0.0001"></td>
                        <td><input type="number" class="emission-factor-input" value="92"></td>
                        <td>0.552</td>
                    </tr>
                    <tr>
                        <td>Vitamin B12</td>
                        <td><input type="number" class="material-input" value="0.001" step="0.0001"></td>
                        <td><input type="number" class="emission-factor-input" value="120"></td>
                        <td>0.120</td>
                    </tr>
                    <tr>
                        <td>Nicotinamide (B3)</td>
                        <td><input type="number" class="material-input" value="0.010" step="0.0001"></td>
                        <td><input type="number" class="emission-factor-input" value="78"></td>
                        <td>0.780</td>
                    </tr>
                    <tr>
                        <td>Pantothenic Acid</td>
                        <td><input type="number" class="material-input" value="0.004" step="0.0001"></td>
                        <td><input type="number" class="emission-factor-input" value="65"></td>
                        <td>0.260</td>
                    </tr>
                    <tr style="background-color: #f0f7ff; font-weight: 600;">
                        <td>Subtotal</td>
                        <td>0.022</td>
                        <td></td>
                        <td>1.797</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <button class="action-button" id="submit-report">Submit Carbon Report</button>
        </div>
        
        <div class="footer">
            <p>Last updated: <span id="current-date"></span> | Carbon Management System © 2023</p>
        </div>
    </div>

    <div class="notification" id="notification">Report submitted successfully!</div>

    <script>
        // Set current date
        document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        // Constants
        const CARBON_PRICE_PER_TON = 50; // USD per ton
        const EXCHANGE_RATE = 50; // EGP per USD
        const KG_PER_TON = 1000; // kg per ton

        // Colors for charts
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

        // Data for charts
        const pieChartData = [
            { name: 'Raw Materials', value: 3.625, cost: 9062.50 },
            { name: 'Manufacturing', value: 1.598, cost: 3995.00 },
            { name: 'Packaging', value: 0.395, cost: 987.50 },
            { name: 'Transport', value: 0.600, cost: 1500.00 },
            { name: 'Distribution', value: 0.058, cost: 145.00 },
            { name: 'Use', value: 0.130, cost: 325.00 },
            { name: 'End of Life', value: 0.380, cost: 950.00 }
        ];

        const barChartData = [
            { initiative: 'Solar Panel Installation', reduction: 2.5 },
            { initiative: 'LED Lighting', reduction: 1.2 },
            { initiative: 'Industrial Waste Recycling', reduction: 1.5 },
            { initiative: 'Fuel Consumption Optimization', reduction: 1.3 }
        ];

        // Initialize charts
        function initCharts() {
            // Pie chart for emissions by category
            const pieChart = Recharts.PieChart;
            const pie = Recharts.Pie;
            const cell = Recharts.Cell;
            const tooltip = Recharts.Tooltip;
            const legend = Recharts.Legend;
            const responsiveContainer = Recharts.ResponsiveContainer;

            ReactDOM.render(
                React.createElement(responsiveContainer, { width: "100%", height: 300 },
                    React.createElement(pieChart, null,
                        React.createElement(pie, {
                            data: pieChartData,
                            cx: "50%",
                            cy: "50%",
                            outerRadius: 80,
                            fill: "#8884d8",
                            dataKey: "value",
                            label: ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`
                        }, pieChartData.map((entry, index) => React.createElement(cell, { key: `cell-${index}`, fill: COLORS[index % COLORS.length] }))),
                        React.createElement(tooltip, {
                            formatter: (value, name, props) => [
                                `${value.toFixed(3)} kg CO₂e`,
                                name,
                                `EGP ${props.payload.cost.toFixed(2)}`
                            ]
                        }),
                        React.createElement(legend, null)
                    )
                ),
                document.getElementById('pie-chart')
            );

            // Bar chart for emission reduction initiatives
            const barChart = Recharts.BarChart;
            const bar = Recharts.Bar;
            const xAxis = Recharts.XAxis;
            const yAxis = Recharts.YAxis;
            const cartesianGrid = Recharts.CartesianGrid;

            ReactDOM.render(
                React.createElement(responsiveContainer, { width: "100%", height: 300 },
                    React.createElement(barChart, { data: barChartData },
                        React.createElement(cartesianGrid, { strokeDasharray: "3 3" }),
                        React.createElement(xAxis, { dataKey: "initiative" }),
                        React.createElement(yAxis, null),
                        React.createElement(tooltip, {
                            formatter: (value) => [`${value} kg CO₂e`, 'Reduction'],
                            labelFormatter: (label) => label
                        }),
                        React.createElement(legend, null),
                        React.createElement(bar, { dataKey: "reduction", name: "Reduction (kg CO₂e)", fill: "#8884d8" })
                    )
                ),
                document.getElementById('bar-chart')
            );
        }

        // Initialize charts when page loads
        window.addEventListener('load', initCharts);

        // Simulate IoT data updates
        function simulateIoTData() {
            // Simulate data changes in auto mode
            const emissionsElements = document.querySelectorAll('.data-table tbody tr:not(:last-child) td:nth-child(2)');
            const costElements = document.querySelectorAll('.data-table tbody tr:not(:last-child) td:nth-child(3)');
            
            emissionsElements.forEach((el, index) => {
                if (index < 7) { // Only for the first seven rows
                    const currentValue = parseFloat(el.textContent);
                    const randomChange = (Math.random() * 0.1) - 0.05; // Random change between -5% and +5%
                    const newValue = currentValue * (1 + randomChange);
                    el.textContent = newValue.toFixed(3);
                    
                    // Update cost based on new emissions
                    const costPerKg = 21812.50 / 8.725; // Cost per kg
                    costElements[index].textContent = (newValue * costPerKg).toFixed(2);
                }
            });
            
            // Update totals
            updateTotals();
        }
        
        function updateTotals() {
            const emissionsElements = document.querySelectorAll('.data-table tbody tr:not(:last-child) td:nth-child(2)');
            const costElements = document.querySelectorAll('.data-table tbody tr:not(:last-child) td:nth-child(3)');
            
            let totalEmissions = 0;
            let totalCost = 0;
            
            emissionsElements.forEach((el, index) => {
                if (index < 7) {
                    totalEmissions += parseFloat(el.textContent);
                    totalCost += parseFloat(costElements[index].textContent);
                }
            });
            
            // Update total row
            document.querySelector('.data-table tbody tr:last-child td:nth-child(2)').textContent = totalEmissions.toFixed(3);
            document.querySelector('.data-table tbody tr:last-child td:nth-child(3)').textContent = totalCost.toFixed(2);
            
            // Update percentages
            const percentageElements = document.querySelectorAll('.data-table tbody tr:not(:last-child) td:nth-child(4)');
            percentageElements.forEach((el, index) => {
                if (index < 7) {
                    const emissionValue = parseFloat(emissionsElements[index].textContent);
                    const percentage = (emissionValue / totalEmissions) * 100;
                    el.innerHTML = `${percentage.toFixed(1)}%<div class="progress-bar"><div class="progress-fill" style="width: ${percentage.toFixed(1)}%"></div></div>`;
                }
            });
            
            // Update stat cards
            document.querySelector('.stat-card:nth-child(1) .value').textContent = `${totalEmissions.toFixed(3)} kg CO₂e`;
            document.querySelector('.stat-card:nth-child(2) .value').textContent = `${totalCost.toFixed(2)} EGP`;
            
            const carbonIntensity = totalEmissions / (55000 / 1000);
            document.querySelector('.stat-card:nth-child(3) .value').textContent = `${carbonIntensity.toFixed(4)} kg/1K EGP`;
        }
        
        // Start IoT simulation if auto mode is enabled
        document.getElementById('mode-select').addEventListener('change', function() {
            if (this.value === 'iot') {
                // Show IoT indicator
                document.querySelector('.iot-indicator').style.display = 'flex';
                // Start simulation every 3 seconds
                setInterval(simulateIoTData, 3000);
            } else {
                // Hide IoT indicator
                document.querySelector('.iot-indicator').style.display = 'none';
            }
        });
        
        // Start simulation on page load if IoT mode is default
        if (document.getElementById('mode-select').value === 'iot') {
            setInterval(simulateIoTData, 3000);
        }
        
        // Update emission values when inputs change
        document.querySelectorAll('.material-input, .emission-factor-input').forEach(input => {
            input.addEventListener('change', function() {
                const row = this.closest('tr');
                const quantity = parseFloat(row.querySelector('.material-input').value);
                const factor = parseFloat(row.querySelector('.emission-factor-input').value);
                
                if (!isNaN(quantity) && !isNaN(factor)) {
                    const emission = quantity * factor;
                    row.querySelector('td:last-child').textContent = emission.toFixed(3);
                    
                    // Update subtotal
                    updateRawMaterialsSubtotal();
                }
            });
        });
        
        function updateRawMaterialsSubtotal() {
            let totalQuantity = 0;
            let totalEmissions = 0;
            
            document.querySelectorAll('.stage-details tbody tr:not(:last-child)').forEach(row => {
                const quantity = parseFloat(row.querySelector('.material-input').value);
                const emission = parseFloat(row.querySelector('td:last-child').textContent);
                
                if (!isNaN(quantity)) totalQuantity += quantity;
                if (!isNaN(emission)) totalEmissions += emission;
            });
            
            const subtotalRow = document.querySelector('.stage-details tbody tr:last-child');
            subtotalRow.querySelector('td:nth-child(2)').textContent = totalQuantity.toFixed(3);
            subtotalRow.querySelector('td:last-child').textContent = totalEmissions.toFixed(3);
        }
        
        // Submit report handler
        document.getElementById('submit-report').addEventListener('click', function() {
            const notification = document.getElementById('notification');
            notification.textContent = 'Carbon report submitted successfully!';
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        });
    </script>
</body>
</html>
