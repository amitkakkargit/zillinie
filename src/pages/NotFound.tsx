import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page not-found-page">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>
        <Link to="/dashboard">Return to dashboard</Link>
      </p>
    </div>
  );
}

export default NotFound;
