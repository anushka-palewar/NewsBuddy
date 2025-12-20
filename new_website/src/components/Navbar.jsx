import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">📰 NewsApplication</h2>

      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/kids">Kids</Link>
        <Link to="/adult">Adult</Link>
        <Link to="/weekly">Weekly</Link>
        <Link to="/newspapers">Newspapers</Link>
        <Link to="/admin/login">Admin</Link>
      </div>
    </nav>
  );
};

export default Navbar;
