const Bill = require('../models/CalculateBill'); // Adjust the path to where your billModel file is located

async function getBillDetailsByMonthAndUsername(username,  month) {
    // Ensure month and year are correctly formatted
    const monthStr = month.toString().padStart(2, '0');

    // Create a regex to match the month and year in the DD-MM-YY format
    const dateRegex = new RegExp(`^\\d{2}-${monthStr}`);

    try {
        const bills = await Bill.find({
            username: username,
            date: { $regex: dateRegex }
        }).exec();
        
        return bills;
    } catch (error) {
        console.error('Error fetching bills:', error);
        throw error;
    }
}

const display_bill =  async (req, res) => {
    const { username,  month } = req.query;
    console.log(req.query);

    if (!username  || !month) {
        return res.status(400).send('username, year, and month are required');
    }

    try {
        const bills = await getBillDetailsByMonthAndUsername(username, parseInt(month));
        res.json(bills);
    } catch (error) {
        res.status(500).send('Error fetching bills');
    }
};


module.exports = {display_bill}

