import React, { useContext, useState,useEffect } from 'react'
import { DataContext } from '../../../Context/DataProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import Footer from '../../Footer';

interface Post {
    title: string;
    description: string;
    image:File | null;
    username?:String
  }
  
  interface CounterResponse {
    count: number;
  }
  
  const initialPost: Post = {
    title: '',
    description: '',
    image:null
  };
 
function CreatePost() {
    const [apiCallsCount, setApiCallsCount] = useState<number>(0);
    const [post, setPost] = useState<Post>(initialPost);
    const navigate = useNavigate()
    const { accounts } = useContext(DataContext);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value , files } = e.target;
    if(files){
      setPost((prevPost) => ({...prevPost,image:files[0]}))
    }else{
    setPost((prevPost) => ({ ...prevPost, [name]: value }));
  }};

  const fetchApiCallCount = async () => {
    try {
      const username = accounts[0].username
      const currentDate = new Date().toISOString().slice(0,10)
      const response = await fetch(`http://localhost:5000/counter?date=${currentDate}&username=${username}`);

      
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
  },[])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiCallsCount((prevApiCallsCount) => prevApiCallsCount + 1);

    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) return;

    const {title,description,image} = post;
    const { username } = accounts[0];

    const formData = new FormData();
    formData.append('title',title);
    formData.append('description',description);
    formData.append('username',username);
    formData.append('image',image || '');

    try {
      const response = await axios.post(
        'http://localhost:5000/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type':'multipart/form-data'
          },
        }
      );

      console.log('Post saved:', response.data);
      setPost(initialPost);
      navigate('/')
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };
  return (
    <>
  <Header/>
  <div className="container mt-3 d-flex justify-content-center align-items-center">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '600px' }}>
        <h2 className="text-center text-dark font-weight-bold mb-4">Create your Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
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
            <label htmlFor="description" className="form-label">Description</label>
            <input
              className="form-control"
              id="description"
              name="description"
              value={post.description}
              onChange={handleChange}
            />
          </div> 
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Image</label>
            <input
              type="file"
              className="form-control"
              id="image"
              name="image"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">Submit</button>
        </form>
        <p className="mt-3 text-center text-uppercase">API calls count: {apiCallsCount !== null ? apiCallsCount : 'Loading Count...'}</p>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default CreatePost


