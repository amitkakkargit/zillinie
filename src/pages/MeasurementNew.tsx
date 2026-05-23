import { useEffect, useState } from "react";
import { getLookupData, saveMeasurement } from "../services/zillinieApi";

function MeasurementNew() {
  const [lookups, setLookups] = useState<any>({});
  const [data, setData] = useState<any>({});

  useEffect(() => {
    (async () => {
      const l = await getLookupData();
      setLookups(l ?? {});
    })();
  }, []);

  const submit = async () => {
    try {
      await saveMeasurement(data);
      alert("Measurement saved");
      setData({});
    } catch (e) {
      console.error(e);
      alert("Failed to save measurement");
    }
  };

  return (
    <div className="page measurement-new">
      <h1>New Measurement</h1>
      <div className="field-group">
        <label>Customer</label>
        <input
          value={data.customerName ?? ""}
          onChange={(e) => setData({ ...data, customerName: e.target.value })}
        />
      </div>
      <div className="field-group">
        <label>Notes</label>
        <textarea
          value={data.notes ?? ""}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
        />
      </div>
      <button onClick={submit}>Save Measurement</button>
    </div>
  );
}

export default MeasurementNew;
