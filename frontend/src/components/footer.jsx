import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 40,
        padding: "16px 0 8px",
        borderTop: "1px solid #e3d9c2",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {/* Left — mirrors InputPage .ag-footer */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            color: "#6b8069",
            opacity: 0.55,
            letterSpacing: ".04em",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          🌍 Sri Lanka Agri Data
        </span>
        <span
          style={{
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#6b8069",
            opacity: 0.3,
            display: "inline-block",
          }}
        />
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            color: "#6b8069",
            opacity: 0.55,
            letterSpacing: ".04em",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          🔒 Secure Processing
        </span>
        <span
          style={{
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#6b8069",
            opacity: 0.3,
            display: "inline-block",
          }}
        />
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            color: "#6b8069",
            opacity: 0.55,
            letterSpacing: ".04em",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          📊 ML-Powered Insights
        </span>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "'Lora',serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#3d7a3a",
          }}
        >
          SmartPotato
        </span>
        <span style={{ fontSize: 11, color: "#e3d9c2" }}>·</span>
        <span
          style={{
            fontSize: 11,
            fontFamily: "'Inter',sans-serif",
            color: "#6b8069",
            opacity: 0.55,
          }}
        >
          © {new Date().getFullYear()} Smart Potato Farming System
        </span>
       
      </div>
    </footer>
  );
}
