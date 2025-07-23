import React, { useState } from "react";

// بدائل مكونات UI مؤقتة
const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      border: "1px solid #ccc",
      borderRadius: 12,
      padding: 24,
      marginBottom: 24,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      minWidth: 280,
      flex: "1 1 250px",
    }}
  >
    {children}
  </div>
);

const Button = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    style={{
      padding: "10px 24px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 16,
      marginTop: 12,
    }}
  >
    {children}
  </button>
);

const Select = ({
  value,
  onChange,
  children,
  style,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      padding: 8,
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 14,
      width: "100%",
      ...style,
    }}
  >
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
    style={{
      padding: 8,
      borderRadius: 6,
      border: "1px solid #ccc",
      width: "100%",
      fontSize: 14,
    }}
  />
);

const Table = ({ children }: { children: React.ReactNode }) => (
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 16,
      fontSize: 14,
    }}
  >
    {children}
  </table>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th
    style={{
      border: "1px solid #ddd",
      padding: 10,
      backgroundColor: "#f9f9f9",
      fontWeight: "600",
      textAlign: "left",
    }}
  >
    {children}
  </th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td style={{ border: "1px solid #ddd", padding: 10 }}>{children}</td>
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
    <div
      style={{
        padding: 24,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: 32, fontWeight: "700", fontSize: 28, color: "#222" }}>
        Open Book Accounting Overview
      </h1>

      {/* Controls cards in flex row */}
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 32,
          justifyContent: "flex-end",
        }}
      >
        <Card>
          <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
            Supplier
          </label>
          <Select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
            <option value="">Select Supplier</option>
            <option value="Supplier A">Supplier A</option>
            <option value="Supplier B">Supplier B</option>
          </Select>
        </Card>

        <Card>
          <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
            Product
          </label>
          <Select value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="">Select Product</option>
            <option value="Product X">Product X</option>
            <option value="Product Y">Product Y</option>
          </Select>
        </Card>

        <Card>
          <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
            Currency
          </label>
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EGP">EGP</option>
          </Select>
        </Card>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 32,
          justifyContent: "space-between",
        }}
      >
        <Card>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
            Supplier Tier
          </div>
          <Select value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="Tier 1">Tier 1</option>
            <option value="Tier 2">Tier 2</option>
            <option value="Tier 3">Tier 3</option>
          </Select>
        </Card>

        <Card>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
            Transaction Volume
          </div>
          <Input
            placeholder="Enter volume"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </Card>

        <Card>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
            Component Criticality
          </div>
          <Select
            value={criticality}
            onChange={(e) => setCriticality(e.target.value)}
          >
            <option value="">Select criticality</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </Card>

        <Card style={{ flex: "1 1 100%" }}>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
            Supplier Incentives Offered
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {incentiveOptions.map((inc) => (
              <label
                key={inc}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: incentives.includes(inc) ? "#007bff" : "#e0e0e0",
                  color: incentives.includes(inc) ? "#fff" : "#333",
                  padding: "6px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  userSelect: "none",
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={incentives.includes(inc)}
                  onChange={() => handleIncentiveToggle(inc)}
                  style={{ cursor: "pointer" }}
                />
                {inc}
              </label>
            ))}
          </div>
        </Card>
      </div>

      {/* Raw Materials Table */}
      <Card style={{ flex: "1 1 100%", overflowX: "auto" }}>
        <h2 style={{ marginBottom: 16, fontWeight: "700", fontSize: 20 }}>
          Raw Materials Breakdown
        </h2>
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
                <Td>{declaredPrice.toFixed(2)}</Td>
                <Td>{actualCost.toFixed(2)}</Td>
                <Td>{(actualCost - declaredPrice).toFixed(2)}</Td>
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
