import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/zillinieApi";

function Dashboard() {
  const [summary, setSummary] = useState<any[]>([]);
  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getDashboardSummary()
      .then((data) => {
        setSummary(data.summary ?? []);
        setDetails(data.details ?? []);
      })
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page dashboard-page">
      <h1>Dashboard</h1>
      {loading && <p>Loading dashboard...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <>
          <section className="dashboard-summary">
            <h2>Summary</h2>
            {summary.length > 0 ? (
              <div className="summary-grid">
                {summary.map((item, index) => (
                  <div key={index} className="summary-card">
                    {Object.entries(item).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p>No dashboard summary available.</p>
            )}
          </section>

          <section className="dashboard-details">
            <h2>Details</h2>
            {details.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    {Object.keys(details[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {details.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex}>{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No details available.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
