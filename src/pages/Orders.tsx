import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, getOrder } from "../services/zillinieApi";

function Orders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [orderDetail, setOrderDetail] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getOrders(searchTerm);
      setOrders(data);
    } catch {
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  const showOrder = async (orderNumber: string) => {
    setOrderDetail([]);
    try {
      const data = await getOrder(orderNumber);
      setOrderDetail(data);
    } catch {
      setError("Could not load order details.");
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  return (
    <div className="page orders-page">
      <h1>Orders</h1>
      <div className="search-row">
        <input
          value={searchTerm}
          placeholder="Search orders"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={loadOrders}>Search</button>
      </div>
      {loading && <p>Loading orders...</p>}
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            {orders[0] &&
              Object.keys(orders[0]).map((key) => <th key={key}>{key}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const orderNumber =
              order.OrderNumber ?? order.OrderNo ?? order.OrderID ?? "";
            return (
              <tr key={orderNumber || JSON.stringify(order)}>
                {Object.values(order).map((value, index) => (
                  <td key={index}>{String(value)}</td>
                ))}
                <td>
                  {orderNumber && (
                    <>
                      <button onClick={() => showOrder(String(orderNumber))}>
                        View
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/invoice?orderNumber=${encodeURIComponent(
                              String(orderNumber),
                            )}`,
                          )
                        }
                      >
                        Invoice
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/print1?orderNumber=${encodeURIComponent(
                              String(orderNumber),
                            )}`,
                          )
                        }
                      >
                        Print
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/print2?orderNumber=${encodeURIComponent(
                              String(orderNumber),
                            )}`,
                          )
                        }
                      >
                        Receipt
                      </button>
                    </>
                  )}
                  {order.OrderId ? (
                    <button
                      onClick={() =>
                        navigate(`/payments?orderId=${order.OrderId}`)
                      }
                    >
                      Payments
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {orderDetail.length > 0 && (
        <section className="detail-panel">
          <h2>Order details</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(orderDetail[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderDetail.map((item, index) => (
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

export default Orders;
