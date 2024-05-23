import React, { useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Mainchart from '../chart/MainChart';
import Piechart from '../chart/PiaChart';
import { DataContext } from '../../../Context/DataProvider';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import moment from 'moment';


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
  const [selectMonth,setSelectMonth] = useState<any>(null)
  const [monthlyBill,setMonthlyBill] = useState<any>(null)
  const [dailyBill,setDailyBill] = useState<any>(null)
  const {accounts} = useContext(DataContext)
  const navigate = useNavigate()

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
    const formattedDate = moment(date).format('DD-MM-YYYY');

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

  const calculateMonthBill = async (month: any) => {
    const username = accounts[0].username;
    const year = new Date().getFullYear();

    try {
      const response = await axios.post(`http://localhost:5000/monthlyBillCount?month=${month}&year=${year}&username=${username}`);
      setMonthlyBill(response.data);
      console.log('response', response.data);
    } catch (error: any) {
      console.error('Error in calculating', error);
    }
  };
  return (
    <>
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
                  dateFormat="DD-MM-YYYY"
                  className="form-control"
                  placeholderText="Select a date"
                  inline
                />
              </div>
            )}
            <div className={showDatePicker ? 'opacity-50' : ''}>
            <div className="d-flex justify-content-center align-items-center flex-column">
            <Mainchart selectedDate={selectedDate}/>
            </div>
            </div>
          </div>
          <div className="vr  p-0"></div>
          <div className="col p-2">
            <button className='btn btn-dark' onClick={handleMonthlyBillClick}>Monthly Bill</button>
            {showMonth && (
                <div className='mt-2'>
                    <Select
                    options={monthOptions}
                    onChange={handleMonthChange}
                    className='form-control'
                    placeholder="Select Month"
                    />
                    <div className='overlay'></div>
                </div>
            )}
            <div className={showMonth ? 'opacity-50' : ''}>
             <div className="d-flex justify-content-center align-items-center flex-column">
              <Piechart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
        <button className='btn btn-secondary mb-3 mt-3' onClick={() => navigate(-1)}>Back</button>
    </div>
    </>
  );
}

export default Activity;

