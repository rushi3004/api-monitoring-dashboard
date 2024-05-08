// Login.tsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link ,useNavigate} from 'react-router-dom'; // Import Link from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataContext } from '../Context/DataProvider';


type IsUserAuthenticated = (authenticated: boolean) => void;

const loginInitialValues = {
  username: String,
  password: String
};
const Login = ({ isUserAuthenticated }: { isUserAuthenticated: IsUserAuthenticated }) => {
  const [login, setLogin] = useState(loginInitialValues);
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const { setAccounts } = useContext(DataContext);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
};
  const handleLogin = async () => {
    try {
      const newLogin = {
        ...login 
      };
      const response = await axios.post('http://localhost:5000/login', newLogin);
      // Handle successful login
      if(response?.status === 200){
        sessionStorage.setItem('accessToken', `${response.data.accessToken}`);
        sessionStorage.setItem('refreshToken', `${response.data.refreshToken}`);
       console.log("accessToken",response.data.accessToken);
       
        isUserAuthenticated(true);
        setAccounts([{ username: response.data.username, password: '' }]); // Set the accounts with user's information
        console.log('login successfully');
        navigate('/')
        
      }
    } catch (error:any) {
      setError(error.response.data.msg);
    }
  };

  return (
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">Login</h2>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <input type="text" name="username" onChange={(e) => onValueChange(e)} className="form-control" placeholder="Username" />
            </div>
            <div className="mb-3">
              <input type="password" name="password" onChange={(e) => onValueChange(e)} className="form-control" placeholder="Password" />
            </div>
            <button onClick={handleLogin} className="btn btn-primary w-100">Login</button>
            <p className="mt-3 mb-0">New User? <Link to="/signup">Sign Up Here</Link></p> {/* Link to signup page */}

          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Login;
