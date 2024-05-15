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

        console.log("start", startDate);
        console.log('end', endDate);

        // Find existing monthly bill for the same user and month
        let monthlyBill = await MonthlyBill.findOne({ username, month, year });

        if (!monthlyBill) {
            // If monthly bill doesn't exist, calculate and create a new one

            // Define costs
            const apiCallCost = 5; // $5 per API call
            const downloadSizeCost = 0.05; // $0.05 per KB

            // Get API call count
            const apiCallResponse = await Counter.aggregate([
                {
                    $match: {
                        username,
                        // date: {
                        //     $gte: startDate.toDate(),
                        //     $lte: endDate.toDate()
                        // }
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

            // Get total download size
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
            
            // Calculate bill
            const apiCallBill = apiCallCount * apiCallCost;
            const downloadSizeBill = totalDownloadSize * downloadSizeCost;
            const totalBill = apiCallBill + downloadSizeBill;

            // Save new monthly bill to database
            monthlyBill = new MonthlyBill({
                username,
                month,
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
            // If monthly bill exists, update its fields
            // Add logic here to update other fields if needed
            console.log("Monthly bill already exists. Updating...");
        
            // Fetch the latest API call count from Counter collection
            const apiCallResponse = await Counter.aggregate([
                {
                    $match: {
                        username,
                        
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
            
            console.log('Apicount',apiCallCount);

            // Fetch the latest total download size from DownloadStats collection
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
            
            console.log('download',downloadStats);

            const totalDownloadSize = downloadStats.length > 0 ? downloadStats[0].totalDownloadSize : 0;

            console.log('downloadsize',totalDownloadSize);
            const apiCallCost = 5; // $5 per API call
            const downloadSizeCost = 0.05; // $0.05 per KB
            // Recalculate the total bill based on the latest data
            const apiCallBill = apiCallCount * apiCallCost;
            const downloadSizeBill = totalDownloadSize * downloadSizeCost;
            const totalBill = apiCallBill + downloadSizeBill;
        
            // Update the existing monthly bill document
            monthlyBill.apiCallCount = apiCallCount;
            monthlyBill.totalDownloadSize = totalDownloadSize;
            monthlyBill.apiCallBill = apiCallBill;
            monthlyBill.downloadSizeBill = downloadSizeBill;
            monthlyBill.totalBill = totalBill;
        
            // Save the updated monthly bill to database
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
