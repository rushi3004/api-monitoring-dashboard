import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { DataContext } from '../../../Context/DataProvider';

function Cost() {
    const { accounts } = useContext(DataContext);
    const [data, setData] = useState<any>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

   useEffect(() => {
    fetchBillData()
   },[])

    const fetchBillData = () => {
        axios.get(`http://localhost:5000/displaybill?username=${accounts[0].username}&month=${selectedMonth}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("Error in fetching Data", error);
            });
    }

    return (
        <div>
                <div>
                    <label htmlFor='month'>Select Month:</label>
                    <select id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                        {months.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                    </select>
                    <button onClick={fetchBillData} className='btn btn-dark btn-sm m-2'>Get Data</button>
                </div>

            {data.length > 0 &&
                <table className='table table-striped table-bordered table-hover'>
                    <thead className='thead-dark'>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">API Call Count</th>
                            <th scope="col">API Call Bill</th>
                            <th scope="col">Download Size</th>
                            <th scope="col">Download Size Bill</th>
                            <th scope="col">Total Bill</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: any) => (
                            <tr key={item._id}>
                                <td>{item.date}</td>
                                <td>{item.apiCallCount}</td>
                                <td>{item.apiCallBill}</td>
                                <td>{item.totalDownloadSize.toFixed(4)}</td>
                                <td>{item.downloadSizeBill.toFixed(4)}</td>
                                <td>{item.totalBill}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    );
}

export default Cost;
