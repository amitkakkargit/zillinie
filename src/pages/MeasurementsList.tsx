import { useEffect, useState } from "react";
import api from "../services/api";

function MeasurementsList() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/measurements/list");
        setRows(res.data ?? []);
      } catch (e) {
        console.error(e);
        setRows([]);
      }
    })();
  }, []);

  return (
    <div className="page measurements-list">
      <h1>Measurements</h1>
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
