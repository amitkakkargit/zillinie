import { useEffect, useState } from "react";
import api from "../services/api";

interface Customer {
  id: number;
  name: string;
  mobile: string;
  email?: string;
}

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/customers")
      .then((response) => setCustomers(response.data))
      .catch(() => setError("Could not load customers."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page customers-page">
      <h1>Customers</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.mobile}</td>
                <td>{customer.email ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Customers;
