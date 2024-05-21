import React, { useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Mainchart from '../chart/MainChart';
import Piechart from '../chart/PiaChart';
import { DataContext } from '../../../Context/DataProvider';
import Select from 'react-select';

const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  
function Activity() {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showMonth,setShowMonth] = useState<any>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [setSelectMonth] = useState<any>(null)
  const [setMonthlyBill] = useState<any>(null)
  const [setDailyBill] = useState<any>(null)
  const {accounts} = useContext(DataContext)

  const handleDailyBillClick = () => {
    setShowDatePicker((prev) => !prev);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if(date){
        calculatebill(date)
    }
    console.log('Selected date:', date);
  };

  const calculatebill = async(date:Date) =>{
    const username = accounts[0].username;
    const formattedDate = date.toISOString().split('T')[0]

    try {
        const response = await axios.post(`http://localhost:5000/calculateBill?date=${formattedDate}&username=${username}`)
        setDailyBill(response.data);
        console.log("response",response.data);
        
    } catch (error:any) {
        console.error("Error in calculating",error);
        
    }
  }

  const handleMonthlyBillClick = () => {
    setShowMonth((prev:any) => !prev);
  };

  const handleMonthChange = (option: any) => {
    setSelectMonth(option);
    if(option){
        calculateMonthBill(option.value)
    }
    console.log('Selected date:', option);
  };

  const calculateMonthBill = async(month:any) =>{
    const username = accounts[0].username;
    const year = new Date().getFullYear()

    try {
        const response = await axios.post(`http://localhost:5000/monthlyBill?month=${month}&year=${year}&username=${username}`);
        setMonthlyBill(response.data);
        console.log("response",response.data);
        
    } catch (error:any) {
        console.error("Error in calculating",error);
        
    }
  }
  return (
    <div>
      <div className='container mt-5'>
        <div className="row">
          <div className="col p-2">
            <button className='btn btn-dark' onClick={handleDailyBillClick}>Daily Bill</button>
            {showDatePicker && (
              <div className="mt-2">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy/MM/dd"
                  className="form-control"
                  placeholderText="Select a date"
                  inline
                />
              </div>
            )}
            <Mainchart />
          </div>
          <div className="col p-2">
            <button className='btn btn-dark' onClick={handleMonthlyBillClick}>Monthly Bill</button>
            {showMonth && (
                <div className='mt-2'>
                    <Select
                    options={monthOptions}
                    onChange={handleMonthChange}
                    className='form-control'
                    placeholder="Select Month"/>
                </div>
            )}
             <div className="d-flex justify-content-center align-items-center flex-column">
              <Piechart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activity;

