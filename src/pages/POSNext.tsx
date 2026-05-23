import { useState, useEffect } from "react";
import {
  getProducts,
  updateProductStock,
  getCustomers,
  createOrder,
} from "../services/zillinieApi";

function POSNext() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const prods = await getProducts();
      setProducts(prods ?? []);
      const custs = await getCustomers();
      setCustomers(custs ?? []);
    })();
  }, []);

  const addToCart = (product: any) => {
    const existing = cart.find(
      (c) => c.productId === product.ProductID || c.productId === product.id,
    );
    if (existing) {
      setCart(
        cart.map((c) =>
          c.productId === existing.productId
            ? { ...c, quantity: c.quantity + 1 }
            : c,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.ProductID ?? product.id,
          name: product.ProductName ?? product.Name,
          price: Number(product.Price ?? product.price ?? 0),
          quantity: 1,
        },
      ]);
    }
  };

  const create = async () => {
    setError("");
    setSuccess("");
    if (!selectedCustomer) {
      setError("Please select a customer before creating an order.");
      return;
    }
    if (cart.length === 0) {
      setError("Add at least one product to the cart.");
      return;
    }

    setLoading(true);
    try {
      const items = cart.map((c) => ({
        productId: c.productId,
        quantity: c.quantity,
        price: c.price,
      }));
      const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
      const payload = { customerId: selectedCustomer, items, total };
      const res = await createOrder(payload);
      if (res?.orderId) {
        for (const it of items) {
          try {
            await updateProductStock(
              it.productId,
              it.quantity,
              res.orderNumber ?? "",
            );
          } catch {
            // ignore stock update failures for now
          }
        }
        setCart([]);
        setSuccess(`Order created successfully: ${res.orderNumber}`);
      } else {
        setError("Order creation failed.");
      }
    } catch (e) {
      console.error(e);
      setError("Order creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page pos-page">
      <h1>POS - Order Entry</h1>
      <div>
        <label>Customer</label>
        <select
          value={selectedCustomer ?? ""}
          onChange={(e) => setSelectedCustomer(Number(e.target.value) || null)}
        >
          <option value="">--select--</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <section>
        <h2>Products</h2>
        <div className="product-list">
          {products.map((p) => (
            <div key={p.ProductID ?? p.id} className="product-item">
              <div>{p.ProductName ?? p.Name}</div>
              <div>Price: {p.Price ?? p.price ?? 0}</div>
              <button onClick={() => addToCart(p)}>Add</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Cart empty</p>
        ) : (
          <div>
            <ul>
              {cart.map((c) => (
                <li key={c.productId}>
                  {c.name} x {c.quantity} = {c.price * c.quantity}
                </li>
              ))}
            </ul>
            <div>
              Total: {cart.reduce((s, it) => s + it.price * it.quantity, 0)}
            </div>
            <button onClick={create}>Create Order</button>
          </div>
        )}
      </section>
    </div>
  );
}

export default POSNext;
