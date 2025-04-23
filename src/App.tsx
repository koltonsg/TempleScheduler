import { useState } from "react";
import "./templeform.css";

function TempleForm() {
  const [temple, setTemple] = useState("");
  const [ordinance, setOrdinance] = useState("");
  const [date, setDate] = useState("");
  const [males, setMales] = useState("");
  const [females, setFemales] = useState("");
  const [baptizers, setBaptizers] = useState("");
  const [confirmers, setConfirmers] = useState("");
  const [helpers, setHelpers] = useState("");
  const [sessions, setSessions] = useState([]); // Stores available sessions
  const [loading, setLoading] = useState(false); // Tracks loading state

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSessions([]); // Clear previous sessions

    try {
      const response = await fetch("http://127.0.0.1:5000/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ordinance,
          date,
          temple,
          males: males || null,
          females: females || null,
          baptizers: baptizers || null,
          confirmers: confirmers || null,
          helpers: helpers || null,
        }),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (data.available_sessions) {
        setSessions(data.available_sessions);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <>
      <strong>
        <h1 className="page-title">Temple Scheduler</h1>
      </strong>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="temple">What temple do you want to go to?:</label>
          <input
            required
            type="text"
            id="temple"
            placeholder="Enter temple name..."
            value={temple}
            onChange={(e) => setTemple(e.target.value)}
          />

          <label htmlFor="ordinance">What Ordinance do you want to do?:</label>
          <select
            required
            id="ordinance"
            value={ordinance}
            onChange={(e) => setOrdinance(e.target.value)}
          >
            <option value="" disabled hidden>
              Choose an ordinance
            </option>
            <option value="Endowment">Endowment</option>
            <option value="Sealing">Sealing</option>
            <option value="Initiatory">Initiatory</option>
            <option value="Baptism">Baptism</option>
          </select>

          <label htmlFor="date">What day do you want to go?:</label>
          <input
            required
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {ordinance === "Baptism" && (
            <>
              <label htmlFor="males">How many males to be baptized?:</label>
              <input
                type="number"
                id="males"
                value={males}
                onChange={(e) => setMales(e.target.value)}
                min="0"
              />

              <label htmlFor="females">How many females to be baptized?:</label>
              <input
                type="number"
                id="females"
                value={females}
                onChange={(e) => setFemales(e.target.value)}
                min="0"
              />

              <label htmlFor="baptizers">How many baptizers?:</label>
              <input
                type="number"
                id="baptizers"
                value={baptizers}
                onChange={(e) => setBaptizers(e.target.value)}
                min="0"
              />

              <label htmlFor="confirmers">How many confirmers?:</label>
              <input
                type="number"
                id="confirmers"
                value={confirmers}
                onChange={(e) => setConfirmers(e.target.value)}
                min="0"
              />

              <label htmlFor="helpers">How many helpers?:</label>
              <input
                type="number"
                id="helpers"
                value={helpers}
                onChange={(e) => setHelpers(e.target.value)}
                min="0"
              />
            </>
          )}

          <button type="submit">Search for Appointments</button>
        </form>

        <div className="appointments-section">
          <h2 className="available-sessions">Available Sessions:</h2>
          {loading ? (
            <p className="loading-message">Finding appointments</p>
          ) : sessions.length > 0 ? (
            <ul>
              {sessions.map((session, index) => (
                <li key={index}>{session}</li>
              ))}
            </ul>
          ) : (
            <p>Appointments will appear here</p>
          )}
        </div>
      </div>
    </>
  );
}

export default TempleForm;
