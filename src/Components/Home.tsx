import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../Context/DataProvider';
import Header from './Header';

interface Post {
  title: string;
  description: string;
}

interface CounterResponse {
  count: number;
}

const initialPost: Post = {
  title: '',
  description: '',
};

const HomePage: React.FC = () => {
  const [apiCallsCount, setApiCallsCount] = useState<number>(0);
  const [post, setPost] = useState<Post>(initialPost);
  const [totalDownloadSize,setTotalDownloadSize] = useState<number>(0)
  const { accounts } = useContext(DataContext);
  const navigate = useNavigate();


  const fetchApiCallCount = async () => {
    try {
      const username = accounts[0].username
      const currentDate = new Date().toISOString().slice(0,10)
      const response = await fetch(`http://localhost:5000/counter?date=${currentDate}&username=${username}`);

      console.log("api count",response);
      
      if(response.ok){
        const data:CounterResponse = await response.json()

        setApiCallsCount(data.count)
      }else{
        console.error('Failed to fetch count');
      }
    } catch (error) {
      console.error("Error in fetching",error);
      
    }
  }

  useEffect(() =>{
    fetchApiCallCount();
    fetchtotaldownloadSize()
  },[])
  
  useEffect(() => {
    if (accounts && accounts.length > 0) {
      setPost((prevPost) => ({ ...prevPost, username: accounts[0].username }));
    }
  }, [accounts]);



  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiCallsCount((prevApiCallsCount) => prevApiCallsCount + 1);

    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) return;

    const { username } = accounts[0];
    try {
      const response = await axios.post(
        'http://localhost:5000/create',
        {
          ...post,
          username,
          createdDate: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Post saved:', response.data);
      setPost(initialPost);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
        const response = await axios.get('http://localhost:5000/download?username=' + accounts[0].username, {
            responseType: 'blob', 
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });

        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.setAttribute('download', 'apifile.pdf');
        downloadLink.click();

        fetchtotaldownloadSize();

    } catch (error) {
        console.error('Error in downloading', error);
    }
};

 
  const fetchtotaldownloadSize = async () => {
    try {
      const username = accounts[0].username;
      const date = new Date().toISOString().slice(0,10)

      const response = await axios.get(`http://localhost:5000/totalFileSize?username=${username}&date=${date}`)

      console.log("res",response);
      
      if(response.status === 200){
        console.log('download',response.data.totalFileSize);
        
        setTotalDownloadSize(response.data.totalFileSize)
      }
    } catch (error) {
      
    }
  }
  return (
    <>
    <Header/>
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <p className="h2 mb-3 text-primary font-weight-bold">Create your Blog</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={post.title}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                className="form-control"
                id="description"
                name="description"
                value={post.description}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
          <p>For more detailed information, you can download our PDF brochure.</p>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>
            Download PDF
          </button>
          <p>Total Downloaded file size:{totalDownloadSize}KB</p>
          
          <p>API calls count: {apiCallsCount !== null ? apiCallsCount :'Loading Count...'}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;
