import { useState } from "react";
import { getMeasurementDetails } from "../services/zillinieApi";

function MeasurementDetails() {
  const [orderNumber, setOrderNumber] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setRows([]);
    if (!orderNumber.trim()) {
      setError("Enter order number");
      return;
    }
    try {
      const data = await getMeasurementDetails(orderNumber.trim());
      setRows(data ?? []);
    } catch (e) {
      console.error(e);
      setError("Failed to load measurement details");
    }
  };

  return (
    <div className="page measurement-details">
      <h1>Measurement Details</h1>
      <div className="field-group">
        <label>Order number</label>
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
        />
        <button onClick={load}>Load</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {rows.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(rows[0]).map((k) => (
                <th key={k}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {Object.keys(rows[0]).map((k) => (
                  <td key={k}>{String(r[k] ?? "-")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No measurement details.</p>
      )}
    </div>
  );
}

export default MeasurementDetails;
