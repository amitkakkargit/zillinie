import { useEffect, useState } from "react";
import { getProducts, getProductStock } from "../services/zillinieApi";

interface Product {
  ProductID: number;
  ProductName: string;
  Unit: string;
  PurchaseRate: number;
  SaleRate: number;
  CurrentStock?: number;
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedStock, setSelectedStock] = useState<any[]>([]);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  const viewStock = async (productId: number, name: string) => {
    setSelectedStock([]);
    setSelectedProductName(name);
    try {
      const stock = await getProductStock(productId);
      setSelectedStock(stock);
    } catch {
      setError("Could not load stock details.");
    }
  };

  return (
    <div className="page products-page">
      <h1>Products</h1>
      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Purchase</th>
            <th>Sale</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.ProductID}>
              <td>{product.ProductID}</td>
              <td>{product.ProductName}</td>
              <td>{product.Unit}</td>
              <td>{product.PurchaseRate}</td>
              <td>{product.SaleRate}</td>
              <td>
                <button
                  onClick={() =>
                    viewStock(product.ProductID, product.ProductName)
                  }
                >
                  View stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStock.length > 0 && (
        <section className="stock-details">
          <h2>Stock details for {selectedProductName}</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(selectedStock[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedStock.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, valueIndex) => (
                    <td key={valueIndex}>{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default Products;
