import { useState } from "react";
import { getStatus } from "../services/zillinieApi";

function Status() {
  const [orderNumber, setOrderNumber] = useState("");
  const [statusRows, setStatusRows] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const loadStatus = async () => {
    setMessage("");
    setStatusRows([]);
    try {
      const data = await getStatus(orderNumber);
      setStatusRows(data);
    } catch {
      setMessage("Could not load status details.");
    }
  };

  return (
    <div className="page status-page">
      <h1>Status</h1>
      <div className="search-row">
        <input
          value={orderNumber}
          placeholder="Order number"
          onChange={(e) => setOrderNumber(e.target.value)}
        />
        <button onClick={loadStatus}>Load status</button>
      </div>

      {message && <p className="error-message">{message}</p>}
      {statusRows.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(statusRows[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {statusRows.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, valueIndex) => (
                  <td key={valueIndex}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Status;
