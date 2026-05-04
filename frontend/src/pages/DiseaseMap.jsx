import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ── API base ─────────────────────────────────────────────────────────────── */
const API = "http://127.0.0.1:5000/api/disease-reports";

/* ── Marker colours per disease type ──────────────────────────────────────── */
const COLORS = {
  "Early Blight": "#f97316",
  "Late Blight": "#ef4444",
  Healthy: "#22c55e",
  Unknown: "#6b7280",
};

const SEVERITY_BADGE = {
  Low: "bg-yellow-100 text-yellow-800",
  Moderate: "bg-orange-100 text-orange-800",
  High: "bg-red-100 text-red-800",
  Critical: "bg-red-200 text-red-900",
  Medium: "bg-orange-100 text-orange-800",
  "Very High": "bg-red-200 text-red-900",
};

/* ── Coloured SVG icon factory ────────────────────────────────────────────── */
function markerIcon(color = "#ef4444") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z"
            fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="6" fill="#fff"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -36],
  });
}

/* default blue for "click to add" */
const BLUE_ICON = markerIcon("#3b82f6");

/* ── Map click handler (child) ────────────────────────────────────────────── */
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

/* ══════════════════════════════════════════════════════════════════════════════
   DiseaseMap page
   ══════════════════════════════════════════════════════════════════════════ */
export default function DiseaseMap() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── New‑report form state ── */
  const [formOpen, setFormOpen] = useState(false);
  const [clickedPos, setClickedPos] = useState(null);
  const [form, setForm] = useState({
    disease: "Early Blight",
    severity: "Moderate",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);

  /* ── Fetch reports ── */
  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch disease reports", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  /* ── Map click → open form ── */
  const handleMapClick = (latlng) => {
    setClickedPos(latlng);
    setFormOpen(true);
  };

  /* ── Submit new report ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: clickedPos.lat,
          lng: clickedPos.lng,
          ...form,
        }),
      });
      if (res.ok) {
        setFormOpen(false);
        setClickedPos(null);
        setForm({
          disease: "Early Blight",
          severity: "Moderate",
          note: "",
          date: new Date().toISOString().slice(0, 10),
        });
        fetchReports();
      }
    } catch (err) {
      console.error("Failed to add report", err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Delete report ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this disease report?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchReports();
    } catch (err) {
      console.error("Failed to delete report", err);
    }
  };

  /* ── Default centre: Sri Lanka ── */
  const defaultCenter = [7.8731, 80.7718];
  const defaultZoom = 8;

  /* ────────────────────────────────── Render ──────────────────────────────── */
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🗺️ Disease Map
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Click anywhere on the map to report a diseased area. Existing
            reports appear as coloured pins.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {Object.entries(COLORS).map(([name, color]) => (
            <span key={name} className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full border"
                style={{ backgroundColor: color }}
              />
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── Map + Panel ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ── Leaflet map ── */}
        <div className="flex-1">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            className="w-full h-full z-0"
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ClickHandler onMapClick={handleMapClick} />

            {/* ── clicked pin (blue, before saving) ── */}
            {clickedPos && (
              <Marker position={[clickedPos.lat, clickedPos.lng]} icon={BLUE_ICON}>
                <Popup>New report location</Popup>
              </Marker>
            )}

            {/* ── Saved report markers ── */}
            {reports.map((r) => (
              <Marker
                key={r.id}
                position={[r.lat, r.lng]}
                icon={markerIcon(COLORS[r.disease] || COLORS.Unknown)}
              >
                <Popup>
                  <div className="text-sm min-w-[180px]">
                    <p className="font-bold text-base mb-1">{r.disease}</p>
                    <p>
                      <span className="font-medium">Severity:</span>{" "}
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          SEVERITY_BADGE[r.severity] || ""
                        }`}
                      >
                        {r.severity}
                      </span>
                    </p>
                    {r.note && (
                      <p className="mt-1 text-gray-600 italic">"{r.note}"</p>
                    )}
                    <p className="text-gray-400 mt-1 text-xs">
                      📅 {r.date}
                    </p>
                    <p className="text-gray-400 text-xs">
                      📍 {r.lat.toFixed(5)}, {r.lng.toFixed(5)}
                    </p>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* ── Side panel: add form / report list ── */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          {/* Add-report form */}
          {formOpen && clickedPos ? (
            <form onSubmit={handleSubmit} className="p-4 border-b space-y-3">
              <h3 className="font-semibold text-gray-800 text-lg">
                📌 Add Disease Report
              </h3>
              <p className="text-xs text-gray-500">
                Location: {clickedPos.lat.toFixed(5)},{" "}
                {clickedPos.lng.toFixed(5)}
              </p>

              {/* Disease type */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Disease
                </span>
                <select
                  value={form.disease}
                  onChange={(e) =>
                    setForm({ ...form, disease: e.target.value })
                  }
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option>Early Blight</option>
                  <option>Late Blight</option>
                  <option>Healthy</option>
                  <option>Unknown</option>
                </select>
              </label>

              {/* Severity */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Severity
                </span>
                <select
                  value={form.severity}
                  onChange={(e) =>
                    setForm({ ...form, severity: e.target.value })
                  }
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </label>

              {/* Date */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </label>

              {/* Note */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Note (optional)
                </span>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={2}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  placeholder="E.g. Severe infection on 2 acres..."
                />
              </label>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-md disabled:opacity-50"
                >
                  {submitting ? "Saving…" : "💾 Save Report"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setClickedPos(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 border-b bg-green-50">
              <p className="text-sm text-green-800 font-medium">
                👆 Click on the map to add a new disease report
              </p>
            </div>
          )}

          {/* Report list */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              📋 Reports ({reports.length})
            </h3>
            {loading ? (
              <p className="text-sm text-gray-400">Loading…</p>
            ) : reports.length === 0 ? (
              <p className="text-sm text-gray-400">
                No reports yet. Click the map to add one.
              </p>
            ) : (
              <div className="space-y-2">
                {[...reports].reverse().map((r) => (
                  <div
                    key={r.id}
                    className="border rounded-lg p-3 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS[r.disease] || COLORS.Unknown,
                          }}
                        />
                        <span className="font-medium text-sm">
                          {r.disease}
                        </span>
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          SEVERITY_BADGE[r.severity] || ""
                        }`}
                      >
                        {r.severity}
                      </span>
                    </div>
                    {r.note && (
                      <p className="text-xs text-gray-500 mt-1 italic truncate">
                        {r.note}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-gray-400">
                        📅 {r.date} &nbsp;·&nbsp; 📍{r.lat.toFixed(4)},{" "}
                        {r.lng.toFixed(4)}
                      </span>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-[10px] text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
