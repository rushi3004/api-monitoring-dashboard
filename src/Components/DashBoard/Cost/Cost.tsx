import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { DataContext } from '../../../Context/DataProvider';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Cost() {
    const { accounts } = useContext(DataContext);
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const navigate = useNavigate();

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
        fetchBillData();
    }, [selectedMonth]);

    const fetchBillData =async () => {
        await axios.get(`http://localhost:5000/displaybill?username=${accounts[0].username}&month=${selectedMonth}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("Error in fetching Data", error);
            });
    };

    

    const exportToPDF = () => {
        const doc = new (jsPDF as any)();

        const topMargin = 20;
        doc.text('INVOICE', 10, topMargin);

        const tableTopMargin = topMargin + 10;
        doc.autoTable({
            head: [['Date', 'API Call Count', 'API Call Bill', 'Download Size', 'Download Size Bill', 'Total Bill']],
            body: data.map((item:any) => [item.date, item.apiCallCount, item.apiCallBill, item.totalDownloadSize.toFixed(4), item.downloadSizeBill.toFixed(4), item.totalBill]),
            startY : tableTopMargin
        });
        doc.save('monthly_cost_report.pdf');
    };

    return (
        <>
            <div className='mt-5'>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                <div>
                    <label htmlFor='month' style={{marginRight:"10px"}}>Select Month:</label>
                    <select style={{marginRight:"15px"}}  id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                        {months.map(month => (
                            <option key={month.value} value={month.value}  >{month.label}</option>
                        ))}
                    </select>
                    <button onClick={fetchBillData} className='btn btn-dark btn-sm'>Get Data</button>
                </div>
                <div>
                    <button onClick={exportToPDF} className='btn btn-success btn-sm'>Export to PDF</button>
                </div>
                </div>
                {data.length > 0 &&
                    <>
                        <table className='table table-striped table-bordered table-hover mt-3'>
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
                    </>
                }
            </div>
            <div>
                <button className='btn btn-secondary mb-3 mt-3' onClick={() => navigate(-1)}>Back</button>
            </div>
        </>
    );
}

export default Cost;
