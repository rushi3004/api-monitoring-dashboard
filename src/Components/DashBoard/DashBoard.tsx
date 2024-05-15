// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { Line, Pie } from 'react-chartjs-2';
// import { DataContext } from '../../Context/DataProvider';

// const Dashboard: React.FC = () => {
//   const [dailyBillData, setDailyBillData] = useState<any>({});
//   const [monthlyBillData, setMonthlyBillData] = useState<any>({});
//   const { accounts } = useContext(DataContext);

//   useEffect(() => {
//     fetchDailyBillData();
//     fetchMonthlyBillData();
//   }, []);

//   const fetchDailyBillData = async () => {
//     const username = accounts[0].username;
//     const date = new Date().toISOString().slice(0, 10);
//     try {
//       const response = await axios.get(`http://localhost:5000/calculateBill?username=${username}&date=${date}`);
//       setDailyBillData(response.data);
//     } catch (error) {
//       console.error('Error fetching daily bill data:', error);
//     }
//   };

//   const fetchMonthlyBillData = async () => {
//     const username = accounts[0].username;
//     const date = new Date();
//     const month = date.getMonth() + 1; // getMonth() returns zero-based month
//     const year = date.getFullYear();

//     try {
//       const response = await axios.get(`http://localhost:5000/calculateBill?username=${username}&month=${month}&year=${year}`);
//       setMonthlyBillData(response.data);
//     } catch (error) {
//       console.error('Error fetching monthly bill data:', error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row">
//         <div className="col-md-6">
//           <h2>Daily Bill</h2>
//           {Object.keys(dailyBillData).length > 0 && <Line data={dailyBillData} />}
//         </div>
//         <div className="col-md-6">
//           <h2>Monthly Bill</h2>
//           {Object.keys(monthlyBillData).length > 0 && <Pie data={monthlyBillData} />}
//         </div>
//       </div>
//       <div className="row mt-5">
//         <div className="col-md-12">
//           <div className="btn-group" role="group" aria-label="Dashboard buttons">
//             <button type="button" className="btn btn-primary">Cost</button>
//             <button type="button" className="btn btn-primary">Activity</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect } from 'react'
import { DisplayBillChart } from './chart/MainChart'

const Dashboard: React.FC = () => {

    useEffect(() => {
        // Call displayBillChart function with appropriate parameters
        DisplayBillChart('username', '2024-05-01', '2024-05-15');
    }, []); // Empty dependency array ensures the effect runs only once after the initial render

    return (
        <div>
            <h1>Dashboard</h1>
            <canvas id="chart"></canvas>
        </div>
    );
};

export default Dashboard