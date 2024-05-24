import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import  { DataContext } from '../Context/DataProvider';
import logo from '../../src/logo.jpg'

const Header: React.FC = () => {
 const {accounts} = useContext(DataContext)

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light mt-0" style={{ height: '80px' }}>
      <div className="container d-flex justify-content-between align-items-center">
         <Link className="navbar-brand " to="/">
            <img src={logo} alt='Shar Your Thought' style={{ width: '100px', height: 'auto' }}/>
          </Link>
        <div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/">Home</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link text-dark' to="/login">Logout</Link>
            </li>
          </ul>
        </div>
        {/* <button className="btn btn-dark " onClick={handleLogout}>Logout</button> */}
        <Link to={`/`}>
            <button className='btn btn-dark'>{accounts[0].username}</button>
            </Link>
      </div>
    </nav>
  );
};

export default Header;
