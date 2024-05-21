import axios from "axios";
import { useState,useEffect,useContext} from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables} from 'chart.js';
import { DataContext } from "../../../Context/DataProvider";


Chart.register(...registerables);

interface BillData {
  date:String,
  totalBill:number
}

function Mainchart() {


  const [dinamicData, setDianamicData] = useState<any>(null);
  const {accounts} = useContext(DataContext)

  useEffect(() =>{
    const axiosConfig = {
      headers:{
        Accept:'application/json'
      }
    }
    axios.get<BillData[]>(`http://localhost:5000/bill-array?username=${accounts[0].username}`,axiosConfig).then((res)=>{
       console.log("urldata",res.data);
      if(res.data.length > 0){
        
        setDianamicData({
          labels:res.data.map((individualData)=> (individualData.date)),
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
  },[accounts])
  console.log("data",dinamicData);
  return (
    <>
      {dinamicData !== null ? (
        <Line data={dinamicData} style={{height:"100px"}}/>
      ) : "Loading data is null...."}
    </>
  );
}

export default Mainchart;



// import axios from "axios";
// import { useState, useContext } from "react";
// import { Line } from "react-chartjs-2";
// import { Chart, registerables } from 'chart.js';
// import { DataContext } from "../../../Context/DataProvider";

// Chart.register(...registerables);

// interface BillData {
//   date: String,
//   totalBill: number
// }

// function Mainchart() {
//   const [dinamicData, setDianamicData] = useState<any>(null);
//   const [showChart, setShowChart] = useState(false);
//   const { accounts } = useContext(DataContext);

//   const calculateBill = async () => {
//     try {

//       const date = new Date().toISOString().slice(0,10)
//       await axios.post(`http://localhost:5000/calculateBill?username=${accounts[0].username}&date=${date}`);
//     } catch (error:any) {
//       console.log('Error calculating bill:', error.message);
//     }
//   };

//   const fetchBillData = async () => {
//     const axiosConfig = {
//       headers: {
//         Accept: 'application/json'
//       }
//     };
//     try {
//       const res = await axios.get<BillData[]>(`http://localhost:5000/bill-array?username=${accounts[0].username}`, axiosConfig);
//       console.log("urldata", res.data);
//       if (res.data.length > 0) {
//         setDianamicData({
//           labels: res.data.map((individualData) => (individualData.date)),
//           datasets: [{
//             label: 'totalBill',
//             data: res.data.map((individualData) => individualData.totalBill)
//           }]
//         });
//               }
//     } catch (error:any) {
//       console.log('Error fetching bill data:', error.message);
//     }
//   };

//   // const handleButtonClick = async () => {
//   //   if (showChart) {
//   //     setShowChart(false);
//   //   } else {
//   //     await calculateBill();
//   //     await fetchBillData();
//   //     setShowChart(true);
//   //   }
//   // };

//   return (
//     <>
//       {/* <button onClick={handleButtonClick} className="btn btn-primary mb-3">Daily Bill</button> */}
//     <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: "400px" }}>
//       {
//         dinamicData !== null ? (
//           <Line data={dinamicData} />
//         ) : "Loading data is null...."
//       }
//     </div>
//     </>
//   );
// }

// export default Mainchart;

