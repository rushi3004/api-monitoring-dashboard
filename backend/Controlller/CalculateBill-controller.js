const moment = require('moment')
const DownloadStats = require('../models/download')
const Counter = require('../models/counter')
const Bill = require('../models/CalculateBill')

const CalBill = async (req, res) => {
    try {
        const { username, date } = req.query;

        if (!date || !username) {
            return res.status(400).json({ error: "Date and username are required" });
        }

        // Define costs
        const apiCallCost = 5; // $5 per API call
        const downloadSizeCost = 0.05; // $0.5 per KB

        // Get API call count
        const formattedDate = new Date(date).toISOString().slice(0, 10);
        const apiCallResponse = await Counter.findOne({ createdDate: formattedDate, username });
        const apiCallCount = apiCallResponse ? apiCallResponse.count : 0;

        // Get total download size
        const downloadStats = await DownloadStats.find({
            username: username,
            date: { $gte: new Date(formattedDate), $lt: new Date(formattedDate).setDate(new Date(formattedDate).getDate() + 1) }
        });

        let totalDownloadSize = 0;
        downloadStats.forEach(stat => {
            totalDownloadSize += stat.fileSize;
        });

        // Calculate bill
        const apiCallBill = apiCallCount * apiCallCost;
        const downloadSizeBill = totalDownloadSize * downloadSizeCost;
        const totalBill = apiCallBill + downloadSizeBill;

        console.log("apiCallBill",apiCallBill);
        console.log("download",downloadSizeBill);
        // Save bill to database
        const bill = new Bill({
            username,
            date: formattedDate,
            apiCallCount,
            totalDownloadSize,
            apiCallBill: apiCallBill * apiCallCost,
            downloadSizeBill: downloadSizeBill * downloadSizeCost,
            totalBill: totalBill * (apiCallCost + downloadSizeCost)
        });
        await bill.save();

        res.status(200).json({ apiCallBill, downloadSizeBill, totalBill });
    } catch (error) {
        console.error('Error in calculating bill', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




module.exports = {CalBill}