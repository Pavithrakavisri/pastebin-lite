"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [expiresInMinutes, setExpiresInMinutes] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");

  const createPaste = async () => {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        expiresInMinutes,
        maxViews,
      }),
    });

    const data = await res.json();
    if (data.url) setResultUrl(data.url);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Pastebin Lite</h1>

      <textarea
        style={styles.textarea}
        placeholder="Paste your text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div style={styles.row}>
        <input
          style={styles.input}
          type="number"
          placeholder="Expire (minutes)"
          value={expiresInMinutes}
          onChange={(e) => setExpiresInMinutes(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Max views"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
        />
      </div>

      <button style={styles.button} onClick={createPaste}>
        Create Paste
      </button>

      {resultUrl && (
        <div style={styles.result}>
          <p>Paste URL:</p>
          <input style={styles.resultInput} value={resultUrl} readOnly />
        </div>
      )}
    </main>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    padding: 20,
    fontFamily: "sans-serif",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: 20,
  },
  textarea: {
    width: "100%",
    height: 200,
    padding: 10,
    fontSize: 14,
  },
  row: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 8,
  },
  button: {
    marginTop: 15,
    width: "100%",
    padding: 10,
    fontSize: 16,
    cursor: "pointer",
  },
  result: {
    marginTop: 20,
  },
  resultInput: {
    width: "100%",
    padding: 8,
  },
};