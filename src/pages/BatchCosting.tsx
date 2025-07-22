import React, { useState } from 'react';
import { 
  Dropdown,
  Button,
  Table,
  Card,
  Row,
  Col 
} from 'react-bootstrap';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  Tooltip,
  Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  Tooltip,
  Title
);

// Type definitions
interface Product {
  id: number;
  name: string;
  category?: string;
  supplier?: string;
}

interface CostItem {
  id: number;
  name: string;
  cost: number;
  variance?: number;
  status?: 'On Target' | 'Above Target' | 'Below Target';
  lastUpdated?: string;
}

interface ChartDataConfig {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Default configuration
const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'Product A', category: 'Electronics', supplier: 'Supplier X' },
  { id: 2, name: 'Product B', category: 'Furniture', supplier: 'Supplier Y' },
  { id: 3, name: 'Product C', category: 'Clothing', supplier: 'Supplier Z' },
];

const DEFAULT_COST_DATA: CostItem[] = [
  { id: 1, name: 'Raw Materials', cost: 100, status: 'On Target' },
  { id: 2, name: 'Labor', cost: 200, status: 'Above Target' },
  { id: 3, name: 'Packaging', cost: 50, status: 'Below Target' },
];

const BatchCostAnalysis = ({
  products = DEFAULT_PRODUCTS,
  costItems = DEFAULT_COST_DATA,
  chartTitle = 'Cost Breakdown Analysis',
  showExportButton = true,
  enableSupplierFilter = true
}: {
  products?: Product[];
  costItems?: CostItem[];
  chartTitle?: string;
  showExportButton?: boolean;
  enableSupplierFilter?: boolean;
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');

  // Prepare chart data
  const prepareChartData = (items: CostItem[]): ChartDataConfig => ({
    labels: items.map(item => item.name),
    datasets: [
      {
        label: 'Cost',
        data: items.map(item => item.cost),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  });

  const chartData = prepareChartData(costItems);

  // Filter products by supplier if enabled
  const filteredProducts = enableSupplierFilter && selectedSupplier
    ? products.filter(product => product.supplier === selectedSupplier)
    : products;

  // Get unique suppliers for filter
  const uniqueSuppliers = [...new Set(products.map(p => p.supplier).filter((s): s is string => !!s)];

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">{chartTitle}</h2>

      {/* Filters Section */}
      <Row className="mb-4 g-3">
        {enableSupplierFilter && uniqueSuppliers.length > 0 && (
          <Col md={4}>
            <Dropdown>
              <Dropdown.Toggle variant="secondary">
                {selectedSupplier || 'Filter by Supplier'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedSupplier('')}>
                  All Suppliers
                </Dropdown.Item>
                {uniqueSuppliers.map(supplier => (
                  <Dropdown.Item 
                    key={supplier}
                    onClick={() => setSelectedSupplier(supplier)}
                  >
                    {supplier}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        )}
        
        <Col md={4}>
          <Dropdown>
            <Dropdown.Toggle variant="primary">
              {selectedProduct?.name || 'Select Product'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {filteredProducts.map(product => (
                <Dropdown.Item 
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.name} {product.category && `(${product.category})`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Cost Data Table */}
      <Card className="mb-4">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Item</th>
                <th>Cost</th>
                {costItems.some(item => item.status) && <th>Status</th>}
                {costItems.some(item => item.variance) && <th>Variance</th>}
              </tr>
            </thead>
            <tbody>
              {costItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.cost.toFixed(2)}</td>
                  {item.status && (
                    <td>
                      <span className={`badge ${
                        item.status === 'On Target' ? 'bg-success' :
                        item.status === 'Above Target' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  )}
                  {item.variance !== undefined && (
                    <td className={item.variance >= 0 ? 'text-danger' : 'text-success'}>
                      {item.variance >= 0 ? '+' : ''}{item.variance}%
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Chart Visualization */}
      <Card className="mb-4">
        <Card.Body>
          <div style={{ height: '400px' }}>
            <Chart 
              type="bar"
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: chartTitle
                  },
                  legend: {
                    position: 'top',
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Cost ($)'
                    }
                  }
                }
              }}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      {showExportButton && (
        <div className="d-flex justify-content-end gap-3">
          <Button variant="outline-primary">
            Export to Excel
          </Button>
          <Button variant="primary">
            Generate Report
          </Button>
        </div>
      )}
    </div>
  );
};

export default BatchCostAnalysis;
