import { useEffect, useRef, useState } from "react";
import { getProductByQR, updateStockQuantity } from "../services/zillinieApi";
import { useAuth } from "../context/AuthContext";

interface ProductInfo {
  ProductId: number;
  ProductName: string;
  CategoryName: string;
  SubCategoryName: string;
  Size: string;
  Color: string;
  Price: number;
  StockQuantity: number;
  Description: string;
}

export default function QRScanner() {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [stockForm, setStockForm] = useState({
    quantity: "",
    transactionType: "USE",
    remarks: "",
  });
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  async function startCamera() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);
      scanFrame();
    } catch {
      setError("Camera access denied. Use manual entry below.");
    }
  }

  function stopCamera() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }

  function scanFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Use BarcodeDetector if available (Chrome/Edge)
    if ("BarcodeDetector" in window) {
      const detector = new (window as any).BarcodeDetector({ formats: ["qr_code", "code_128", "ean_13"] });
      detector.detect(canvas).then((barcodes: any[]) => {
        if (barcodes.length > 0) {
          stopCamera();
          lookupProduct(barcodes[0].rawValue);
        } else {
          rafRef.current = requestAnimationFrame(scanFrame);
        }
      }).catch(() => {
        rafRef.current = requestAnimationFrame(scanFrame);
      });
    } else {
      // BarcodeDetector not supported — show message
      stopCamera();
      setError("Automatic scanning not supported in this browser. Use manual entry below.");
    }
  }

  async function lookupProduct(code: string) {
    setError("");
    setProduct(null);
    setMessage("");
    try {
      const data = await getProductByQR(code);
      setProduct(data);
    } catch {
      setError(`No product found for code: ${code}`);
    }
  }

  async function handleManualLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await lookupProduct(manualCode.trim());
  }

  async function handleStockUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    try {
      await updateStockQuantity(
        product.ProductId,
        Number(stockForm.quantity),
        stockForm.transactionType,
        stockForm.remarks,
        (user as any)?.username ?? "System"
      );
      setMessage("Stock updated successfully.");
      setStockForm({ quantity: "", transactionType: "USE", remarks: "" });
      // Refresh product info
      const updated = await getProductByQR(String(product.ProductId));
      setProduct(updated);
    } catch {
      setError("Failed to update stock.");
    }
  }

  return (
    <div>
      <h2>QR Code Scanner</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {!scanning ? (
          <button onClick={startCamera}>Start Camera Scan</button>
        ) : (
          <button onClick={stopCamera}>Stop Camera</button>
        )}
      </div>

      <video ref={videoRef} style={{ display: scanning ? "block" : "none", maxWidth: 400, border: "2px solid #333" }} muted playsInline />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <form onSubmit={handleManualLookup} style={{ display: "flex", gap: "0.5rem", margin: "1rem 0" }}>
        <input
          placeholder="Enter QR / barcode value manually..."
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          style={{ minWidth: 260 }}
        />
        <button type="submit">Lookup</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {product && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Product Details</h3>
          <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", marginBottom: "1rem" }}>
            <tbody>
              <tr><td><strong>Name</strong></td><td>{product.ProductName}</td></tr>
              <tr><td><strong>Category</strong></td><td>{product.CategoryName}</td></tr>
              <tr><td><strong>Sub-Category</strong></td><td>{product.SubCategoryName}</td></tr>
              <tr><td><strong>Size</strong></td><td>{product.Size}</td></tr>
              <tr><td><strong>Color</strong></td><td>{product.Color}</td></tr>
              <tr><td><strong>Price</strong></td><td>{product.Price}</td></tr>
              <tr><td><strong>Stock Quantity</strong></td><td>{product.StockQuantity}</td></tr>
              <tr><td><strong>Description</strong></td><td>{product.Description}</td></tr>
            </tbody>
          </table>

          <h3>Update Stock</h3>
          <form onSubmit={handleStockUpdate} style={{ maxWidth: 360 }}>
            <div>
              <label>Transaction Type</label>
              <select value={stockForm.transactionType} onChange={(e) => setStockForm({ ...stockForm, transactionType: e.target.value })}>
                <option value="USE">Use (Deduct)</option>
                <option value="ADD">Add</option>
                <option value="ADJUST">Adjust</option>
              </select>
            </div>
            <div>
              <label>Quantity</label>
              <input type="number" required min={1} value={stockForm.quantity} onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })} />
            </div>
            <div>
              <label>Remarks</label>
              <input value={stockForm.remarks} onChange={(e) => setStockForm({ ...stockForm, remarks: e.target.value })} />
            </div>
            <button type="submit" style={{ marginTop: "0.5rem" }}>Update Stock</button>
          </form>
        </div>
      )}
    </div>
  );
}
