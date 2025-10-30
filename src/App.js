import React, { useState } from "react";
import logo from "./logo.svg"; // <-- make sure logo.svg is in src/

const GEMINI_API_KEY = "AIzaSyBxcAXMppl4WKqdpm7D0-JDtMAGwlC2u8c";
const GEMINI_MODEL = "models/gemini-2.5-pro";
const difficultyLabels = ["Basic", "Intermediate", "Advanced"];

function App() {
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("English");
  const [difficulty, setDifficulty] = useState(0);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const copyResult = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        alert("Result copied to clipboard!");
      } catch (e) {
        alert("Failed to copy!");
      }
    }
  };

  const simplify = async () => {
    setLoading(true);
    setResult("");
    setError("");
    try {
      const prompt = `Simplify the following text for a student. Translate to ${lang}. Use ${difficultyLabels[difficulty]} difficulty level. Keep it clear and concise:\n\n${input}`;
      const url = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        setResult(data.candidates[0].content.parts[0].text);
      } else if (data.error) {
        if (data.error.message && data.error.message.includes("overloaded")) {
          setError("Sorry! The AI model is currently busy. Please try again in a few moments.");
        } else {
          setError("API Error: " + JSON.stringify(data.error));
        }
      } else {
        setError("No answer from Gemini API.");
      }
    } catch (e) {
      setError("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24, boxShadow: "0 0 14px #ddd", borderRadius: 12 }}>
      {/* Header bar with logo and color */}
      <div style={{
        background: "#1a75ff",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderRadius: 8,
        marginBottom: 28,
        padding: "14px 18px"
      }}>
        <img src={logo} alt="ClaritAI Logo" style={{ width: 44, height: 44, marginRight: 10 }} />
        <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>ClaritAI Web</span>
      </div>
      <textarea
        rows={4}
        style={{ width: "100%", fontSize: 16, resize: "vertical" }}
        placeholder="e.g. The process of photosynthesis enables plants to turn sunlight, water, and carbon dioxide into food."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div style={{ margin: "12px 0" }}>
        <label>
          Language:
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ marginLeft: 8 }}>
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Chinese</option>
            <option>Japanese</option>
            <option>Russian</option>
            <option>Arabic</option>
            <option>Portuguese</option>
            <option>Italian</option>
            <option>Korean</option>
            <option>Bengali</option>
            <option>Urdu</option>
            <option>Tamil</option>
            <option>Gujarati</option>
            <option>Malayalam</option>
          </select>
        </label>
      </div>
      <div style={{ margin: "16px 0" }}>
        <label>
          Difficulty Level:&nbsp;
          <input
            type="range"
            min={0}
            max={2}
            value={difficulty}
            onChange={e => setDifficulty(Number(e.target.value))}
            style={{ verticalAlign: "middle" }}
          />
          <span style={{ marginLeft: 10, fontWeight: "bold" }}>
            {difficultyLabels[difficulty]}
          </span>
        </label>
      </div>
      <button onClick={simplify} disabled={loading} style={{ width: "100%", padding: 8, fontSize: 16 }}>
        {loading ? "Simplifying..." : "Simplify"}
      </button>
      {(result || error) && (
        <div style={{ marginTop: 20 }}>
          <b>Result:</b>
          <button onClick={copyResult} style={{ float: "right", marginBottom: 8, padding: "4px 12px" }}>
            Copy
          </button>
          <div
            style={{
              background: "#f5fff5",
              padding: 12,
              borderRadius: 8,
              minHeight: 60,
              fontSize: 16,
              color: error ? "crimson" : "#303030"
            }}
          >
            {error ? error : result}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
