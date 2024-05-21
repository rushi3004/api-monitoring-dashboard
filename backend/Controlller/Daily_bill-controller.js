const Bill = require('../models/CalculateBill')

const DailyBill = async (req, res) => {
    try {
        
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: "Username parameter is missing" });
        }

        const bills = await Bill.find({ username }, { date: 1, totalBill: 1, _id: 0 }).sort({date:1});

        if (!bills || bills.length === 0) {
            return res.status(404).json({ error: "No bills found for the given username" });
        }

        const result = bills.map(bill => ({ date: bill.date, totalBill: bill.totalBill }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in fetching bills:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {DailyBill}