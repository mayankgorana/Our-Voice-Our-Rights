import React, { useState, useMemo } from "react";
import { fetchMgnrega } from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ----------------------------------------------------------------------
// CONSTANT ARRAYS (Defined outside for stable references)
// ----------------------------------------------------------------------
const states = [
  "ANDAMAN AND NICOBAR",
  "ANDHRA PRADESH",
  "ARUNACHAL PRADESH",
  "ASSAM",
  "BIHAR",
  "CHHATTISGARH",
  "DN HAVELI AND DD",
  "GOA",
  "GUJARAT",
  "HARYANA",
  "HIMACHAL PRADESH",
  "JAMMU AND KASHMIR",
  "JHARKHAND",
  "KARNATAKA",
  "KERALA",
  "LADAKH",
  "LAKSHADWEEP",
  "MADHYA PRADESH",
  "MAHARASHTRA",
  "MANIPUR",
  "MEGHALAYA",
  "MIZORAM",
  "NAGALAND",
  "ODISHA",
  "PUDUCHERRY",
  "PUNJAB",
  "RAJASTHAN",
  "SIKKIM",
  "TAMIL NADU",
  "TELANGANA",
  "TRIPURA",
  "UTTAR PRADESH",
  "UTTARAKHAND",
  "WEST BENGAL",
];
const years = [
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
];
const progressFields = [
  {
    key: "percent_of_Category_B_Works",
    label: "Category B Works %",
    color: "#60A5FA",
  },
  {
    key: "percent_of_Expenditure_on_Agriculture_Allied_Works",
    label: "Agriculture Allied %",
    color: "#34D399",
  },
  {
    key: "percent_of_NRM_Expenditure",
    label: "NRM Expenditure %",
    color: "#FBBF24",
  },
  {
    key: "percentage_payments_gererated_within_15_days",
    label: "Payments within 15 Days %",
    color: "#F87171",
  },
];
const KPI_FIELDS = [
  { key: "Total_Households_Worked", label: "Households Worked", unit: "" },
  { key: "Wages", label: "Total Wages (Cr)", unit: " Cr" },
  {
    key: "Women_Persondays",
    label: "Women Persondays (Lakhs)",
    unit: "",
  },
];
const PIE_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#d0ed57",
  "#a4de6c",
];

const BAR_COLORS = {
  Households: "#059669",
  Wages: "#2563eb",
};
// ----------------------------------------------------------------------

