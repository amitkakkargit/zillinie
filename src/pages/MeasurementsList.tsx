import { useEffect, useState } from "react";
import { getMeasurementList } from "../services/zillinieApi";

function MeasurementsList() {
  const [rows, setRows] = useState<any[]>([]);

  const loadMeasurements = async () => {
    try {
      const data = await getMeasurementList();
      setRows(data ?? []);
    } catch (e) {
      console.error(e);
      setRows([]);
    }
  };

  useEffect(() => {
    void loadMeasurements();
  }, []);

  return (
    <div className="page measurements-list">
      <h1>Measurements</h1>
      <button onClick={loadMeasurements}>Refresh</button>
      {rows.length === 0 ? (
        <p>No measurements found.</p>
      ) : (
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
      )}
    </div>
  );
}

export default MeasurementsList;
