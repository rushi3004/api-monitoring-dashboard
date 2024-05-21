import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light mt-0">
      <div className="container d-flex justify-content-between align-items-center">
         <Link className="navbar-brand" to="/">
            My Blog
          </Link>
        <div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
          </ul>
        </div>
        <button className="btn btn-primary " onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Header;
