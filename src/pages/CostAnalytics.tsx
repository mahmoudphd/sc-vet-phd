// src/components/CostManagementFull.jsx

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CostManagementFull() {
  const [selectedProduct, setSelectedProduct] = useState('Poultry Product');
  const [currency, setCurrency] = useState('EGP');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const conversionRate = 30; // 1 USD = 30 EGP

  const convert = (value) => {
    return currency === 'EGP'
      ? `${value.toLocaleString()} EGP`
      : `${(value / conversionRate).toFixed(2)} USD`;
  };

  const costData = [
    {
      item: 'المواد الخام',
      unitCost: 15000,
      targetCost: 12000,
      solution: 'شراء بالجملة',
      costAfter: 11000,
    },
    {
      item: 'التصنيع',
      unitCost: 10000,
      targetCost: 8000,
      solution: 'تحسين التشغيل',
      costAfter: 7800,
    },
  ];

  const actualCost = costData.reduce((sum, row) => sum + row.unitCost, 0);
  const totalCost = costData.reduce((sum, row) => sum + row.targetCost, 0);
  const optimizedCost = costData.reduce((sum, row) => sum + row.costAfter, 0);
  const yieldPercent = ((totalCost / actualCost) * 100).toFixed(1);
  const progressToTarget = ((optimizedCost / totalCost) * 100).toFixed(1);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(costData.map(row => ({
      'Cost Item': row.item,
      'Actual Cost': convert(row.unitCost),
      'Target Cost': convert(row.targetCost),
      'Proposed Solution': row.solution,
      'After Optimization': convert(row.costAfter),
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'CostReport.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Inter-Organizational Cost Report", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Cost Item', 'Actual Cost', 'Target Cost', 'Proposed Solution', 'After Optimization']],
      body: costData.map(row => [
        row.item,
        convert(row.unitCost),
        convert(row.targetCost),
        row.solution,
        convert(row.costAfter),
      ]),
    });
    doc.save("CostReport.pdf");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800">
          Inter-Organizational Cost Management
        </h2>

        <div className="flex items-center gap-3 relative">
          {/* Product Dropdown */}
          <select
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="Poultry Product">Poultry Product</option>
            <option value="Dairy Product">Dairy Product</option>
            <option value="Pet Product">Pet Product</option>
          </select>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
            >
              Export Report
            </button>
            {showExportMenu && (
              <div className="absolute mt-1 right-0 bg-white border rounded shadow z-10 w-40">
                <button onClick={exportToExcel} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Export as Excel</button>
                <button onClick={exportToPDF} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Export as PDF</button>
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <select
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="EGP">EGP</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPI title="Actual Cost" value={convert(actualCost)} color="text-blue-700" />
        <KPI title="Total Cost" value={convert(totalCost)} color="text-blue-700" />
        <KPI title="Yield / Target Cost" value={`${yieldPercent}%`} color="text-green-700" />
        <KPI title="Post-Optimization Estimate" value={convert(optimizedCost)} color="text-yellow-700" />
        <KPI title="Progress to Target" value={`${progressToTarget}%`} color="text-purple-700" progress={progressToTarget} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-gray-300 text-right text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Actual Cost</th>
              <th className="border px-4 py-2">Total Cost ({currency})</th>
              <th className="border px-4 py-2">Yield / Target Cost ({currency})</th>
              <th className="border px-4 py-2">Post-Optimization Estimate ({currency})</th>
              <th className="border px-4 py-2">Progress to Target</th>
              <th className="border px-4 py-2">Proposed Solution</th>
              <th className="border px-4 py-2">After Optimization ({currency})</th>
            </tr>
          </thead>
          <tbody>
            {costData.map((row, index) => {
              const gap = row.unitCost - row.targetCost;
              const gapPercent = ((gap / row.targetCost) * 100).toFixed(1);
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{row.item}</td>
                  <td className="border px-4 py-2">{convert(row.unitCost)}</td>
                  <td className="border px-4 py-2">{convert(row.targetCost)}</td>
                  <td className="border px-4 py-2">{convert(row.costAfter)}</td>
                  <td className="border px-4 py-2">{gapPercent}%</td>
                  <td className="border px-4 py-2">{row.solution}</td>
                  <td className="border px-4 py-2">{convert(row.costAfter)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// KPI Card Component
function KPI({ title, value, color, progress }) {
  return (
    <div className="bg-white shadow p-4 rounded-xl text-center">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className={`text-xl font-semibold ${color} mb-1`}>{value}</p>
      {progress && (
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
}
