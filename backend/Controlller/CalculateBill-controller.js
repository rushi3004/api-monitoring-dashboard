const moment = require('moment');
const DownloadStats = require('../models/download');
const Counter = require('../models/counter');
const Bill = require('../models/CalculateBill');

const CalBill = async (req, res) => {
    try {
        const { username, date } = req.query;

        if (!date || !username) {
            return res.status(400).json({ error: "Date and username are required" });
        }
        const formattedDate = moment(date).format('DD-MM-YY');
        const isoDate = moment(date).toISOString();


        let dailyBil = await Bill.findOne({
            username,date:formattedDate
        })
        const apiCallCost = 5; // $5 per API call
        const downloadSizeCost = 0.05; // $0.05 per KB

        if(!dailyBil){
       
        const apiCallResponse = await Counter.findOne({ createdDate: isoDate, username });
        const apiCallCount = apiCallResponse ? apiCallResponse.count : 0;

        const downloadStats = await DownloadStats.find({
            username: username,
            date: { $gte: new Date(isoDate), $lt: new Date(isoDate).setDate(new Date(isoDate).getDate() + 1) }
        });

        let totalDownloadSize = 0;
        downloadStats.forEach(stat => {
            totalDownloadSize += stat.fileSize;
        });

        const apiCallBill = apiCallCount * apiCallCost;
        const downloadSizeBill = (totalDownloadSize * downloadSizeCost).toFixed(5);
        const totalBill = (apiCallBill + downloadSizeBill);

        console.log("apiCallBill", apiCallBill);
        console.log("download", downloadSizeBill);

        const bill = new Bill({
            username,
            date: formattedDate,
            apiCallCount,
            totalDownloadSize,
            apiCallBill: apiCallBill,
            downloadSizeBill: downloadSizeBill,
            totalBill: (totalBill)
        });

        await bill.save();

        res.status(200).json({ apiCallBill, downloadSizeBill, totalBill });
    }else{

        console.log("Daily Bill is updating");

        const apiCallResponse = await Counter.findOne({ createdDate: isoDate, username });
        const apiCallCount = apiCallResponse ? apiCallResponse.count : 0;

        const downloadStats = await DownloadStats.find({
            username: username,
            date: { $gte: new Date(isoDate), $lt: new Date(isoDate).setDate(new Date(isoDate).getDate() + 1) }
        });

        let totalDownloadSize = 0;
        downloadStats.forEach(stat => {
            totalDownloadSize += stat.fileSize;
        });

        const apiCallBill = apiCallCount * apiCallCost;
        const downloadSizeBill = (totalDownloadSize * downloadSizeCost).toFixed(5);
        const totalBill = apiCallBill + downloadSizeBill;

        console.log("apiCallBill", apiCallBill);
        console.log("download", downloadSizeBill);

        dailyBil.apiCallCount = apiCallCount;
        dailyBil.totalDownloadSize= totalDownloadSize;
        dailyBil.apiCallBill = apiCallBill;
        dailyBil.downloadSizeBill = downloadSizeBill;
        dailyBil.totalBill = (totalBill);
        dailyBil.date = formattedDate;
        

        await dailyBil.save();

        res.status(200).json({ totalBill:dailyBil.totalBill });

    }
    } catch (error) {
        console.error('Error in calculating bill', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { CalBill };
