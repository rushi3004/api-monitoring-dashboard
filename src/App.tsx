import React,{useState} from 'react';
import Login from './Components/Login';
import Signup from './Components/Signup';
import {BrowserRouter, Routes,Route,Outlet,Navigate} from 'react-router-dom'
import DataProvider from './Context/DataProvider';
import HomePage from './Components/Home';


const PrivateRoute = ({isAuthenticated,...props}:any) =>{
  return isAuthenticated ? 
  <>
    <Outlet {...props}/>
  </>
  : <Navigate replace to='/login'/>
}

const App = () => {
  const [isAuthenticated,isUserAuthenticated] = useState(false)

  return (
    <DataProvider>
    <BrowserRouter>
    <div style={{marginTop:"80px"}}>
      <Routes>
     <Route path='/login' element={<Login isUserAuthenticated={isUserAuthenticated}/>}/>
      
      <Route path='/' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
      <Route path='/' element={<HomePage/>}/>
      </Route>
      <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </div>
      </BrowserRouter>
      </DataProvider>
  );
};

export default App;
