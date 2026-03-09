import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";
import { useAuth } from "./contexts/AuthContext";

export default function Layout() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to='/signin' replace />;
  }

  return (
    /* Page background matches InputPage .ag-page cream + radial gradients */
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f4ec",
        backgroundImage: `
        radial-gradient(ellipse 70% 55% at 8% 0%,   rgba(90,158,86,0.08) 0%, transparent 55%),
        radial-gradient(ellipse 55% 45% at 92% 100%, rgba(122,92,58,0.06) 0%, transparent 55%)
      `,
        position: "relative",
      }}
    >
      {/* Subtle dot grid — mirrors InputPage .ag-page::before */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(90,158,86,0.08) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <Header />

      <div
        style={{
          display: "flex",
          paddingTop: 60,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Sidebar />
        <main
          style={{
            flex: 1,
            marginLeft: 230,
            padding: "20px 24px",
            minHeight: "calc(100vh - 60px)",
            boxSizing: "border-box",
            maxWidth: "1400px",
            marginRight: "auto",
          }}
        >
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}
