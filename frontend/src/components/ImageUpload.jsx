import React, { useState, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/predict";

function humanFileSize(size) {
  if (!size && size !== 0) return "";
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(1)} ${["B", "KB", "MB", "GB"][i]}`;
}

export default function ImageUpload({ onResult }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;
    setError(null);
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
    if (onResult) onResult(null);
  }

  function clearAll() {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    if (onResult) onResult(null);
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post(API_URL, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 45000,
      });
      if (onResult) onResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Upload failed");
      if (onResult) onResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload image"
          className="block"
        />

        {preview ? (
          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* Thumbnail */}
            <div style={{ width: 220, height: 220, overflow: "hidden", borderRadius: 12, background: "#f8fafc", flex: "0 0 auto" }}>
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Details + actions */}
            <div className="flex-1">
              <div className="text-sm text-gray-600">
                <div><strong>{file?.name || ""}</strong></div>
                <div className="text-xs">{file ? humanFileSize(file.size) : ""}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="px-4 py-2 rounded-md text-white"
                  style={{ background: "linear-gradient(90deg,#16a34a,#84cc16)" }}
                >
                  {loading ? "Predicting..." : "Predict"}
                </button>

                <button type="button" onClick={clearAll} className="px-4 py-2 rounded-md border">
                  Clear
                </button>

                <a href={preview} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md border text-sm">
                  Open
                </a>
              </div>

              {error && <div style={{ color: "#b00020" }} className="mt-2">{error}</div>}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No image selected</div>
        )}
      </form>
    </div>
  );
}
