import { useEffect, useState } from "react";
import { getProducts, saveProduct } from "../services/zillinieApi";

function ProductEdit() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    (async () => {
      const res = await getProducts();
      setProducts(res ?? []);
    })();
  }, []);

  const pick = (p: any) => {
    setSelected(p);
    setName(p.ProductName ?? p.Name ?? "");
    setPrice(String(p.Price ?? p.Price ?? ""));
  };

  const save = async () => {
    const payload = { ProductName: name, Price: Number(price) };
    try {
      await saveProduct(payload);
      alert("Saved (or created) product.");
      const updated = await getProducts();
      setProducts(updated ?? []);
    } catch (e) {
      console.error(e);
      alert("Failed to save product");
    }
  };

  return (
    <div className="page product-edit">
      <h1>Product Edit</h1>
      <div className="field-group">
        <label>Products</label>
        <select onChange={(e) => pick(products[Number(e.target.value)])}>
          <option value="">--select--</option>
          {products.map((p, i) => (
            <option key={i} value={i}>
              {p.ProductName ?? p.Name ?? p.ProductName}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div>
          <div className="field-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field-group">
            <label>Price</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <button onClick={save}>Save</button>
        </div>
      )}
    </div>
  );
}

export default ProductEdit;
