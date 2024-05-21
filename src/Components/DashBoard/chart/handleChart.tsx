import { useState, useContext } from 'react';
import axios from 'axios';
import { DataContext } from '../../../Context/DataProvider';
import Piechart from '../chart/PiaChart';

function HandleChart() {
  const [showChart, setShowChart] = useState<any>(false);
  const [showMonthlyChart, setShowMonthlyChart] = useState<any>(false);
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const { accounts } = useContext(DataContext);

  const calculateBill = async () => {
    try {
      const date = new Date().toISOString().slice(0, 10);
      await axios.post(`http://localhost:5000/calculateBill?username=${accounts[0].username}&date=${date}`);
    } catch (error: any) {
      console.log('Error calculating bill:', error.message);
    }
  };

  const handleButtonClick = async () => {
    if (showChart) {
      setShowChart(false);
    } else {
      await calculateBill();
      setShowChart(true);
    }
  };

  const calculateMonthlyBill = async () => {
    try {
      await axios.post(`http://localhost:5000/monthlyBill?username=${accounts[0].username}&month=${month}&year=${year}`);
    } catch (error: any) {
      console.log('Error calculating bill:', error.message);
    }
  };

  const handleButtonClickMonthly = async () => {
    if (showMonthlyChart) {
      setShowMonthlyChart(false);
    } else {
      await calculateMonthlyBill();
      setShowMonthlyChart(true);
    }
  };

  return (
    <div>
      <div className='container mt-5'>
        <button onClick={handleButtonClick} className="btn btn-primary">Daily Bill</button>
        <div className="form-inline mt-2">
          <label className="mr-2">Select Month:</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="form-control mr-2">
            <option value="">--Select Month--</option>
            {[...Array(12).keys()].map(m => (
              <option key={m + 1} value={m + 1}>{new Date(0, m + 1, 0).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <label className="mr-2">Select Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="form-control mr-2">
            <option value="">--Select Year--</option>
            {[...Array(10).keys()].map(y => (
              <option key={y + new Date().getFullYear()} value={y + new Date().getFullYear()}>{y + new Date().getFullYear()}</option>
            ))}
          </select>
          <button onClick={handleButtonClickMonthly} className="btn btn-primary ml-2">Monthly Bill</button>
        </div>
        {showMonthlyChart && <Piechart />}
      </div>
    </div>
  );
}

export default HandleChart;
