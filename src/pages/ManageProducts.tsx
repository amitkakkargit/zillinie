import { useEffect, useState } from "react";
import { getProducts } from "../services/zillinieApi";

function ManageProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getProducts();
      setProducts(res ?? []);
    })();
  }, []);

  return (
    <div className="page manage-products">
      <h1>Manage Products</h1>
      {products.length === 0 ? (
        <p>No products</p>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(products[0]).map((k) => (
                <th key={k}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p: any, i: number) => (
              <tr key={i}>
                {Object.keys(products[0]).map((k) => (
                  <td key={k}>{String(p[k] ?? "-")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageProducts;
