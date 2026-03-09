import React, { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LeafIcon = () => (
  <svg
    width='18'
    height='18'
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
);

const BellIcon = () => (
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
    <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
    <path d='M13.73 21a2 2 0 0 1-3.46 0' />
  </svg>
);

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDrop, setShowDrop] = useState(false);
  const [logoutHov, setLogoutHov] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  const initials = currentUser?.email
    ? currentUser.email.slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Inter:wght@400;500;600&display=swap');
      `}</style>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "rgba(248,244,236,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e3d9c2",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 100,
          boxShadow: "0 1px 20px rgba(30,45,30,0.07)",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => navigate("/app")}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(140deg,#2d5e2a 0%,#5a9e56 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 3px 10px rgba(61,122,58,.28)",
            }}
          >
            <LeafIcon />
          </div>
          <div>
            <span
              style={{
                fontFamily: "'Lora',serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#1e2d1e",
                letterSpacing: "-.01em",
              }}
            >
              SmartPotato
            </span>
            <span
              style={{
                marginLeft: 7,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "#5a9e56",
                fontFamily: "'Inter',sans-serif",
              }}
            >
              Sri Lanka
            </span>
          </div>
        </div>

        {/* Status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#eef4ed",
            border: "1px solid rgba(61,122,58,.2)",
            borderRadius: 20,
            padding: "5px 14px",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 0 2px rgba(74,222,128,.25)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#3d7a3a",
              fontFamily: "'Inter',sans-serif",
              fontWeight: 500,
            }}
          >
            System online · ML active
          </span>
        </div>

        {/* Right actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "relative",
          }}
        >
          <button
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1px solid #e3d9c2",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b8069",
            }}
          >
            <BellIcon />
          </button>
          <div style={{ width: 1, height: 22, background: "#e3d9c2" }} />

          {/* User chip */}
          <div
            onClick={() => setShowDrop((d) => !d)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "5px 12px 5px 5px",
              borderRadius: 10,
              border: "1px solid #e3d9c2",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "linear-gradient(135deg,#3d7a3a,#5a9e56)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {initials}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1e2d1e",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {currentUser?.email || "User"}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "#6b8069",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                Farmer Account
              </span>
            </div>
            <svg
              width='12'
              height='12'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#6b8069'
              strokeWidth='2'
            >
              <polyline points='6 9 12 15 18 9' />
            </svg>
          </div>

          {/* Dropdown */}
          {showDrop && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: 230,
                background: "#fff",
                border: "1px solid #e3d9c2",
                borderRadius: 14,
                boxShadow: "0 20px 40px rgba(30,45,30,0.14)",
                overflow: "hidden",
                zIndex: 200,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 16px",
                  background: "#f8f4ec",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: "linear-gradient(135deg,#3d7a3a,#5a9e56)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Inter',sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1e2d1e",
                      fontFamily: "'Inter',sans-serif",
                    }}
                  >
                    {currentUser?.email}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#6b8069",
                      fontFamily: "'Inter',sans-serif",
                    }}
                  >
                    Farmer Account
                  </div>
                </div>
              </div>
              <div style={{ height: 1, background: "#f2ead8" }} />
              {[
                {
                  label: "📊  Dashboard",
                  action: () => {
                    setShowDrop(false);
                    navigate("/app");
                  },
                },
                { label: "⚙️  Settings", action: () => setShowDrop(false) },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: 13,
                    color: "#3b4f3a",
                    cursor: "pointer",
                    fontFamily: "'Inter',sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </button>
              ))}
              <div style={{ height: 1, background: "#f2ead8" }} />
              <button
                onClick={handleLogout}
                onMouseEnter={() => setLogoutHov(true)}
                onMouseLeave={() => setLogoutHov(false)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 16px",
                  background: logoutHov ? "#fef7f6" : "none",
                  border: "none",
                  textAlign: "left",
                  fontSize: 13,
                  color: "#c0392b",
                  cursor: "pointer",
                  fontFamily: "'Inter',sans-serif",
                  fontWeight: 500,
                  transition: "background .15s",
                }}
              >
                → Sign out
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
