// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { Line } from "react-chartjs-2";

// interface BillData {
//   date: string,
//   totalBill: number
// }

// function App() {
//   const [dynamicData, setDynamicData] = useState<any>({
//     labels: [],
//     datasets: [{
//       label: 'totalBill',
//       data: []
//     }]
//   });

//   useEffect(() => {
//     const axiosConfig = {
//       headers: {
//         Accept: 'application/json'
//       }
//     };

//     axios.get<BillData[]>('http://localhost:5000/bill-array', axiosConfig)
    
//     .then((res) => {
//         console.log("eeee");
//         console.log("urldata", res.data);
//         if (res.data.length > 0) {
//           setDynamicData({
//             labels: res.data.map((individualData) => individualData.date),
//             datasets: [{
//               label: 'totalBill',
//               data: res.data.map((individualData) => individualData.totalBill)
//             }]
//           });
//         }
//       })
//       .catch((err) => {
//         console.log(err.message);
//       });
//   }, []);

//   console.log("data", dynamicData);

//   return (
//     <div className="Wrapper">
//       {dynamicData ? (
//         <Line data={dynamicData}/>
//       ) : "Loading data is null...."}
//     </div>
//   );
// }

// export default App;

import axios from "axios";
import { useState,useEffect} from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);

interface BillData {
  date:String,
  totalBill:number
}

function App() {

  const [dinamicData, setDianamicData] = useState<any>(null);

  useEffect(() =>{
    const axiosConfig = {
      headers:{
        Accept:'application/json'
      }
    }
    axios.get<BillData[]>(`http://localhost:5000/bill-array`,axiosConfig).then((res)=>{
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