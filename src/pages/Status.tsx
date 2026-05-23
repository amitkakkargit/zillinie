import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getStatus,
  getLookupData,
  getStaff,
  saveStatus,
} from "../services/zillinieApi";

function Status() {
  const { user } = useAuth();
  const [orderNumber, setOrderNumber] = useState("");
  const [statusRows, setStatusRows] = useState<any[]>([]);
  const [statusTypes, setStatusTypes] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [form, setForm] = useState({
    productId: "",
    statusId: "",
    staffId: "",
    remarks: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const lookupData = await getLookupData();
        setStatusTypes(lookupData.statusTypes ?? []);
        const staff = await getStaff();
        setStaffList(staff ?? []);
      } catch {
        setError("Could not load status lookups.");
      }
    })();
  }, []);

  const loadStatus = async () => {
    setError("");
    setMessage("");
    setStatusRows([]);
    try {
      const data = await getStatus(orderNumber);
      setStatusRows(data ?? []);
    } catch {
      setError("Could not load status details.");
    }
  };

  const handleSave = async () => {
    if (!form.productId || !form.statusId || !form.staffId) {
      setError("Product, status, and staff are required.");
      return;
    }

    setError("");
    try {
      await saveStatus({
        ProductId: Number(form.productId),
        StatusId: Number(form.statusId),
        Remarks: form.remarks,
        StaffId: Number(form.staffId),
        CreatedBy: user?.username ?? "system",
      });
      setMessage("Status updated successfully.");
      setForm((current) => ({ ...current, remarks: "" }));
    } catch {
      setError("Failed to save status update.");
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

      <section className="status-form">
        <h2>Update product status</h2>
        <div className="field-group">
          <label>Product ID</label>
          <input
            value={form.productId}
            onChange={(e) =>
              setForm((current) => ({ ...current, productId: e.target.value }))
            }
            placeholder="Enter product ID"
          />
        </div>
        <div className="field-group">
          <label>Status</label>
          <select
            value={form.statusId}
            onChange={(e) =>
              setForm((current) => ({ ...current, statusId: e.target.value }))
            }
          >
            <option value="">Select status</option>
            {statusTypes.map((status) => (
              <option
                key={status.StatusId ?? status.Id ?? status.id}
                value={status.StatusId ?? status.Id ?? status.id}
              >
                {status.StatusName ?? status.Name ?? status.Status}
              </option>
            ))}
          </select>
        </div>
        <div className="field-group">
          <label>Staff</label>
          <select
            value={form.staffId}
            onChange={(e) =>
              setForm((current) => ({ ...current, staffId: e.target.value }))
            }
          >
            <option value="">Select staff</option>
            {staffList.map((staff) => (
              <option key={staff.StaffId ?? staff.Id} value={staff.StaffId}>
                {staff.TailorName ?? staff.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="field-group full-width">
          <label>Remarks</label>
          <textarea
            value={form.remarks}
            onChange={(e) =>
              setForm((current) => ({ ...current, remarks: e.target.value }))
            }
          />
        </div>
        <button onClick={handleSave}>Save status</button>
      </section>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

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
