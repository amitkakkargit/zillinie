import { useEffect, useState } from "react";
import { getStaff } from "../services/zillinieApi";

function Staff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getStaff()
      .then(setStaff)
      .catch(() => setError("Could not load staff."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page staff-page">
      <h1>Staff</h1>
      {loading && <p>Loading staff...</p>}
      {error && <p className="error-message">{error}</p>}
      {staff.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(staff[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((member, index) => (
              <tr key={index}>
                {Object.values(member).map((value, valueIndex) => (
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

export default Staff;
