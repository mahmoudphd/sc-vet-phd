import React, { useState } from "react";

// كروت مربعة بأبعاد ثابتة
const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      width: 200,
      height: 200,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 12,
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
      padding: "12px 28px",
      backgroundColor: "#2563EB",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 16,
      transition: "background-color 0.3s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
  >
    {children}
  </button>
);

const Select = ({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  label?: string;
}) => (
  <label
    style={{
      display: "flex",
      flexDirection: "column",
      fontSize: 14,
      fontWeight: 600,
      color: "#374151",
      marginBottom: 12,
    }}
  >
    {label && <span style={{ marginBottom: 6 }}>{label}</span>}
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: 10,
        borderRadius: 8,
        border: "1px solid #ccc",
        fontSize: 16,
        outline: "none",
        cursor: "pointer",
        backgroundColor: "#f9fafb",
      }}
    >
      {children}
    </select>
  </label>
);

const Input = ({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}) => (
  <label
    style={{
      display: "flex",
      flexDirection: "column",
      fontSize: 14,
      fontWeight: 600,
      color: "#374151",
      marginBottom: 12,
    }}
  >
    {label && <span style={{ marginBottom: 6 }}>{label}</span>}
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: 10,
        borderRadius: 8,
        border: "1px solid #ccc",
        fontSize: 16,
        outline: "none",
        backgroundColor: "#f9fafb",
      }}
    />
  </label>
);

const Table = ({ children }: { children: React.ReactNode }) => (
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 12,
      fontSize: 15,
      color: "#374151",
    }}
  >
    {children}
  </table>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th
    style={{
      borderBottom: "2px solid #e5e7eb",
      padding: "12px 16px",
      textAlign: "left",
      backgroundColor: "#f3f4f6",
      color: "#111827",
      fontWeight: 700,
    }}
  >
    {children}
  </th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb" }}>
    {children}
  </td>
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
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: 32,
          color: "#1f2937",
          fontWeight: "800",
          fontSize: 28,
          textAlign: "center",
        }}
      >
        Open Book Accounting Overview
      </h1>

      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        <Card>
          <Select
            label="Supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          >
            <option value="">Select Supplier</option>
            <option value="Supplier A">Supplier A</option>
            <option value="Supplier B">Supplier B</option>
          </Select>
          <Select
            label="Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            <option value="">Select Product</option>
            <option value="Product X">Product X</option>
            <option value="Product Y">Product Y</option>
          </Select>
        </Card>

        <Card>
          <Select
            label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="EGP">EGP</option>
          </Select>
          <Select
            label="Supplier Tier"
            value={tier}
            onChange={(e) => setTier(e.target.value)}
          >
            <option value="Tier 1">Tier 1</option>
            <option value="Tier 2">Tier 2</option>
            <option value="Tier 3">Tier 3</option>
          </Select>
        </Card>

        <Card>
          <Input
            label="Transaction Volume"
            placeholder="Enter volume"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
          <Select
            label="Component Criticality"
            value={criticality}
            onChange={(e) => setCriticality(e.target.value)}
          >
            <option value="">Select criticality</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </Card>

        <Card
          style={{
            overflowY: "auto",
          }}
        >
          <p
            style={{
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 12,
              color: "#374151",
            }}
          >
            Supplier Incentives Offered:
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxHeight: 140,
              overflowY: "auto",
            }}
          >
            {incentiveOptions.map((inc) => (
              <label
                key={inc}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  backgroundColor: incentives.includes(inc)
                    ? "#2563EB"
                    : "#e5e7eb",
                  color: incentives.includes(inc) ? "#fff" : "#374151",
                  padding: "6px 12px",
                  borderRadius: 20,
                  cursor: "pointer",
                  userSelect: "none",
                  border: incentives.includes(inc) ? "none" : "1px solid #ccc",
                }}
              >
                <input
                  type="checkbox"
                  checked={incentives.includes(inc)}
                  onChange={() => handleIncentiveToggle(inc)}
                  style={{ display: "none" }}
                />
                {inc}
              </label>
            ))}
          </div>
        </Card>
      </div>

      <Card
        style={{
          width: "100%",
          height: "auto",
          padding: 20,
          overflowX: "auto",
        }}
      >
        <h2 style={{ marginBottom: 16, color: "#1f2937" }}>
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
                <Td>{declaredPrice}</Td>
                <Td>{actualCost}</Td>
                <Td>{(actualCost - declaredPrice).toFixed(2)}</Td>
                <Td>
                  <Select value="" onChange={() => {}}>
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

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Button onClick={() => alert("Submit clicked!")}>Submit</Button>
      </div>
    </div>
  );
};

export default BatchCosting;
