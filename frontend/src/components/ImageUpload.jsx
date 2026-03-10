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
    <div className="image-upload-wrap">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-[#4caf76]/50 bg-[#e8f8ef]/50 text-[#1a3d28] font-medium text-sm cursor-pointer hover:bg-[#e8f8ef] transition-colors">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            aria-label="Upload image"
            className="sr-only"
          />
          <span>📁</span> Choose photo
        </label>

        {preview ? (
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="w-[220px] h-[220px] overflow-hidden rounded-xl bg-[#f4fdf7] border border-[#c8f0d8] flex-shrink-0 shadow-sm">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover block"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-[#1a3d28]">
                <div className="font-medium truncate">{file?.name || ""}</div>
                <div className="text-xs text-[#5a8a6e]">{file ? humanFileSize(file.size) : ""}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-md hover:opacity-90 disabled:opacity-60 transition-opacity bg-gradient-to-r from-[#2a5c3f] to-[#4caf76]"
                >
                  {loading ? "Analyzing…" : "Analyze seed"}
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-4 py-2.5 rounded-xl border border-[#2a5c3f]/30 text-[#1a3d28] text-sm font-medium hover:bg-[#e8f8ef] transition-colors"
                >
                  Clear
                </button>
                <a
                  href={preview}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-[#2a5c3f]/30 text-[#1a3d28] text-sm font-medium hover:bg-[#e8f8ef] transition-colors inline-block"
                >
                  Open
                </a>
              </div>
              {error && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-[#5a8a6e]">Choose an image above to get started.</div>
        )}
      </form>
    </div>
  );
}
