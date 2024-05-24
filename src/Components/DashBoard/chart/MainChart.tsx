import axios from "axios";
import { useState,useEffect,useContext} from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables} from 'chart.js';
import { DataContext } from "../../../Context/DataProvider";
import moment from "moment";

Chart.register(...registerables);

interface BillData {
  date:String,
  totalBill:number
}

interface MainChartProp{
  selectedDate : Date | null
}

function Mainchart({selectedDate}:MainChartProp) {


  const [dinamicData, setDianamicData] = useState<any>(null);
  const {accounts} = useContext(DataContext)

  useEffect(() =>{
  const fetchData = async () => {
    if (selectedDate) {
      const username = accounts[0].username;
      const formattedDate = moment(selectedDate).format('DD-MM-YYYY');

      const axiosConfig = {
        headers: {
          Accept: 'application/json'
        }
      };

      try {
        const response = await axios.get<BillData[]>(`http://localhost:5000/bill-array?username=${username}&date=${formattedDate}`, axiosConfig);
        if (response.data.length > 0) {
          setDianamicData({
            labels: response.data.map((individualData) => individualData.date),
            datasets: [{
              label: 'TotalBill',
              data: response.data.map((individualData) => individualData.totalBill)
            }]
          });
        }
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  fetchData();
}, [selectedDate, accounts]);
  console.log("data",dinamicData);
  return (
    <>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', width:'500px'}}>
      {dinamicData !== null ? (
        <Line data={dinamicData}/>
      ) : "Loading data is null...."}
      </div>
    </>
  );
}

export default Mainchart;
