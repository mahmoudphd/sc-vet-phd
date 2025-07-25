import React, { useState } from "react";

// Temporary UI components with style prop for Card
const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
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
  // State hooks
  const [supplier, setSupplier] = useState("");
  const [product, setProduct] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [tier, setTier] = useState("Tier 1");
  const [volume, setVolume] = useState("");
  const [criticality, setCriticality] = useState("");
  const [incentives, setIncentives] = useState<string[]>([]);
  const [incentivesMap, setIncentivesMap] = useState<Record<number, string>>({});

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

  // Toggle incentives checkboxes for the whole supplier (checkbox list)
  const handleIncentiveToggle = (val: string) => {
    setIncentives((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  // Handle incentive select change for each raw material row
  const handleIncentiveSelect = (
    idx: number,
    val: string
  ) => {
    setIncentivesMap((prev) => ({
      ...prev,
      [idx]: val,
    }));
  };

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: 32, fontWeight: "bold" }}>
        Open Book Accounting Overview
      </h1>

      {/* Filters and supplier info cards row */}
      <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
        <Card style={{ maxWidth: 280 }}>
          <label style={{ fontWeight: "bold", marginBottom: 8, display: "block" }}>
            Supplier
          </label>
          <Select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
            <option value="">Select Supplier</option>
            <option value="Supplier A">Supplier A</option>
            <option value="Supplier B">Supplier B</option>
          </Select>
        </Card>

        <Card style={{ maxWidth: 280 }}>
          <label style={{ fontWeight: "bold", marginBottom: 8, display: "block" }}>
            Product
          </label>
          <Select value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="">Select Product</option>
            <option value="Product X">Product X</option>
            <option value="Product Y">Product Y</option>
          </Select>
        </Card>

        <Card style={{ maxWidth: 280 }}>
          <label style={{ fontWeight: "bold", marginBottom: 8, display: "block" }}>
            Currency
          </label>
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EGP">EGP</option>
          </Select>
        </Card>
      </div>

      {/* Info cards */}
      <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
        <Card>
          <div style={{ fontWeight: "bold", marginBottom: 12 }}>Supplier Tier</div>
          <Select value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="Tier 1">Tier 1</option>
            <option value="Tier 2">Tier 2</option>
            <option value="Tier 3">Tier 3</option>
          </Select>
        </Card>

        <Card>
          <div style={{ fontWeight: "bold", marginBottom: 12 }}>Transaction Volume</div>
          <Input
            placeholder="Enter volume"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </Card>

        <Card>
          <div style={{ fontWeight: "bold", marginBottom: 12 }}>Component Criticality</div>
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
          <div style={{ fontWeight: "bold", marginBottom: 12 }}>Supplier Incentives Offered</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {incentiveOptions.map((inc) => (
              <label key={inc} style={{ userSelect: "none" }}>
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
      </div>

      {/* Raw materials table */}
      <Card style={{ flex: "1 1 100%", overflowX: "auto" }}>
        <h2 style={{ marginBottom: 16 }}>Raw Materials Breakdown</h2>
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
                  <Select
                    value={incentivesMap[idx] || ""}
                    onChange={(e) => handleIncentiveSelect(idx, e.target.value)}
                  >
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
