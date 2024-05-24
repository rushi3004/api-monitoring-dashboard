import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataContext } from '../Context/DataProvider';

type IsUserAuthenticated = (authenticated: boolean) => void;

interface InputField {
  name: string;
  type: string;
  placeholder: string;
}

const inputFields: InputField[] = [
  { name: 'username', type: 'text', placeholder: 'Username' },
  { name: 'password', type: 'password', placeholder: 'Password' }
];

const Login: React.FC<{ isUserAuthenticated: IsUserAuthenticated }> = ({ isUserAuthenticated }) => {
  const [login, setLogin] = useState<{ [key: string]: string }>({ username: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAccounts } = useContext(DataContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin(prevLogin => ({ ...prevLogin, [name]: value }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!login.username) newErrors.username = 'Username is required';
    if (!login.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleLogin = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', login);
      if (response?.status === 200) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('refreshToken', response.data.refreshToken);
        isUserAuthenticated(true);
        setAccounts([{ username: response.data.username, password: '' }]);
        navigate('/');
      }
    } catch (error: any) {
      setError(error.response?.data.msg || 'An error occurred during login');
    }
  };

  return (
    <div 
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(90deg, gray 20%, white 25%, rgba(0,212,255,1) 80%)", 
      }}
    >
      <div className="row justify-content-center w-100">
          
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-header bg-dark text-white">
              <h2 className=" text-center mb-0">Login</h2>
            </div>
            <div className="card-body" >
              {error && <div className="alert alert-danger">{error}</div>}
              {inputFields.map((field, index) => (
                <div key={index} className="mb-3">
                  <input
                    type={field.type}
                    name={field.name}
                    value={login[field.name]}
                    onChange={handleInputChange}
                    className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                    placeholder={field.placeholder}
                   
                  />
                  {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </div>
              ))}
              <button onClick={handleLogin} className="btn btn-dark w-100">Login</button>
              <p className="mt-3 mb-0">New User? <Link to="/signup">Sign Up Here</Link></p>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default Login;


// import './Login.css'
// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { DataContext } from '../Context/DataProvider';
// import loginImage from '../../src/login.jpg';

// type IsUserAuthenticated = (authenticated: boolean) => void;

// interface InputField {
//   name: string;
//   type: string;
//   placeholder: string;
// }

// const inputFields: InputField[] = [
//   { name: 'username', type: 'text', placeholder: 'Username' },
//   { name: 'password', type: 'password', placeholder: 'Password' }
// ];

// const Login: React.FC<{ isUserAuthenticated: IsUserAuthenticated }> = ({ isUserAuthenticated }) => {
//   const [login, setLogin] = useState<{ [key: string]: string }>({ username: '', password: '' });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { setAccounts } = useContext(DataContext);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setLogin(prevLogin => ({ ...prevLogin, [name]: value }));
//     if (errors[name]) {
//       setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!login.username) newErrors.username = 'Username is required';
//     if (!login.password) newErrors.password = 'Password is required';
//     return newErrors;
//   };

//   const handleLogin = async () => {
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/login', login);
//       if (response?.status === 200) {
//         sessionStorage.setItem('accessToken', response.data.accessToken);
//         sessionStorage.setItem('refreshToken', response.data.refreshToken);
//         isUserAuthenticated(true);
//         setAccounts([{ username: response.data.username, password: '' }]);
//         navigate('/');
//       }
//     } catch (error: any) {
//       setError(error.response?.data.msg || 'An error occurred during login');
//     }
//   };

//   return (
//     <div className='back'>
//             <div className="container-fluid">
//               {error && <div className="alert alert-danger">{error}</div>}
//               <form className='mx-auto'>
//               {inputFields.map((field, index) => (
//                 <div key={index} className="mb-3">
//                   <h4 className='text-center'>Login</h4>
//                   <div className='mb-3 mt-5'>
//                   <input
//                     type={field.type}
//                     name={field.name}
//                     value={login[field.name]}
//                     onChange={handleInputChange}
//                     className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
//                     placeholder={field.placeholder}
//                   />
//                   </div>
//                   {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
//                 </div>
//               ))}
//               <button onClick={handleLogin} className="btn btn-primary w-100 mt-5">Login</button>
//               <p className="mt-3 mb-0">New User? <Link to="/signup">Sign Up Here</Link></p>
//             </form>
//             </div>
//           </div>
       
//   );
// };

// export default Login;

