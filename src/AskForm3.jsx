import { useEffect, useState } from "react";
import './askform3.css'
function tryParseJSON(text) {
  try {
    const obj = JSON.parse(text);
    if (obj !== null && (Array.isArray(obj) || typeof obj === "object")) {
      return obj;
    }
  } catch (_) {}
  return null;
}

export default function AskForm() {
  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [notes, setNotes] = useState("");
  const [notesReply, setNotesReply] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("ask.u");
    const k = localStorage.getItem("ask.k");
    if (u) setUsername(u);
    if (k) setApiKey(k);
  }, []);
  useEffect(() => { localStorage.setItem("ask.u", username || ""); }, [username]);
  useEffect(() => { localStorage.setItem("ask.k", apiKey || ""); }, [apiKey]);

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, apiKey, question }),
      });
      const text = await res.text();
      let normalized = text;
      try {
        const data = JSON.parse(text);
        normalized = (typeof data === "object" && !Array.isArray(data) && (data?.answer || data?.result))
          ? String(data.answer || data.result)
          : JSON.stringify(data, null, 2);
      } catch (_) {}
      setAnswer(normalized);
    } catch (err) {
      setAnswer("Error: " + err.message);
    } finally { setLoading(false); }
  };

  const handleUploadNotes = async (e) => {
    e.preventDefault();
    setNotesLoading(true);
    setNotesReply("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/upload-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, apiKey, notes }),
      });
      const text = await res.text();
      let normalized = text;
      try {
        const data = JSON.parse(text);
        normalized = (typeof data === "object" && !Array.isArray(data) && (data?.result || data?.answer))
          ? String(data.result || data.answer)
          : JSON.stringify(data, null, 2);
      } catch (_) {}
      setNotesReply(normalized);
    } catch (err) {
      setNotesReply("Error: " + err.message);
    } finally { setNotesLoading(false); }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Notes Ask</h1>
        <p className="subtitle">Ask questions or upload notes. Sleek, clean, and easy to read.</p>
      </header>

      <section className="panel">
        <h2>Ask a Question</h2>
        <form onSubmit={handleAsk}>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            API Key
            <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
          </label>
          <label>
            Question
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} required rows={4} />
          </label>
          <button type="submit" disabled={loading}>{loading ? "Sending..." : "Ask"}</button>
        </form>
        {answer && (
          <div className="response">
            <h3>Response</h3>
            <pre>{answer}</pre>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Upload Notes</h2>
        <form onSubmit={handleUploadNotes}>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            API Key
            <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
          </label>
          <label>
            Notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} required rows={6} />
          </label>
          <button type="submit" disabled={notesLoading}>{notesLoading ? "Uploading..." : "Upload Notes"}</button>
        </form>
        {notesReply && (
          <div className="response">
            <h3>Notes Result</h3>
            <pre>{notesReply}</pre>
          </div>
        )}
      </section>
    </div>
  );
}



