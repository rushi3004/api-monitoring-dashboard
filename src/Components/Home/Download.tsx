import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { DataContext } from '../../Context/DataProvider';

function Download() {

    const [totalDownloadSize,setTotalDownloadSize] = useState<number>(0)
    const { accounts } = useContext(DataContext);

    useEffect(() =>{
        fetchtotaldownloadSize()
      })
    
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
          console.error('Error in downloading', error);

        }
      }
  return (
  
        <div className="container mt-5  justify-content-center d-flex align-items-center ">
            <div className="row">
                <div className="col-md-8 w-100 align-items-left   justify-content-left">
                    <p>For more detailed information, you can download our PDF brochure.</p>
                    <button className="btn btn-dark" onClick={handleDownloadPDF}>
                    Download PDF
                    </button>
                    <p className='mt-2'>Total Downloaded file size:{totalDownloadSize}KB</p>             
                </div>
            </div>
          </div>
   
  )
}

export default Download