function Dashboard() {
  const [state, setState] = useState("ANDAMAN AND NICOBAR");
  const [year, setYear] = useState("2020-2021");
  const [sortField, setSortField] = useState("state_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!state || !year)
      return alert("Please select both state and financial year");
    setLoading(true);
    setData([]);
    try {
      const res = await fetchMgnrega({
        state_name: state,
        fin_year: year,
        sort_field: sortField,
        sort_order: sortOrder,
      });
      setData(res.records);
    } catch (err) {
      console.error(err);
      alert("Error fetching data from backend");
    } finally {
      setLoading(false);
    }
  };

  const getPieChartData = useMemo(() => {
    if (data.length === 0) return [];

    const districtWageMap = data.reduce((acc, record) => {
      const district = record.district_name || "N/A";
      const wages = Number(record.Wages) || 0;
      acc[district] = (acc[district] || 0) + wages;
      return acc;
    }, {});

    return Object.keys(districtWageMap)
      .map((district) => ({
        name: district,
        value: districtWageMap[district],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [data]);

  const aggregatedKPIs = useMemo(() => {
    if (data.length === 0) return {};

    return KPI_FIELDS.reduce((acc, field) => {
      const sum = data.reduce(
        (s, record) => s + (Number(record[field.key]) || 0),
        0
      );
      acc[field.key] = sum;
      return acc;
    }, {});
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-title">{`District: ${label}`}</p>
          {payload.map((p, index) => (
            <p
              key={index}
              style={{ color: p.color }}
              className="tooltip-content"
            >
              {`${p.dataKey}: ${p.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatNumber = (num, unit = "") => {
    if (num === undefined || num === null) return "N/A";
    return (
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        notation: "compact",
      }).format(num) + unit
    );
  };

  return (
    <div className="dashboard-container">
      <h1 className="main-title">
        MGNREGA Dashboard:{" "}
        <span style={{ color: "#D97706" }}>OUR VOICE, OUR RIGHTS</span>
      </h1>

      {/* --- Filters Section --- */}
      <div className="filter-section">
        <div className="filter-group">
          {/* State Select */}  
          <div className="filter-item">
            <label className="filter-label">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="filter-select"
            >
              <option value="">Select State</option>
              {states.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Year Select */}
          <div className="filter-item">
            <label className="filter-label">Financial Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="filter-select"
            >
              <option value="">Select Year</option>
              {years.map((y, i) => (
                <option key={i} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Select */}
          <div className="filter-item">
            <label className="filter-label">Sort By</label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="filter-select"
            >
              <option value="state_name">State Name</option>
              <option value="district_name">District Name</option>
              <option value="fin_year">Financial Year</option>
            </select>
          </div>

          {/* Order Select */}
          <div className="filter-item">
            <label className="filter-label">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Fetch Button */}
          <button
            onClick={fetchData}
            className="fetch-button"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch Data"}
          </button>
        </div>
      </div>

      {/* Show Loading State or Message */}
      {loading && <div className="loading-message">Loading Data...</div>}
      {data.length === 0 && !loading && (
        <div className="no-data-message">
          Please select a State and Financial Year and click **Fetch Data** to
          display the dashboard.
        </div>
      )}

      {/* --- Dashboard Content Grid --- */}
      {data.length > 0 && (
        <>
          {/* KPI Cards (Top Row) */}
          <div className="kpi-grid">
            {KPI_FIELDS.map((field) => (
              <div key={field.key} className="kpi-card">
                <p className="kpi-label">{field.label}</p>
                <p className="kpi-value">
                  {formatNumber(aggregatedKPIs[field.key], field.unit)}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Bars (Second Row - Metrics) */}
          <div className="progress-grid">
            {progressFields.map((field) => (
              <div key={field.key} className="progress-card">
                <h3 className="progress-label">{field.label}</h3>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        Number(data[0][field.key] || 0)
                      )}%`,
                      backgroundColor: field.color,
                    }}
                  />
                </div>
                <p className="progress-percent" style={{ color: field.color }}>
                  {Number(data[0][field.key]).toFixed(2) || "0.00"}%
                </p>
              </div>
            ))}
          </div>

          {/* Charts (Third Row) */}
          <div className="charts-grid">
            {/* Bar Chart: District Performance */}
            <div className="chart-panel" style={{ height: "500px" }}>
              {" "}
              {/* Ensure minimum height is 500px */}
              <h3 className="chart-title">
                District Performance: Wages vs. Households Worked
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={data
                    .map((record) => ({
                      district: record.district_name,
                      Wages: Number(record.Wages),
                      Households: Number(record.Total_Households_Worked),
                    }))
                    .slice(0, 10)}
                  // IMPORTANT FIX: Add bottom margin to prevent X-Axis overflow
                  margin={{ top: 10, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e0e0e0"
                    vertical={false}
                  />

                  {/* X-AXIS FIXES: Increased height and disabled interval */}
                  <XAxis
                    dataKey="district"
                    angle={-45}
                    textAnchor="end"
                    height={100} // Increased height from 80 to 100
                    interval={0} // IMPORTANT: Show ALL labels, let rotation handle overlap
                    stroke="#666"
                    style={{ fontSize: "12px", fill: "#333" }}
                  />

                  {/* Y-AXES */}
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke={BAR_COLORS.Wages}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke={BAR_COLORS.Households}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  {/* LEGEND FIX: Place on top to avoid overlapping X-Axis area */}
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ paddingTop: "20px", paddingBottom: "20px" }}
                    height={40} // Give the legend a fixed space
                  />

                  {/* BARS: Applied new distinct colors */}
                  <Bar
                    yAxisId="left"
                    dataKey="Wages"
                    fill={BAR_COLORS.Wages}
                    name="Wages (Cr)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="Households"
                    fill={BAR_COLORS.Households}
                    name="Households Worked"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart: Wages Distribution */}
            <div className="chart-panel" style={{ height: "500px" }}>
              <h3 className="chart-title">Top 5 District Wage Share (in Cr)</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={getPieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    labelLine={false}
                    // Only show labels for non-zero or meaningful slices
                    label={({ name, percent }) => {
                      const percentage = (percent * 100).toFixed(0);
                      return percentage > 1 ? `${name}: ${percentage}%` : null;
                    }}
                  >
                    {getPieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(value, " Cr")} />
                  {/* Adjusted layout for Pie Chart Legend */}
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- Data Table Section --- */}
          <div className="table-section">
            <h2 className="table-title">
              Detailed Data Table ({state} - {year})
            </h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">District</th>
                    <th className="table-head">Households Worked</th>
                    <th className="table-head">Wages</th>
                    <th className="table-head">Women Persondays</th>
                    <th className="table-head">Category B Works %</th>
                    <th className="table-head">Agri Allied %</th>
                    <th className="table-head">NRM Exp %</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 20).map((row, i) => (
                    <tr key={i} className="table-row-body">
                      <td className="table-data">{row.district_name}</td>
                      <td className="table-data">
                        {formatNumber(row.Total_Households_Worked)}
                      </td>
                      <td className="table-data">{formatNumber(row.Wages)}</td>
                      <td className="table-data">
                        {formatNumber(row.Women_Persondays)}
                      </td>
                      <td className="table-data data-blue">
                        {Number(row.percent_of_Category_B_Works).toFixed(2)}%
                      </td>
                      <td className="table-data data-green">
                        {Number(
                          row.percent_of_Expenditure_on_Agriculture_Allied_Works
                        ).toFixed(2)}
                        %
                      </td>
                      <td className="table-data data-amber">
                        {Number(row.percent_of_NRM_Expenditure).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 20 && (
                <div className="table-footer">Showing top 20 records.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
