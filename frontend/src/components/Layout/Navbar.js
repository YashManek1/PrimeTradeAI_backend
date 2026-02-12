import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <nav style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "15px" }}>
        Home
      </Link>
      {!user && (
        <Link to="/login" style={{ marginRight: "15px" }}>
          Login
        </Link>
      )}
      {!user && (
        <Link to="/register" style={{ marginRight: "15px" }}>
          Register
        </Link>
      )}
      {user && (
        <Link to="/dashboard" style={{ marginRight: "15px" }}>
          Dashboard
        </Link>
      )}
      {user && user.role === "admin" && (
        <Link to="/admin" style={{ marginRight: "15px", fontWeight: "bold" }}>
          Admin Panel
        </Link>
      )}
    </nav>
  );
};
export default Navbar;
