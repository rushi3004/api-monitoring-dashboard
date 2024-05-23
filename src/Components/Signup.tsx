import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import loginImage from '../../src/login.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

interface InputField {
  name: string;
  type: string;
  placeholder: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<any>({ username: '', fullname: '', email: '', password: '' });
  const [error, setError] = useState<any>('');
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev:any) => ({ ...prev, [name]: value }));
    setErrors((prev:any) => ({ ...prev, [name]: '' }));
  };

  const inputFields: InputField[] = [
    { name: 'username', type: 'text', placeholder: 'Username' },
    { name: 'fullname', type: 'text', placeholder: 'Full Name' },
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' }
  ];
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((field:any) => {
      if (!formData[field]) newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    });
    return newErrors;
  };

  const handleSignup = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      if (response.status === 200) {
        setError('');
        setFormData({ username: '', fullname: '', email: '', password: '' });
        navigate('/login');
      }
    } catch (error:any) {
      setError(error.response?.data.msg || 'An error occurred');
    }
  };

  return (
    <div 
    className="container-fluid d-flex justify-content-center align-items-center vh-100"
    style={{
      background: "linear-gradient(90deg, gray 10%, white 25%, rgba(0,212,255,1) 80%)", 

    }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-header bg-dark text-white">
              <h2 className="text-center mb-0">Signup</h2>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {inputFields.map((field,index) => (
                <div key={index} className="mb-3">
                  <input
                    type={field.type}                    
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                    placeholder={field.placeholder}
                  />
                  {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </div>
              ))}
              <button onClick={handleSignup} className="btn btn-dark w-100">Signup</button>
              <p className="mt-3 mb-0">Already signed up? <Link to="/login">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
