import { useRef, useState } from "react";
import { extractMeasurementsFromImage } from "../services/zillinieApi";

const MEASUREMENT_FIELDS = ["Shoulders", "Chest", "Waist", "Hips", "Calf"];

export default function FetchDataFromImage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setSuccess(false);
    setMeasurements({});

    const allowed = ["image/jpeg", "image/png", "image/bmp", "image/tiff", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Invalid file type. Only JPG, PNG, BMP, TIFF and GIF are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5 MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Please select an image file.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await extractMeasurementsFromImage(formData);
      setMeasurements(result.measurements ?? {});
      setSuccess(true);
      if (Object.keys(result.measurements ?? {}).length === 0) {
        setError("No measurements could be extracted from the image. Try a clearer photo.");
      }
    } catch {
      setError("Failed to extract measurements. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleMeasurementChange(key: string, value: string) {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <h2>Fetch Measurements from Image</h2>
      <p style={{ color: "#666" }}>
        Upload a photo of a measurement slip. The system will OCR-extract fields like Shoulders, Chest, Waist, Hips, and Calf.
      </p>

      <form onSubmit={handleUpload} style={{ maxWidth: 480 }}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/bmp,image/tiff,image/gif"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div style={{ marginBottom: "1rem" }}>
            <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 300, border: "1px solid #ccc" }} />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Extracting..." : "Upload & Extract"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

      {success && Object.keys(measurements).length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Extracted Measurements</h3>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Review and correct any values before using them.</p>
          <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", minWidth: 320 }}>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {MEASUREMENT_FIELDS.map((field) => (
                <tr key={field}>
                  <td><strong>{field}</strong></td>
                  <td>
                    <input
                      value={measurements[field] ?? ""}
                      onChange={(e) => handleMeasurementChange(field, e.target.value)}
                      placeholder="—"
                      style={{ width: "100%" }}
                    />
                  </td>
                </tr>
              ))}
              {Object.keys(measurements)
                .filter((k) => !MEASUREMENT_FIELDS.includes(k))
                .map((field) => (
                  <tr key={field}>
                    <td><strong>{field}</strong></td>
                    <td>
                      <input
                        value={measurements[field]}
                        onChange={(e) => handleMeasurementChange(field, e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
