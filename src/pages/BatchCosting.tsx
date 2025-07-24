import React, { useState } from "react";

const rawMaterials = [
  { item: "Vitamin B1", declaredPrice: 10, actualCost: 50 },
  { item: "Vitamin B2", declaredPrice: 8, actualCost: 48 },
  { item: "Vitamin B12", declaredPrice: 12, actualCost: 60 },
];

const incentiveOptions = [
  "Greater volumes",
  "Longer contracts",
  "Technical support",
  "Marketing support",
];

export default function BatchCosting() {
  const [currency, setCurrency] = useState("USD");
  const [incentivesMap, setIncentivesMap] = useState<Record<number, string>>({});

  const handleIncentiveSelect = (idx: number, val: string) => {
    setIncentivesMap((prev) => ({ ...prev, [idx]: val }));
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 20 }}>Open Book Accounting Overview</h1>

      <label style={{ marginBottom: 20, display: "block" }}>
        Currency:{" "}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
            minWidth: 100,
            cursor: "pointer",
          }}
        >
          <option value="USD">USD</option>
          <option value="EGP">EGP</option>
        </select>
      </label>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={{ border: "1px solid #ddd", padding: 12, textAlign: "left" }}>Item</th>
            <th style={{ border: "1px solid #ddd", padding: 12, textAlign: "left" }}>
              Declared Price ({currency})
            </th>
            <th style={{ border: "1px solid #ddd", padding: 12, textAlign: "left" }}>
              Actual Cost ({currency})
            </th>
            <th style={{ border: "1px solid #ddd", padding: 12, textAlign: "left" }}>
              Variance ({currency})
            </th>
            <th style={{ border: "1px solid #ddd", padding: 12, textAlign: "left" }}>Incentives</th>
          </tr>
        </thead>
        <tbody>
          {rawMaterials.map(({ item, declaredPrice, actualCost }, idx) => (
            <tr key={idx}>
              <td style={{ border: "1px solid #ddd", padding: 12 }}>{item}</td>
              <td style={{ border: "1px solid #ddd", padding: 12 }}>
                {currency} {declaredPrice.toFixed(2)}
              </td>
              <td style={{ border: "1px solid #ddd", padding: 12 }}>
                {currency} {actualCost.toFixed(2)}
              </td>
              <td style={{ border: "1px solid #ddd", padding: 12 }}>
                {currency} {(actualCost - declaredPrice).toFixed(2)}
              </td>
              <td style={{ border: "1px solid #ddd", padding: 12 }}>
                <select
                  value={incentivesMap[idx] || ""}
                  onChange={(e) => handleIncentiveSelect(idx, e.target.value)}
                  style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc", width: "100%" }}
                >
                  <option value="">Select Incentive</option>
                  {incentiveOptions.map((inc) => (
                    <option key={inc} value={inc}>
                      {inc}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => alert("Submit clicked!")}
        style={{
          marginTop: 20,
          padding: "12px 24px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        Submit
      </button>
    </div>
  );
}
