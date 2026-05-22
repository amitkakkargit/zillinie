import { useEffect, useState } from "react";
import { getLookupData } from "../services/zillinieApi";

function Lookups() {
  const [lookups, setLookups] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getLookupData()
      .then((data) => setLookups(data))
      .catch(() => setError("Could not load lookup lists."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page lookups-page">
      <h1>Lookup Data</h1>
      {loading && <p>Loading lookup lists...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="lookup-grid">
          {Object.entries(lookups).map(([section, items]) => (
            <section key={section} className="lookup-section">
              <h2>{section}</h2>
              {items.length === 0 ? (
                <p>No items found.</p>
              ) : (
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>
                      {typeof item === "object"
                        ? JSON.stringify(item)
                        : String(item)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default Lookups;
