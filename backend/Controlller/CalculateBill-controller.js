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

        // to set format
        const parsedDate = moment(date, 'DD-MM-YYYY');
        if (!parsedDate.isValid()) {
            return res.status(400).json({ error: "Invalid date format. Please use DD-MM-YYYY." });
        }

        const formattedDate = parsedDate.format('DD-MM-YYYY');
        const startOfDay = parsedDate.startOf('day').toISOString(); // Start of the day in UTC
        const endOfDay = parsedDate.endOf('day').toISOString(); // End of the day in UTC

        console.log("Formatted Date:", formattedDate);
        console.log("Start of Day (UTC):", startOfDay);
        console.log("End of Day (UTC):", endOfDay);

        let dailyBil = await Bill.findOne({
            username,
            date: formattedDate
        });

        const apiCallCost = 5; // $5 per API call
        const downloadSizeCost = 0.05; // $0.05 per KB

        // Adjust query to use start and end of the day to match any datetime within the day
        const apiCallResponse = await Counter.findOne({ 
            username,
            createdDate: {
                $gte: new Date(startOfDay),
                $lt: new Date(endOfDay)
            }
        });

        console.log("API Call Response:", apiCallResponse);

        const apiCallCount = apiCallResponse ? apiCallResponse.count : 0;

        const downloadStats = await DownloadStats.find({
            username,
            date: { 
                $gte: new Date(startOfDay), 
                $lt: new Date(endOfDay) 
            }
        });

        let totalDownloadSize = 0;
        downloadStats.forEach(stat => {
            totalDownloadSize += stat.fileSize;
        });

        const apiCallBill = apiCallCount * apiCallCost;
        const downloadSizeBill = (totalDownloadSize * downloadSizeCost).toFixed(5);
        const totalBill = (apiCallBill + parseFloat(downloadSizeBill)).toFixed(5);

        console.log("API Call Count:", apiCallCount);
        console.log("API Call Bill:", apiCallBill);
        console.log("Total Download Size:", totalDownloadSize);
        console.log("Download Size Bill:", downloadSizeBill);
        console.log("Total Bill:", totalBill);

        if (!dailyBil) {
            const bill = new Bill({
                username,
                date: formattedDate,
                apiCallCount,
                totalDownloadSize,
                apiCallBill,
                downloadSizeBill,
                totalBill
            });

            await bill.save();

            res.status(200).json({ apiCallBill, downloadSizeBill, totalBill });
        } else {
            console.log("Daily Bill is updating");

            dailyBil.apiCallCount = apiCallCount;
            dailyBil.totalDownloadSize = totalDownloadSize;
            dailyBil.apiCallBill = apiCallBill;
            dailyBil.downloadSizeBill = downloadSizeBill;
            dailyBil.totalBill = totalBill;

            await dailyBil.save();

            res.status(200).json({ totalBill: dailyBil.totalBill });
        }
    } catch (error) {
        console.error('Error in calculating bill', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { CalBill };
