const moment = require('moment');
const DownloadStats = require('../models/download');
const Counter = require('../models/counter');
const MonthlyBill = require('../models/monthlybill');

const calculateMonthlyBill = async (req, res) => {
    try {
        const { username, month, year } = req.query;

        if (!month || !year || !username) {
            return res.status(400).json({ error: "Month, year, and username are required" });
        }

        const startDate = moment(`${year}-${month}-01`).startOf('month');
        const endDate = moment(startDate).endOf('month');
        const monthName = startDate.format("MMMM");

        console.log("start", startDate);
        console.log('end', endDate);

        let monthlyBill = await MonthlyBill.findOne({ username, month: monthName, year });
        
        // Define costs
            const apiCallCost = 5; 
            const downloadSizeCost = 0.05; 
            
            if (!monthlyBill) {
            
            const apiCallResponse = await Counter.aggregate([
                {
                    $match: {
                        username,
                        createdDate: {
                            $gte: startDate.toDate(),
                            $lte: endDate.toDate()
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalApiCalls: { $sum: "$count" }
                    }
                }
            ]);

            const apiCallCount = apiCallResponse.length > 0 ? apiCallResponse[0].totalApiCalls : 0;
            console.log("Apicallcount", apiCallCount);
            console.log("Apicallresponse", apiCallResponse);

            const downloadStats = await DownloadStats.aggregate([
                {
                    $match: {
                        username,
                        date: {
                            $gte: startDate.toDate(),
                            $lte: endDate.toDate()
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalDownloadSize: { $sum: "$fileSize" }
                    }
                }
            ]);

            const totalDownloadSize = downloadStats.length > 0 ? downloadStats[0].totalDownloadSize : 0;

            const apiCallBill = apiCallCount * apiCallCost;
            const downloadSizeBill = totalDownloadSize * downloadSizeCost;
            const totalBill = apiCallBill + downloadSizeBill;

            console.log("downloadStat", downloadStats);
            console.log("APIbill", apiCallBill);
            console.log("downloadbill", downloadSizeBill);
            monthlyBill = new MonthlyBill({
                username,
                month: monthName,
                year,
                apiCallCount,
                totalDownloadSize,
                apiCallBill,
                downloadSizeBill,
                totalBill
            });

            await monthlyBill.save();

            console.log("New monthly bill created:", monthlyBill);
        } else {
            console.log("Monthly bill already exists. Updating...");

            const apiCallResponse = await Counter.aggregate([
                {
                    $match: {
                        username,
                        createdDate: {
                            $gte: startDate.toDate(),
                            $lte: endDate.toDate()
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalApiCalls: { $sum: "$count" }
                    }
                }
            ]);

            const apiCallCount = apiCallResponse.length > 0 ? apiCallResponse[0].totalApiCalls : 0;

            console.log('Apicount', apiCallCount);

            const downloadStats = await DownloadStats.aggregate([
                {
                    $match: {
                        username,
                        date: {
                            $gte: startDate.toDate(),
                            $lte: endDate.toDate()
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalDownloadSize: { $sum: "$fileSize" }
                    }
                }
            ]);

            console.log('download', downloadStats);

            const totalDownloadSize = downloadStats.length > 0 ? downloadStats[0].totalDownloadSize : 0;

            console.log('downloadsize', totalDownloadSize);
         

            const apiCallBill = apiCallCount * apiCallCost;
            const downloadSizeBill = totalDownloadSize * downloadSizeCost;
            const totalBill = apiCallBill + downloadSizeBill;

            monthlyBill.apiCallCount = apiCallCount;
            monthlyBill.totalDownloadSize = totalDownloadSize;
            monthlyBill.apiCallBill = apiCallBill;
            monthlyBill.downloadSizeBill = downloadSizeBill;
            monthlyBill.totalBill = (totalBill).toFixed(5);
            monthlyBill.month = monthName;

            await monthlyBill.save();

            console.log("Monthly bill updated:", monthlyBill);
        }

        res.status(200).json({ totalBill: monthlyBill.totalBill });
    } catch (error) {
        console.error('Error in fetching monthly total bill', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { calculateMonthlyBill };
