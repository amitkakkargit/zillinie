import { useEffect, useState } from "react";
import { getLookupData, saveProduct } from "../services/zillinieApi";

function AddProduct() {
  const [lookupData, setLookupData] = useState({
    productTypes: [] as any[],
    units: [] as any[],
  });
  const [form, setForm] = useState({
    SubcategoryID: 0,
    ProductName: "",
    Unit: "",
    PurchaseRate: "",
    SaleRate: "",
    NewStock: "",
    Remarks: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getLookupData();
        setLookupData({
          productTypes: data.productTypes ?? [],
          units: data.units ?? [],
        });
      } catch {
        setError("Could not load lookup data.");
      }
    })();
  }, []);

  const submit = async () => {
    setError("");
    setMessage("");
    if (
      !form.ProductName ||
      !form.Unit ||
      !form.PurchaseRate ||
      !form.SaleRate
    ) {
      setError("Name, unit, purchase rate and sale rate are required.");
      return;
    }

    try {
      await saveProduct({
        SubcategoryID: Number(form.SubcategoryID) || 0,
        ProductName: form.ProductName,
        Unit: form.Unit,
        PurchaseRate: Number(form.PurchaseRate),
        SaleRate: Number(form.SaleRate),
        NewStock: Number(form.NewStock) || 0,
        Remarks: form.Remarks,
      });
      setMessage("Product saved successfully.");
      setForm({
        SubcategoryID: 0,
        ProductName: "",
        Unit: "",
        PurchaseRate: "",
        SaleRate: "",
        NewStock: "",
        Remarks: "",
      });
    } catch (e) {
      console.error(e);
      setError("Failed to save product.");
    }
  };

  return (
    <div className="page add-product">
      <h1>Add Product</h1>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <div className="field-group">
        <label>Product type</label>
        <select
          value={form.SubcategoryID}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              SubcategoryID: Number(e.target.value),
            }))
          }
        >
          <option value={0}>Select type</option>
          {lookupData.productTypes.map((type) => (
            <option
              key={type.ProductTypeId ?? type.ProductId ?? type.Id}
              value={type.ProductTypeId ?? type.ProductId ?? type.Id}
            >
              {type.ProductType ?? type.ProductName ?? type.Name}
            </option>
          ))}
        </select>
      </div>
      <div className="field-group">
        <label>Name</label>
        <input
          value={form.ProductName}
          onChange={(e) =>
            setForm((current) => ({ ...current, ProductName: e.target.value }))
          }
        />
      </div>
      <div className="field-group">
        <label>Unit</label>
        <select
          value={form.Unit}
          onChange={(e) =>
            setForm((current) => ({ ...current, Unit: e.target.value }))
          }
        >
          <option value="">Select unit</option>
          {lookupData.units.map((unit) => (
            <option
              key={unit.UnitId ?? unit.Id}
              value={unit.UnitName ?? unit.Name ?? unit.Unit}
            >
              {unit.UnitName ?? unit.Name ?? unit.Unit}
            </option>
          ))}
        </select>
      </div>
      <div className="field-group">
        <label>Purchase rate</label>
        <input
          type="number"
          value={form.PurchaseRate}
          onChange={(e) =>
            setForm((current) => ({ ...current, PurchaseRate: e.target.value }))
          }
        />
      </div>
      <div className="field-group">
        <label>Sale rate</label>
        <input
          type="number"
          value={form.SaleRate}
          onChange={(e) =>
            setForm((current) => ({ ...current, SaleRate: e.target.value }))
          }
        />
      </div>
      <div className="field-group">
        <label>Initial stock</label>
        <input
          type="number"
          value={form.NewStock}
          onChange={(e) =>
            setForm((current) => ({ ...current, NewStock: e.target.value }))
          }
        />
      </div>
      <div className="field-group full-width">
        <label>Remarks</label>
        <textarea
          value={form.Remarks}
          onChange={(e) =>
            setForm((current) => ({ ...current, Remarks: e.target.value }))
          }
          rows={3}
        />
      </div>
      <button onClick={submit}>Save Product</button>
    </div>
  );
}

export default AddProduct;
