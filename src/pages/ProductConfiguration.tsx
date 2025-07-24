import React, { useState } from "react";

const productNames = ["Poultry Drug Product A", "Poultry Drug Product B"];
const packagingShapes = ["Round", "Oval", "Rectangular"];
const packagingTypes = ["Pump", "Floater", "Scroll", "Tube"];
const capTypes = ["Safety Steel", "Flip Top", "Screw Cap"];
const complianceOptions = [
  "ISO 9001:2015 QMS",
  "ISO 14001:2015 EHS",
  "ISO 45001:2018 OHS",
  "ISO 22716:2007 GMP",
  "EDA",
];

const initialData = [
  {
    productId: "PD-001",
    name: "",
    components: "",
    packagingShape: "",
    packagingType: "",
    capType: "",
    packWeight: "",
    compliance: "",
    status: "Active",
    component: "",
  },
];

export default function ProductionDesignTable() {
  const [data, setData] = useState(initialData);

  const handleChange = (index: number, key: string, value: string) => {
    const updated = [...data];
    updated[index][key] = value;
    setData(updated);
  };

  const addRow = () => {
    setData([
      ...data,
      {
        productId: `PD-00${data.length + 1}`,
        name: "",
        components: "",
        packagingShape: "",
        packagingType: "",
        capType: "",
        packWeight: "",
        compliance: "",
        status: "Active",
        component: "",
      },
    ]);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Production Design Info</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Product ID</th>
            <th>Name</th>
            <th>Components</th>
            <th>Packaging Shape</th>
            <th>Packaging Type</th>
            <th>Cap Type</th>
            <th>Pack Weight (g)</th>
            <th>Compliance</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Component</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.productId}</td>
              <td>
                <select
                  value={row.name}
                  onChange={(e) => handleChange(i, "name", e.target.value)}
                >
                  <option value="">Select</option>
                  {productNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={row.components}
                  onChange={(e) => handleChange(i, "components", e.target.value)}
                />
              </td>
              <td>
                <select
                  value={row.packagingShape}
                  onChange={(e) =>
                    handleChange(i, "packagingShape", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  {packagingShapes.map((shape) => (
                    <option key={shape} value={shape}>
                      {shape}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={row.packagingType}
                  onChange={(e) =>
                    handleChange(i, "packagingType", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  {packagingTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={row.capType}
                  onChange={(e) => handleChange(i, "capType", e.target.value)}
                >
                  <option value="">Select</option>
                  {capTypes.map((cap) => (
                    <option key={cap} value={cap}>
                      {cap}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={row.packWeight}
                  onChange={(e) => handleChange(i, "packWeight", e.target.value)}
                />
              </td>
              <td>
                <select
                  value={row.compliance}
                  onChange={(e) =>
                    handleChange(i, "compliance", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  {complianceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 8,
                    background: row.status === "Active" ? "#d1e7dd" : "#f8d7da",
                    color: row.status === "Active" ? "#0f5132" : "#842029",
                    fontWeight: 600,
                  }}
                >
                  {row.status}
                </span>
              </td>
              <td>
                <button style={{ marginRight: 8 }}>Edit</button>
                <button>Delete</button>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={row.component}
                  onChange={(e) => handleChange(i, "component", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addRow}
        style={{ marginTop: 16, padding: "8px 16px", fontWeight: "bold" }}
      >
        Add Row
      </button>
    </div>
  );
}
