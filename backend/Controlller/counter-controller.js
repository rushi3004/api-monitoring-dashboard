const Counter = require('../models/counter')

const counter =async (req,res) => {
    try {
       const {date,username} = req.query;

       if(!date || !username){
        return res.status(200).json({error:"Date is required and username required"})
       }

       const formattedDate = new Date(date).toISOString().slice(0,10)
       const counters = await Counter.findOne({createdDate:formattedDate,username});

       if(counters){
        res.status(200).json({count:counters.count})
       }else{
        res.status(200).json({count:0})
       }
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }
}
module.exports = {counter}