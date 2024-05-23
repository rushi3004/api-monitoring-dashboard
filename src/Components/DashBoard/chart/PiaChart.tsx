
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DataContext } from "../../../Context/DataProvider";

Chart.register(...registerables, ChartDataLabels);

interface BillData {
  month: string,
  totalBill: number
}

function Piechart() {
  const [dinamicData, setDianamicData] = useState<any>(null);
  const { accounts } = useContext(DataContext);

  useEffect(() => {
    const axiosConfig = {
      headers: {
        Accept: 'application/json'
      }
    };

    axios.get<BillData[]>(`http://localhost:5000/monthly_bill?username=${accounts[0].username}`, axiosConfig)
      .then((res) => {
        console.log("urldata", res.data);
        if (res.data.length > 0) {
          setDianamicData({
            labels: res.data.map((individualData) => individualData.month),
            datasets: [{
             label: 'Total Bill',
              data: res.data.map((individualData) => individualData.totalBill),
              backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB', '#FFCE56'
              ]
            }]
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [accounts]);

  console.log("data", dinamicData);

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px'}}>
      {dinamicData !== null ? (
        <Pie 
          data={dinamicData} 
          options={{
            plugins: {
              datalabels: {
                color: '#fff',
                formatter: (value, context) => {
                  const labels = context.chart.data.labels;
                  return labels ? labels[context.dataIndex] : '';
                },
                font: {
                  weight: 'bold',
                  size: 10
                }
              }
            }
          }} 
         
        />
      ) : "Loading data is null...."}
    </div>
  );
}

export default Piechart;

