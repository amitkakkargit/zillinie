import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Staff from "./pages/Staff";
import Status from "./pages/Status";
import Lookups from "./pages/Lookups";
import Measurement from "./pages/Measurement";
import Invoice from "./pages/Invoice";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/dashboard" className="brand">
          Zillinie
        </Link>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/payments">Payments</Link>
          <Link to="/invoice">Invoice</Link>
          <Link to="/staff">Staff</Link>
          <Link to="/status">Status</Link>
          <Link to="/measurements">Measurement</Link>
          <Link to="/lookups">Lookups</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/status" element={<Status />} />
          <Route path="/measurements" element={<Measurement />} />
          <Route path="/lookups" element={<Lookups />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
