import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getStaff, saveStaff } from "../services/zillinieApi";

function Staff() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    staffName: "",
    profession: "",
    mobile: "",
    branch: "",
  });

  const loadStaff = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getStaff();
      setStaff(data ?? []);
    } catch {
      setError("Could not load staff.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStaff();
  }, []);

  const submitStaff = async () => {
    if (!form.staffName || !form.profession || !form.mobile) {
      setError("Name, profession, and mobile are required.");
      return;
    }
    setError("");
    try {
      await saveStaff({
        StaffName: form.staffName,
        Profession: form.profession,
        Mobile: form.mobile,
        Branch: form.branch,
        CreatedBy: user?.username ?? "system",
        Flag: "A",
      });
      setSuccess("Staff saved successfully.");
      setForm({ staffName: "", profession: "", mobile: "", branch: "" });
      void loadStaff();
    } catch {
      setError("Failed to save staff.");
    }
  };

  return (
    <div className="page staff-page">
      <h1>Staff</h1>
      <section className="staff-form-section">
        <h2>Add staff member</h2>
        <div className="field-group">
          <label>Name</label>
          <input
            value={form.staffName}
            onChange={(e) =>
              setForm((current) => ({ ...current, staffName: e.target.value }))
            }
          />
        </div>
        <div className="field-group">
          <label>Profession</label>
          <input
            value={form.profession}
            onChange={(e) =>
              setForm((current) => ({ ...current, profession: e.target.value }))
            }
          />
        </div>
        <div className="field-group">
          <label>Mobile</label>
          <input
            value={form.mobile}
            onChange={(e) =>
              setForm((current) => ({ ...current, mobile: e.target.value }))
            }
          />
        </div>
        <div className="field-group">
          <label>Branch</label>
          <input
            value={form.branch}
            onChange={(e) =>
              setForm((current) => ({ ...current, branch: e.target.value }))
            }
          />
        </div>
        <button type="button" onClick={submitStaff}>
          Save staff
        </button>
        {success && <p className="success-message">{success}</p>}
      </section>

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
