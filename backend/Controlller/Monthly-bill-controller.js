const Month = require('../models/monthlybill')

const MonthlyBill = async (req,res) =>{
    try {
        const { username} = req.query;

        if(!username){
            return res.status(400).json({error:'Username is missing'})
        }

        const bills = await Month.find({username},{
            month:1,totalBill:1 , _id:0
        });

        if(!bills || bills.length === 0){
            return res.status(404).json({error:"No bill found for this username"})
        }

        const result = bills.map(bill =>({month:bill.month, totalBill:bill.totalBill}))

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in fetching bills",error);
        res.status(500).json({error:"Internal server Error"})
    }
}

module.exports = {MonthlyBill}