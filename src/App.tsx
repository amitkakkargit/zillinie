import { useNavigate, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Account from "./pages/Account";
import POSNext from "./pages/POSNext";
import Staff from "./pages/Staff";
import Status from "./pages/Status";
import Lookups from "./pages/Lookups";
import Measurement from "./pages/Measurement";
import MeasurementsList from "./pages/MeasurementsList";
import Invoice from "./pages/Invoice";
import NotFound from "./pages/NotFound";
import Print1 from "./pages/Print1";
import Print2 from "./pages/Print2";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import MeasurementNew from "./pages/MeasurementNew";
import MeasurementDetails from "./pages/MeasurementDetails";
import ProductEdit from "./pages/ProductEdit";
import StockUsage from "./pages/StockUsage";
import ProductHistory from "./pages/ProductHistory";
import QRScanner from "./pages/QRScanner";
import FetchDataFromImage from "./pages/FetchDataFromImage";
import "./App.css";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/dashboard" className="brand">
          Zillinie
        </Link>
        <nav>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/customers">Customers</Link>
              <Link to="/account">Account</Link>
              <Link to="/pos">POS</Link>
              <Link to="/products">Products</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/payments">Payments</Link>
              <Link to="/invoice">Invoice</Link>
              <Link to="/print1">Print1</Link>
              <Link to="/print2">Print2</Link>
              <Link to="/products/add">Add Product</Link>
              <Link to="/products/manage">Manage Products</Link>
              <Link to="/products/edit">Edit Product</Link>
              <Link to="/measurements/new">New Measurement</Link>
              <Link to="/measurements/details">Measurement Details</Link>
              <Link to="/measurements">Measurements</Link>
              <Link to="/measurements/list">Measurements List</Link>
              <Link to="/staff">Staff</Link>
              <Link to="/status">Status</Link>
              <Link to="/lookups">Lookups</Link>
              <Link to="/stock-usage">Stock Usage</Link>
              <Link to="/product-history">Product History</Link>
              <Link to="/qr-scanner">QR Scanner</Link>
              <Link to="/fetch-from-image">OCR Measurements</Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/customers"
            element={
              <RequireAuth>
                <Customers />
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
          <Route
            path="/pos"
            element={
              <RequireAuth>
                <POSNext />
              </RequireAuth>
            }
          />
          <Route
            path="/products"
            element={
              <RequireAuth>
                <Products />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />
          <Route
            path="/payments"
            element={
              <RequireAuth>
                <Payments />
              </RequireAuth>
            }
          />
          <Route
            path="/invoice"
            element={
              <RequireAuth>
                <Invoice />
              </RequireAuth>
            }
          />
          <Route
            path="/print1"
            element={
              <RequireAuth>
                <Print1 />
              </RequireAuth>
            }
          />
          <Route
            path="/print2"
            element={
              <RequireAuth>
                <Print2 />
              </RequireAuth>
            }
          />
          <Route
            path="/products/add"
            element={
              <RequireAuth>
                <AddProduct />
              </RequireAuth>
            }
          />
          <Route
            path="/products/manage"
            element={
              <RequireAuth>
                <ManageProducts />
              </RequireAuth>
            }
          />
          <Route
            path="/products/edit"
            element={
              <RequireAuth>
                <ProductEdit />
              </RequireAuth>
            }
          />
          <Route
            path="/measurements/details"
            element={
              <RequireAuth>
                <MeasurementDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/measurements/new"
            element={
              <RequireAuth>
                <MeasurementNew />
              </RequireAuth>
            }
          />
          <Route
            path="/measurements/list"
            element={
              <RequireAuth>
                <MeasurementsList />
              </RequireAuth>
            }
          />
          <Route
            path="/staff"
            element={
              <RequireAuth>
                <Staff />
              </RequireAuth>
            }
          />
          <Route
            path="/status"
            element={
              <RequireAuth>
                <Status />
              </RequireAuth>
            }
          />
          <Route
            path="/measurements"
            element={
              <RequireAuth>
                <Measurement />
              </RequireAuth>
            }
          />
          <Route
            path="/lookups"
            element={
              <RequireAuth>
                <Lookups />
              </RequireAuth>
            }
          />
          <Route
            path="/stock-usage"
            element={
              <RequireAuth>
                <StockUsage />
              </RequireAuth>
            }
          />
          <Route
            path="/product-history"
            element={
              <RequireAuth>
                <ProductHistory />
              </RequireAuth>
            }
          />
          <Route
            path="/qr-scanner"
            element={
              <RequireAuth>
                <QRScanner />
              </RequireAuth>
            }
          />
          <Route
            path="/fetch-from-image"
            element={
              <RequireAuth>
                <FetchDataFromImage />
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
