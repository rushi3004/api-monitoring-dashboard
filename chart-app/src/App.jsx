import axios from "axios";
import { useState,useEffect} from "react";
import { Line } from "react-chartjs-2";
import React from "react";
import {Chart as Chartjs} from 'chart.js/auto' 



function App() {

  const [dinamicData, setDianamicData] = useState(null); 
  

  useEffect(() =>{
    const axiosConfig = {
      headers:{
        Accept:'application/json'
      }
    }
    axios.get(`http://localhost:5000/bill-array`,axiosConfig).then((res)=>{
       console.log("urldata",res.data);
      if(res.data.length > 0){
        setDianamicData({
          labels:res.data.map((individualData)=> individualData.date),
          datasets:[{
            label:'totalBill',
            data:res.data.map((individualData)=> individualData.totalBill)
          }]
        })
      }
    })
    .catch((err)=>{
      console.log(err.message);
    })
  },[])
  console.log("data",dinamicData);
  return (
    <div className="Wrapper">
      {dinamicData !== null ? (
        <Line data={dinamicData}/>
      ) : "Loading data is null...."}
    </div>
  );
}

export default App;
