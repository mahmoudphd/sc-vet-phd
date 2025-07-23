import React, { useState } from "react";

// بدائل مكونات UI مؤقتة
const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, marginBottom: 16 }}>
    {children}
  </div>
);

const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
  >
    {children}
  </button>
);

const Select = ({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) => (
  <select value={value} onChange={onChange} style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}>
    {children}
  </select>
);

const Input = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc", width: "100%" }}
  />
);

const Table = ({ children }: { children: React.ReactNode }) => (
  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
    {children}
  </table>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th style={{ border: "1px solid #ddd", padding: 8, backgroundColor: "#f2f2f2" }}>{children}</th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td style={{ border: "1px solid #ddd", padding: 8 }}>{children}</td>
);

const BatchCosting = () => {
  // States
  const [supplier, setSupplier] = useState("");
  const [product, setProduct] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [tier, setTier] = useState("Tier 1");
  const [volume, setVolume] = useState("");
  const [criticality, setCriticality] = useState("");
  const [incentives, setIncentives] = useState<string[]>([]);

  // Incentive options
  const incentiveOptions = [
    "Greater volumes",
    "Longer contracts",
    "Technical support",
    "Marketing support",
    "Negotiation support",
    "Joint problem solving teams",
  ];

  const rawMaterials = [
    { item: "Vitamin B1", declaredPrice: 10, actualCost: 50 },
    { item: "Vitamin B2", declaredPrice: 8, actualCost: 48 },
    { item: "Vitamin B12", declaredPrice: 12, actualCost: 60 },
    { item: "Pantothenic Acid", declaredPrice: 5, actualCost: 25 },
    { item: "Vitamin B6", declaredPrice: 6, actualCost: 30 },
    { item: "Leucine", declaredPrice: 7, actualCost: 35 },
    { item: "Taurine", declaredPrice: 4, actualCost: 20 },
    { item: "Glycine", declaredPrice: 3, actualCost: 15 },
  ];

  const handleIncentiveToggle = (val: string) => {
    setIncentives((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 24 }}>Open Book Accounting Overview</h1>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <label>
            Supplier:{" "}
            <Select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
              <option value="">Select Supplier</option>
              <option value="Supplier A">Supplier A</option>
              <option value="Supplier B">Supplier B</option>
            </Select>
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            Product:{" "}
            <Select value={product} onChange={(e) => setProduct(e.target.value)}>
              <option value="">Select Product</option>
              <option value="Product X">Product X</option>
              <option value="Product Y">Product Y</option>
            </Select>
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            Currency:{" "}
            <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">USD</option>
              <option value="EGP">EGP</option>
            </Select>
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            Supplier Tier:{" "}
            <Select value={tier} onChange={(e) => setTier(e.target.value)}>
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
            </Select>
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            Transaction Volume:{" "}
            <Input
              placeholder="Enter volume"
              value={volume}
              onChange={(e) => setVolume(e)}
            />
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            Component Criticality:{" "}
            <Select
              value={criticality}
              onChange={(e) => setCriticality(e.target.value)}
            >
              <option value="">Select criticality</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </label>
        </div>

        <div>
          <p>Supplier Incentives Offered:</p>
          {incentiveOptions.map((inc) => (
            <label key={inc} style={{ display: "block", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={incentives.includes(inc)}
                onChange={() => handleIncentiveToggle(inc)}
              />{" "}
              {inc}
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h2>Raw Materials Breakdown</h2>
        <Table>
          <thead>
            <tr>
              <Th>Item</Th>
              <Th>Declared Price ({currency})</Th>
              <Th>Actual Cost ({currency})</Th>
              <Th>Variance ({currency})</Th>
              <Th>Incentives</Th>
            </tr>
          </thead>
          <tbody>
            {rawMaterials.map(({ item, declaredPrice, actualCost }, idx) => (
              <tr key={idx}>
                <Td>{item}</Td>
                <Td>{declaredPrice}</Td>
                <Td>{actualCost}</Td>
                <Td>{actualCost - declaredPrice}</Td>
                <Td>
                  <Select>
                    <option value="">Select Incentive</option>
                    {incentiveOptions.map((inc, i) => (
                      <option key={i} value={inc}>
                        {inc}
                      </option>
                    ))}
                  </Select>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Button onClick={() => alert("Submit clicked!")}>Submit</Button>
    </div>
  );
};

export default BatchCosting;
