import React, { useState } from 'react';
import { Dropdown, Button, Table, Card, Row, Col } from 'react-bootstrap';
import { Chart } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  Tooltip
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  Tooltip
);

// Types
type Product = {
  id: number;
  name: string;
};

type Supplier = {
  id: number;
  productId: number;
  name: string;
  level: 'A' | 'B' | 'C';
};

type CostItem = {
  id: number;
  item: string;
  supplierDeclaredCost: number;
  buyerTarget: number;
  actualCost: number;
  variance: number;
  status: string;
  solution: string;
  packagingType: string;
  capType: string;
  packageShape: string;
  machineType: string;
  dataType: 'تكلفة' | 'معلومات فنية' | 'أخرى';
  disclosure: 'المورد' | 'المشتري';
};

type MaintenanceItem = {
  id: number;
  component: string;
  function: string;
  maintenanceTask: string;
  frequency: string;
  status: string;
  disclosure: 'المورد' | 'المشتري';
  infoType: string;
};

// Constants
const PRODUCTS: Product[] = [
  { id: 1, name: 'Product A' },
  { id: 2, name: 'Product B' },
  { id: 3, name: 'Product C' },
];

const SUPPLIERS: Supplier[] = [
  { id: 1, productId: 1, name: 'Supplier X', level: 'A' },
  { id: 2, productId: 1, name: 'Supplier Y', level: 'B' },
  { id: 3, productId: 2, name: 'Supplier Z', level: 'C' },
];

const PACKAGING_TYPES = ['Pump', 'Floater', 'Scroll'];
const CAP_TYPES = ['Safety Seal', 'Open'];
const PACKAGE_SHAPES = ['دائري', 'مستطيل'];
const MACHINE_TYPES = ['أوتوماتيك', 'نصف أوتوماتيك', 'PLC'];

const COST_ANALYSIS_DATA: CostItem[] = [
  {
    id: 1,
    item: 'Vitamin B1',
    supplierDeclaredCost: 540,
    buyerTarget: 500,
    actualCost: 530,
    variance: 30,
    status: 'Over Target',
    solution: 'Reduce waste',
    packagingType: 'Pump',
    capType: 'Safety Seal',
    packageShape: 'دائري',
    machineType: 'أوتوماتيك',
    dataType: 'تكلفة',
    disclosure: 'المورد',
  },
  {
    id: 2,
    item: 'Packaging Box',
    supplierDeclaredCost: 10,
    buyerTarget: 9,
    actualCost: 8.5,
    variance: -0.5,
    status: 'Under Target',
    solution: '-',
    packagingType: 'Scroll',
    capType: 'Open',
    packageShape: 'مستطيل',
    machineType: 'نصف أوتوماتيك',
    dataType: 'معلومات فنية',
    disclosure: 'المشتري',
  },
];

const MAINTENANCE_DATA: MaintenanceItem[] = [
  {
    id: 1,
    component: 'ماكينة التعبئة',
    function: 'حساس الوزن',
    maintenanceTask: 'تنظيف ومعايرة',
    frequency: 'أسبوعي',
    status: '✅ تم',
    disclosure: 'المورد',
    infoType: 'فنية',
  },
  {
    id: 2,
    component: 'ماكينة التغليف',
    function: 'ذراع اللحام',
    maintenanceTask: 'تشحيم وفحص حرارة',
    frequency: 'شهري',
    status: '⏳ قيد التنفيذ',
    disclosure: 'المشتري',
    infoType: 'فنية',
  },
];

