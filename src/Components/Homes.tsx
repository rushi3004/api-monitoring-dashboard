import React, { useState , useContext } from 'react';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../Context/DataProvider';

const initialPost = {
    title: '',
    description: '',
    username: '',
    createdDate: new Date()
}


const HomesPage: React.FC = () => {
  const [totalFileSize, setTotalFileSize] = useState<number>(0); // State to store total file size

  const [apiCallsCount, setApiCallsCount] = useState<number>(0); // State to store API calls count
  const [post, setPost] = useState(initialPost);
  const navigate = useNavigate()
  const { accounts } = useContext(DataContext) || { accounts: [], setAccounts: () => {} };

  // Function to handle PDF download
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axios({
      url: 'http://localhost:5000/download',
      method: 'GET',
      responseType: 'blob'
    }).then((res) => {
      const fileSizeInBytes = res.data.size; // Fetch file size
      const fileSizeInKB = fileSizeInBytes / 1024; // Convert bytes to KB
      const updatedTotalFileSize = totalFileSize + fileSizeInKB; // Update total file size
      setTotalFileSize(updatedTotalFileSize); // Set total file size state
      fileDownload(res.data, 'apifile.pdf');
    });
  };

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
}

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       
       const accessToken = sessionStorage.getItem('accessToken');
        console.log("access",accessToken);
      
      if (accessToken) {
          const newPost = {
              ...post,
              createdBy: new Date() 
          };

           const config = {
             headers: {
              authorization:'accessToken'
          }
         };
      
  
      const response = await axios.post('http://localhost:5000/create', newPost,config);
      console.log('Post saved:', response.data);
      setApiCallsCount(apiCallsCount + 1); // Increment API calls count
      setPost(initialPost); 
    }
 } catch (error) {
      console.error('Error saving post:', error);
    }
  };
  

  const handleLogout = async(e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigate('/')
    
  }

  return (
    <div className="container mt-5">
      <div style={{ position: 'fixed', top: '60px', right: '20px' }}>
        <button onClick={handleLogout} className="btn btn-primary mr-0">Logout</button>
      </div>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <p className=' h2 mb-3 text-primary font-weight-bold' >Create your Blog</p>
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title" name='title' onChange={(e) => handleChange(e)} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input className="form-control" id="description"  name="description" onChange={(e) => handleChange(e)}/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
          <p>
            For more detailed information, you can download our PDF brochure.
          </p>
          <button className="btn btn-primary" onClick={handleDownload}>Download PDF</button>
          <p>Total file size: {totalFileSize.toFixed(2)} KB</p> {/* Display total file size */}
          <p>API calls count: {apiCallsCount}</p> {/* Display API calls count */}
        </div>
      </div>
    </div>
  );
};

export default HomesPage;

