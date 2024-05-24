import React from 'react';
import Header from '../Header';
import image from '../../post1.jpg'
import Download from './Download';
import GetPost from './Post/GetPost';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';


const HomePage: React.FC = () => {
  
  const navigate = useNavigate()
const handleCreate = () => {
  navigate('/createPost')
}
  return (
    <>
    <Header/>
    <div className='p-3'>
      <div className='row justify-content-md-center'>

        <div className='col col-lg-2 w-100'>
        <img src={image} alt="New Post" style={{ width: '100%', height: '400px' }} />
        </div>

        <div className="col-md-auto w-100">
          <div className='d-flex justify-content-center align-items-center mt-5'>
          <button type='button' className='btn btn-dark' onClick={handleCreate}>Create Post</button>
          </div>
          <GetPost/>
        </div>
        
        <div className='col col-lg-2 w-100 '>
          <Download/>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default HomePage;
