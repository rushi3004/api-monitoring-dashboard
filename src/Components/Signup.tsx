// Signup.tsx
import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom

import 'bootstrap/dist/css/bootstrap.min.css';


const Signup = () => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/signup', { username, fullname, email, password });
      if(response?.status === 200){
      setError('')
        setEmail('')
        setFullname('')
        setUsername('')
        setPassword('')
        navigate('/');

      }
    } catch (error:any) {
      setError(error.response.data.msg);
    }
  };

  return (
    <div className="container mt-5 justify-content-center">
  <div className="row justify-content-center">
    <div className="col-md-6">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Signup</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" placeholder="Username" />
          </div>
          <div className="mb-3">
            <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} className="form-control" placeholder="Full Name" />
          </div>
          <div className="mb-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email" />
          </div>
          <div className="mb-3">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Password" />
          </div>
          <button onClick={handleSignup} className="btn btn-primary w-100">Signup</button>
          <p className="mt-3 mb-0">Alreay signup? <Link to="/">login</Link></p> {/* Link to signup page */}

        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Signup;
