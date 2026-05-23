import { useState } from "react";
import { saveProduct } from "../services/zillinieApi";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const submit = async () => {
    const p = { ProductName: name, Price: Number(price) };
    try {
      await saveProduct(p);
      alert("Product saved");
      setName("");
      setPrice("");
    } catch (e) {
      console.error(e);
      alert("Failed to save product");
    }
  };

  return (
    <div className="page add-product">
      <h1>Add Product</h1>
      <div className="field-group">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field-group">
        <label>Price</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <button onClick={submit}>Save</button>
    </div>
  );
}

export default AddProduct;
