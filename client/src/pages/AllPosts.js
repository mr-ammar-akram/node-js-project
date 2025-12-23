import { useEffect, useState, useCallback } from "react";
import "./AllPosts.css";

export default function WhatsAppContacts() {
    const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useCallback fixes eslint exhaustive-deps warning
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/whatsapp-contacts");

      if (!res.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const data = await res.json();

      // adjust this based on actual API response structure
      setContacts(data.contacts || data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  if (loading) return <p>Loading contacts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;


  return (
    <div className="wa-container">
      <header className="wa-header">
        <h1>WhatsApp Contacts</h1>
        <button onClick={fetchContacts}>↻ Refresh</button>
      </header>

      {loading && <div className="wa-loading">Loading contacts…</div>}

      {error && <div className="wa-error">{error}</div>}

      {!loading && !error && contacts.length === 0 && (
        <div className="wa-empty">No contacts found</div>
      )}

      <div className="wa-grid">
        {contacts.map((c, i) => (
          <div className="wa-card" key={i}>
            <div className="avatar">
              {c.name ? c.name[0] : "?"}
            </div>

            <div className="info">
              <h3>{c.name || "Unknown Contact"}</h3>
              <p>{c.phone || "No phone number"}</p>
            </div>

            <button className="chat-btn">💬</button>
          </div>
        ))}
      </div>
    </div>
  );
}
