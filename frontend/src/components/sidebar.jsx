import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  {
    to: "/app",
    label: "Dashboard",
    desc: "Overview & metrics",
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect x='3' y='3' width='7' height='7' />
        <rect x='14' y='3' width='7' height='7' />
        <rect x='14' y='14' width='7' height='7' />
        <rect x='3' y='14' width='7' height='7' />
      </svg>
    ),
  },
  {
    to: "/app/seed-readiness",
    label: "Seed Readiness",
    desc: "AI seed analysis",
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z' />
        <path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' />
      </svg>
    ),
  },
  {
    to: "/app/soil-health",
    label: "Soil Health",
    desc: "Soil monitoring",
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 22V12M12 12C12 7 7 4 3 6M12 12C12 7 17 4 21 6M5 20c2-2 4-3 7-3s5 1 7 3' />
      </svg>
    ),
  },
  {
    to: "/app/disease",
    label: "Disease Predictor",
    desc: "Early warning system",
    badge: "AI",
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='12' r='10' />
        <line x1='12' y1='8' x2='12' y2='12' />
        <line x1='12' y1='16' x2='12.01' y2='16' />
      </svg>
    ),
  },
  {
    to: "/app/cost",
    label: "Cost Analysis",
    desc: "Yield & cost forecast",
    badge: "ML",
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <line x1='12' y1='1' x2='12' y2='23' />
        <path d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Inter:wght@400;500;600&display=swap');
        .snav-item:hover { background: #eef4ed !important; border-color: rgba(61,122,58,.2) !important; }
      `}</style>
      <aside
        style={{
          width: 230,
          background: "#fff",
          borderRight: "1px solid #e3d9c2",
          height: "100vh",
          position: "fixed",
          top: 60,
          left: 0,
          padding: "20px 10px 20px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          boxShadow: "2px 0 16px rgba(30,45,30,0.04)",
          zIndex: 50,
        }}
      >
        {/* Section label — mirrors InputPage .ag-hdr-eyebrow */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "#5a9e56",
            padding: "0 10px",
            marginBottom: 10,
            fontFamily: "'Inter',sans-serif",
          }}
        >
          Main Menu
        </div>

        <nav
          style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
        >
          {navItems.map((item) => {
            const isActive =
              item.to === "/app"
                ? location.pathname === "/app"
                : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/app"}
                style={{ textDecoration: "none" }}
              >
                <div
                  className={isActive ? "" : "snav-item"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 10px",
                    borderRadius: 10,
                    border: isActive
                      ? "1px solid rgba(61,122,58,.22)"
                      : "1px solid transparent",
                    background: isActive
                      ? "linear-gradient(135deg,#eef4ed,#dff0dc)"
                      : "transparent",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all .15s ease",
                    boxShadow: isActive
                      ? "0 1px 6px rgba(61,122,58,0.08)"
                      : "none",
                  }}
                >
                  {/* Icon box — mirrors .ag-sec-icon */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: isActive
                        ? "linear-gradient(140deg,#2d5e2a,#5a9e56)"
                        : "#f8f4ec",
                      border: isActive ? "none" : "1px solid #e3d9c2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isActive ? "#fff" : "#6b8069",
                      boxShadow: isActive
                        ? "0 3px 8px rgba(61,122,58,.25)"
                        : "none",
                      transition: "all .15s ease",
                    }}
                  >
                    {item.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Inter',sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: isActive ? "#1e2d1e" : "#3b4f3a",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter',sans-serif",
                        fontSize: 10,
                        color: "#6b8069",
                        marginTop: 1,
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        background: "#fef3c7",
                        color: "#d97706",
                        padding: "2px 6px",
                        borderRadius: 6,
                        fontFamily: "'Inter',sans-serif",
                        letterSpacing: 0.4,
                        flexShrink: 0,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active indicator bar */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: 18,
                        background: "#3d7a3a",
                        borderRadius: 3,
                      }}
                    />
                  )}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom weather widget — organic feel */}
        <div
          style={{
            background: "linear-gradient(135deg,#eef4ed,#dff0dc)",
            border: "1px solid rgba(61,122,58,.2)",
            borderRadius: 12,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 22 }}>🌦️</span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#1e2d1e",
              }}
            >
              Weather Sync
            </div>
            <div
              style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: 10,
                color: "#5a9e56",
              }}
            >
              Nuwara Eliya
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Lora',serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#3d7a3a",
            }}
          >
            28°C
          </div>
        </div>

        <div
          style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: 10,
            color: "#e3d9c2",
            textAlign: "center",
            paddingTop: 4,
          }}
        >
          SmartPotato v2.1 · Sri Lanka
        </div>
      </aside>
    </>
  );
}
