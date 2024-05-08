// // HomePage.tsx

// import React from 'react';
// import axios from 'axios';
// import fileDownload from 'js-file-download';

// const HomePage: React.FC = () => {

//   // Function to handle PDF download
//    const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     axios({
//       url: 'http://localhost:5000/download',
//       method: 'GET',
//       responseType: 'blob'
//     }).then((res) => { // Corrected syntax here
//      console.log("Downloading");
     
//       fileDownload(res.data, 'apifile.pdf');
//     });
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row">
//         <div className="col-md-8 offset-md-2">
//           <h1>Welcome to Our Website</h1>
//           <p>
//           A blog a truncation of "weblog" is an informational website consisting of discrete, often informal diary-style text entries (posts). Posts are typically displayed in reverse chronological order so that the most recent post appears first, at the top of the web page. In the 2000s, blogs were often the work of a single individual, occasionally of a small group, and often covered a single subject or topic. In the 2010s, "multi-author blogs" (MABs) emerged, featuring the writing of multiple authors and sometimes professionally edited. MABs from newspapers, other media outlets, universities, think tanks, advocacy groups, and similar institutions account for an increasing quantity of blog traffic. The rise of Twitter and other "microblogging" systems helps integrate MABs and single-author blogs into the news media. Blog can also be used as a verb, meaning to maintain or add content to a blog.
//           </p>
//           <p>
//             For more detailed information, you can download our PDF brochure.
//           </p>
//           <button className="btn btn-primary" onClick={handleDownload}>Download PDF</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;


import React, { useState,useContext ,useEffect} from 'react';
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
const HomePage: React.FC = () => {
  const [totalFileSize, setTotalFileSize] = useState<number>(0); // State to store total file size
  const [apiCallsCount, setApiCallsCount] = useState<number>(0); // State to store API calls count
  const [post, setPost] = useState(initialPost);
  const navigate = useNavigate()
  // const { accounts } = useContext(DataContext) || { accounts: [], setAccounts: () => {} };
  const { accounts } = useContext(DataContext); // 


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


  useEffect(() => {
    if (accounts && accounts.length > 0) {
      setPost({ ...post, username: accounts[0].username });
    }
  }, [accounts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setApiCallsCount(apiCallsCount + 1);

    e.preventDefault();
    const accessToken = await sessionStorage.getItem('accessToken');

    if (accessToken) {
      const { username } = accounts[0];

      try {
        const response = await axios.post('http://localhost:5000/create', {
          ...post,
          username: username,
          createdBy: new Date()
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        console.log('Post saved:', response.data);
        // setApiCallsCount(apiCallsCount + 1);
        setPost(initialPost); // Reset the form fields after successful submission
      } catch (error) {
        console.error('Error saving post:', error);
      }
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
          <input type="text" className="form-control" id="title" 
          value={post.title}
          name='title' onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input className="form-control" id="description"  name="description" 
          value={post.description}
          onChange={handleChange}/>
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

export default HomePage;
