const Counter = require('../models/counter')

const counter = async (req,res) => {
    try {
       const {date} = req.query;

       if(!date){
        return res.status(200).json({error:"Date is required"})
       }

       const formattedDate = new Date(date).toISOString().slice(0,10)
       const counters = await Counter.findOne({createdDate:formattedDate});

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