// Helper Components
const KPICard = ({ title, value, variant }: { title: string; value: string | number; variant?: string }) => (
  <Col md={3}>
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className={variant}>{value}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

const DropdownSelector = ({
  items,
  selected,
  onSelect,
  placeholder,
  disabled,
}: {
  items: { id: number; name: string }[];
  selected: any;
  onSelect: (item: any) => void;
  placeholder: string;
  disabled?: boolean;
}) => (
  <Dropdown className="mb-3">
    <Dropdown.Toggle variant="primary" id="dropdown-basic" disabled={disabled}>
      {selected ? selected.name : placeholder}
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {items.map(item => (
        <Dropdown.Item key={item.id} onClick={() => onSelect(item)}>
          {item.name}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

// Chart Components
const LineChartComponent = ({ data }: { data: any }) => (
  <Chart 
    type="line" 
    data={data} 
    options={{ responsive: true, maintainAspectRatio: false }}
  />
);

const BarChartComponent = ({ data }: { data: any }) => (
  <Chart 
    type="bar" 
    data={data} 
    options={{ responsive: true, maintainAspectRatio: false }}
  />
);

const PieChartComponent = ({ data }: { data: any }) => (
  <Chart 
    type="pie" 
    data={data} 
    options={{ responsive: true, maintainAspectRatio: false }}
  />
);

// Main Component
const OpenBookAccountingAnalysis = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  const filteredSuppliers = selectedProduct
    ? SUPPLIERS.filter(supplier => supplier.productId === selectedProduct.id)
    : [];

  // Chart data
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Supplier Declared Cost',
        data: [540, 530, 520, 510, 500, 490],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Buyer Target',
        data: [500, 500, 500, 500, 500, 500],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Actual Cost (IoT)',
        data: [530, 525, 515, 505, 495, 485],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const barChartData = {
    labels: ['Vitamin B1', 'Packaging Box', 'Labor'],
    datasets: [
      {
        label: 'Supplier Declared Cost',
        data: [540, 10, 120],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Buyer Target',
        data: [500, 9, 100],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Actual Cost (IoT)',
        data: [530, 8.5, 110],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const pieChartData = {
    labels: ['Raw Materials', 'Packaging', 'Labor', 'Overhead'],
    datasets: [
      {
        data: [300, 100, 150, 50],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Open Book Accounting Analysis</h2>

      {/* Product and Supplier Selection */}
      <Row className="mb-4">
        <Col md={4}>
          <DropdownSelector
            items={PRODUCTS}
            selected={selectedProduct}
            onSelect={setSelectedProduct}
            placeholder="Select Product"
          />
        </Col>

        <Col md={4}>
          <DropdownSelector
            items={filteredSuppliers}
            selected={selectedSupplier}
            onSelect={setSelectedSupplier}
            placeholder="Select Supplier"
            disabled={!selectedProduct}
          />
        </Col>

        <Col md={4}>
          {selectedSupplier && (
            <Card>
              <Card.Body>
                <Card.Title>Supplier Level: {selectedSupplier.level}</Card.Title>
                <Card.Text>
                  {selectedSupplier.level === 'A'
                    ? 'Preferred Supplier'
                    : selectedSupplier.level === 'B'
                    ? 'Standard Supplier'
                    : 'New Supplier'}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* KPI Cards */}
      <Row className="mb-4">
        <KPICard title="Declared Price" value="EGP 540" />
        <KPICard title="Buyer Target" value="EGP 500" />
        <KPICard title="Actual Cost (IoT)" value="EGP 530" />
        <KPICard title="Variance" value="+30 (6%)" variant="text-danger" />
      </Row>

      {/* Cost Analysis Table */}
      <div className="mb-4">
        <h4>Cost Analysis</h4>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Item</th>
              <th>Supplier Declared Cost (EGP)</th>
              <th>Buyer Target (EGP)</th>
              <th>Actual Cost (EGP)</th>
              <th>Variance</th>
              <th>Status</th>
              <th>Solution</th>
              <th>Packaging Type</th>
              <th>Cap Type</th>
              <th>Package Shape</th>
              <th>Machine Type</th>
              <th>Data Type</th>
              <th>Disclosure</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {COST_ANALYSIS_DATA.map(item => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{item.item}</td>
                  <td>{item.supplierDeclaredCost}</td>
                  <td>{item.buyerTarget}</td>
                  <td>{item.actualCost}</td>
                  <td className={item.variance > 0 ? 'text-danger' : 'text-success'}>
                    {item.variance > 0 ? `+${item.variance}` : item.variance}
                  </td>
                  <td>{item.status}</td>
                  <td>{item.solution}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm">
                        {item.packagingType}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {PACKAGING_TYPES.map(type => (
                          <Dropdown.Item key={type}>{type}</Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm">
                        {item.capType}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {CAP_TYPES.map(type => (
                          <Dropdown.Item key={type}>{type}</Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm">
                        {item.packageShape}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {PACKAGE_SHAPES.map(shape => (
                          <Dropdown.Item key={shape}>{shape}</Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm">
                        {item.machineType}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {MACHINE_TYPES.map(type => (
                          <Dropdown.Item key={type}>{type}</Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>{item.dataType}</td>
                  <td>{item.disclosure}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => setShowDetails(showDetails === item.id ? null : item.id)}
                    >
                      {showDetails === item.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </td>
                </tr>
                {showDetails === item.id && (
                  <tr>
                    <td colSpan={14}>
                      <div className="p-3 bg-light">
                        <h5>Detailed Information for {item.item}</h5>
                        <Row>
                          <Col md={6}>
                            <h6>Raw Materials Composition</h6>
                            <Table striped bordered size="sm">
                              <thead>
                                <tr>
                                  <th>Material</th>
                                  <th>Composition</th>
                                  <th>Concentration</th>
                                  <th>Price/kg</th>
                                  <th>Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Vitamin B1</td>
                                  <td>Thiamine</td>
                                  <td>0.001 kg</td>
                                  <td>EGP 540</td>
                                  <td>EGP 0.54</td>
                                </tr>
                                <tr>
                                  <td>Vitamin B2</td>
                                  <td>Riboflavin</td>
                                  <td>0.006 kg</td>
                                  <td>EGP 600</td>
                                  <td>EGP 3.6</td>
                                </tr>
                              </tbody>
                            </Table>
                          </Col>
                          <Col md={6}>
                            <h6>Packaging Information</h6>
                            <Table striped bordered size="sm">
                              <thead>
                                <tr>
                                  <th>Package Type</th>
                                  <th>Shape</th>
                                  <th>Sealing Method</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Pump</td>
                                  <td>دائري</td>
                                  <td>Safety Seal</td>
                                </tr>
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Machine Maintenance Table */}
      <div className="mb-4">
        <h4>Machine Maintenance Schedule</h4>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Component</th>
              <th>Function</th>
              <th>Maintenance Task</th>
              <th>Frequency</th>
              <th>Status</th>
              <th>Disclosure</th>
              <th>Info Type</th>
            </tr>
          </thead>
          <tbody>
            {MAINTENANCE_DATA.map(item => (
              <tr key={item.id}>
                <td>{item.component}</td>
                <td>{item.function}</td>
                <td>{item.maintenanceTask}</td>
                <td>{item.frequency}</td>
                <td>{item.status}</td>
                <td>{item.disclosure}</td>
                <td>{item.infoType}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Charts Section */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Cost Trend</Card.Title>
              <div style={{ height: '300px' }}>
                <LineChartComponent data={lineChartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Cost Comparison</Card.Title>
              <div style={{ height: '300px' }}>
                <BarChartComponent data={barChartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Cost Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <PieChartComponent data={pieChartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Submit to Blockchain Button */}
      <div className="text-center mb-4">
        <Button variant="primary" size="lg">
          Submit to Blockchain
        </Button>
      </div>
    </div>
  );
};

export default OpenBookAccountingAnalysis;
