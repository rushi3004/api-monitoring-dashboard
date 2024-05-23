import React,{useState} from 'react';
import Login from './Components/Login';
import Signup from './Components/Signup';
import {BrowserRouter, Routes,Route,Outlet,Navigate} from 'react-router-dom'
import DataProvider from './Context/DataProvider';
import HomePage from './Components/Home/Home';
import DashBoard from './Components/DashBoard/DashBoard';
import CreatePost from './Components/Home/Post/CreatePost';


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
    <div>
      <Routes>
     <Route path='/login' element={<Login isUserAuthenticated={isUserAuthenticated}/>}/>
      
      <Route path='/' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
      <Route path='/' element={<HomePage/>}/>
      </Route>
      <Route path='/signup' element={<Signup/>}/>

      <Route path='/dashboard' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
      <Route path='/dashboard' element={<DashBoard/>}/>
      </Route>

      <Route path='/createPost' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
      <Route path='/createPost' element={<CreatePost/>}/>
      </Route>

      </Routes>
    </div>
      </BrowserRouter>
      </DataProvider>
    // <DashBoard/>
  );
};

export default App;
