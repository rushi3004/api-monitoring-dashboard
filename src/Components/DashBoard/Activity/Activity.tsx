import React, { useContext, useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Mainchart from '../chart/MainChart';
import Piechart from '../chart/PiaChart';
import { DataContext } from '../../../Context/DataProvider';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [showMonth, setShowMonth] = useState<any>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectMonth, setSelectMonth] = useState<any>(null);
  const [monthlyBill, setMonthlyBill] = useState<any>(null);
  const [dailyBill, setDailyBill] = useState<any>(null);
  const { accounts } = useContext(DataContext);
  const navigate = useNavigate();

  const isFirstRender = useRef(true); // for render one time

  useEffect(() => {
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (selectedDate) {
      calculatebill(selectedDate);
    }
    if (selectMonth) {
      calculateMonthBill(selectMonth);
    }
  }, [selectedDate, selectMonth]);

  const handleDailyBillClick = () => {
    setShowDatePicker((prev) => !prev);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  const calculatebill = async (date: Date) => {
    const username = accounts[0].username;
    const formattedDate = moment(date).format('DD-MM-YYYY');

    try {
      const response = await axios.post(`http://localhost:5000/calculateBill?date=${formattedDate}&username=${username}`);
      setDailyBill(response.data);
      console.log("response", response.data);
      console.log("totalBill", response.data.totalBill);

      //notification
      if (response.data.totalBill > 50) {
        toast.error('You are out of limit! Please check your usage.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
      }
    } catch (error: any) {
      console.error("Error in calculating", error);

    }
  };

  const handleMonthlyBillClick = () => {
    setShowMonth((prev: any) => !prev);
  };

  const handleMonthChange = (option: any) => {
    if (option) {
      const formattedMonth = moment(option.value, 'MM').format('MM');
      setSelectMonth(formattedMonth);
      calculateMonthBill(formattedMonth);
    } else {
      setSelectMonth(null);
    }
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
      <ToastContainer />
      <div>
        <div className='container mt-5'>
          <div className="row">
            <div className="col p-2">
              <button className='btn btn-dark d-flex m-auto' onClick={handleDailyBillClick}>Daily Bill</button>
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
              <div className='border  border-dark rounded p-2 mt-2'>
              <div className={showDatePicker ? 'opacity-50' : ''}>
              <div className="d-flex justify-content-center align-items-center flex-column">
                  <Mainchart selectedDate={selectedDate}/>
              </div>
              </div>
              </div>
            </div>
          
            <div className="col p-2">
              <button className='btn btn-dark d-flex m-auto' onClick={handleMonthlyBillClick}>Monthly Bill</button>
              {showMonth && (
                <div className='mt-2'>
                  <Select
                    options={monthOptions}
                    onChange={handleMonthChange}
                    className='form-control'
                    placeholder="Select Month"
                  />
                </div>
              )}
              <div className='border  border-dark rounded p-2 mt-2'>
              <div className={showMonth ? 'opacity-50' : ''}>
                <div className="d-flex justify-content-center align-items-center flex-column">
                  <Piechart />
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button className='btn btn-secondary mb-3 mt-5' onClick={() => navigate(-1)}>Back</button>
      </div>
    </>
  );
}

export default Activity;
