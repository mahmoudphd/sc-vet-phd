import React, { useState } from "react";

// Card يقبل خاصية style الآن
const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      width: 220,
      height: 220,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 12,
      ...style,
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
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: 16,
      marginTop: 12,
      alignSelf: "flex-start",
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
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
  style,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
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
      fontSize: 14,
      width: "100%",
      ...style,
    }}
  />
);

const Table = ({ children }: { children: React.ReactNode }) => (
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 16,
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
      backgroundColor: "#f5f5f5",
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
  const [supplier, setSupplier] = useState("");
  const [product, setProduct] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [tier, setTier] = useState("Tier 1");
  const [volume, setVolume] = useState("");
  const [criticality, setCriticality] = useState("");
  const [incentives, setIncentives] = useState<string[]>([]);

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
        padding: 32,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: 32, color: "#222" }}>
        Open Book Accounting Overview
      </h1>

      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 32,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        <Card style={{ width: 220, height: 220 }}>
          <label style={{ marginBottom: 8, fontWeight: "bold" }}>
            Supplier:
            <Select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              style={{ marginTop: 8 }}
            >
              <option value="">Select Supplier</option>
              <option value="Supplier A">Supplier A</option>
              <option value="Supplier B">Supplier B</option>
            </Select>
          </label>
        </Card>

        <Card style={{ width: 220, height: 220 }}>
          <label style={{ marginBottom: 8, fontWeight: "bold" }}>
            Product:
            <Select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              style={{ marginTop: 8 }}
            >
              <option value="">Select Product</option>
              <option value="Product X">Product X</option>
              <option value="Product Y">Product Y</option>
            </Select>
          </label>
        </Card>

        <Card style={{ width: 220, height: 220 }}>
          <label style={{ marginBottom: 8, fontWeight: "bold" }}>
            Currency:
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ marginTop: 8 }}
            >
              <option value="USD">USD</option>
              <option value="EGP">EGP</option>
            </Select>
          </label>
        </Card>

        <Card style={{ width: 220, height: 220 }}>
          <label style={{ marginBottom: 8, fontWeight: "bold" }}>
            Supplier Tier:
            <Select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              style={{ marginTop: 8 }}
            >
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
            </Select>
          </label>
        </Card>

        <Card style={{ width: 220, height: 220 }}>
          <label style={{ marginBottom: 8, fontWeight: "bold" }}>
            Transaction Volume:
            <Input
              placeholder="Enter volume"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              style={{ marginTop: 8 }}
            />
          </label>
        </Card>

        <Card style={{ width: 220, height: 220 }}>
          <label style={{ marginBottom: 8, fontWeight: "bold" }}>
            Component Criticality:
            <Select
              value={criticality}
              onChange={(e) => setCriticality(e.target.value)}
              style={{ marginTop: 8 }}
            >
              <option value="">Select criticality</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </label>
        </Card>

        <Card
          style={{
            width: "100%",
            maxWidth: 960,
            minHeight: 140,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <strong>Supplier Incentives Offered:</strong>
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              marginTop: 12,
            }}
          >
            {incentiveOptions.map((inc) => (
              <label key={inc} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={incentives.includes(inc)}
                  onChange={() => handleIncentiveToggle(inc)}
                  style={{ marginRight: 6 }}
                />
                {inc}
              </label>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ maxWidth: 960, padding: 24 }}>
        <h2 style={{ marginBottom: 20 }}>Raw Materials Breakdown</h2>
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
