"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [populationData, setPopulationData] = useState<any[]>([]);
  const [unemploymentData, setUnemploymentData] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);

  useEffect(() => {
    fetchPopulation();
    fetchUnemployment();
  }, []);

  // -----------------------
  // POPULATION DATA
  // -----------------------
  const fetchPopulation = async () => {
    try {
      const res = await axios.get(
        "https://api.worldbank.org/v2/country/NGA/indicator/SP.POP.TOTL?format=json"
      );

      if (!res.data?.[1]) return;

      const formatted = res.data[1]
        .filter((item: any) => item.value !== null)
        .slice(0, 10)
        .map((item: any) => ({
          year: item.date,
          value: item.value,
        }))
        .reverse();

      setPopulationData(formatted);
      generateRisk(formatted, null);
    } catch (err) {
      console.error("Population API error:", err);
    }
  };

  // -----------------------
  // UNEMPLOYMENT DATA (FIXED)
  // -----------------------
  const fetchUnemployment = async () => {
    try {
      const res = await axios.get(
        "https://api.worldbank.org/v2/country/NGA/indicator/SL.UEM.TOTL.ZS?format=json"
      );

      if (!res.data?.[1]) return;

      const formatted = res.data[1]
        .filter((item: any) => item.value !== null)
        .slice(0, 10)
        .map((item: any) => ({
          year: item.date,
          value: item.value,
        }))
        .reverse();

      setUnemploymentData(formatted);
      generateRisk(null, formatted);
    } catch (err) {
      console.error("Unemployment API error:", err);
    }
  };

  // -----------------------
  // RISK MODEL
  // -----------------------
  const generateRisk = (pop: any, unemp: any) => {
    const basePop = pop || populationData;
    const baseUnemp = unemp || unemploymentData;

    if (!basePop.length) return;

    const risk = basePop.map((item: any, i: number) => {
      const unemployment = baseUnemp?.[i]?.value || 10;

      const score =
        (item.value / 250000000) * 60 + // population pressure
        unemployment * 2; // unemployment risk factor

      return {
        year: item.year,
        score: Math.min(100, score),
      };
    });

    setRiskData(risk);
  };

  return (
    <main
      style={{
        padding: "40px",
        background: "#0b1220",
        color: "#ffffff",
        fontFamily: "Arial",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 28 }}>
          Urban Risk Intelligence & Policy Dashboard – Nigeria
        </h1>
        <p style={{ color: "#aab3c5" }}>
          Data-driven analysis for urban vulnerability, unemployment stress, and
          risk modeling
        </p>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {/* Population */}
        <div style={cardStyle}>
          <h3>Population Pressure</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={populationData}>
              <XAxis dataKey="year" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Unemployment */}
        <div style={cardStyle}>
          <h3>Unemployment Stress Index</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={unemploymentData}>
              <XAxis dataKey="year" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk */}
        <div style={cardStyle}>
          <h3>Composite Urban Risk Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={riskData}>
              <XAxis dataKey="year" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* INSIGHTS */}
      <div style={insightBox}>
        <h2>Policy Intelligence Summary</h2>

        <ul>
          <li>
            Rising population increases infrastructure pressure and urban exposure
          </li>
          <li>
            Unemployment contributes to socio-economic vulnerability and instability
          </li>
          <li>
            Combined indicators show increasing urban risk patterns
          </li>
        </ul>

        <h3>Recommended Interventions</h3>
        <ul>
          <li>Deploy predictive crime and risk mapping systems</li>
          <li>Invest in urban infrastructure in high-growth regions</li>
          <li>Enhance real-time data collection for early warning systems</li>
        </ul>
      </div>

      {/* AI INSIGHT */}
      <div style={insightBox}>
        <h2>AI Policy Insight Engine</h2>
        <p>
          Model analysis indicates a correlation between population expansion and
          unemployment-driven vulnerability, increasing the likelihood of urban
          risk escalation.
        </p>
        <p>
          Strategic focus on data-driven planning and monitoring systems is
          recommended to mitigate future risk exposure.
        </p>
      </div>
    </main>
  );
}

// STYLES
const cardStyle = {
  background: "#121a2b",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 0 20px rgba(0,0,0,0.3)",
};

const insightBox = {
  marginTop: 30,
  background: "#121a2b",
  padding: "20px",
  borderRadius: "12px",
};

const tooltipStyle = {
  backgroundColor: "#1f2a44",
  border: "none",
};