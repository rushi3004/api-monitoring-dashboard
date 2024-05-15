const mongoose = require('mongoose')

const MonthlyBillSchema =new mongoose.Schema({
    username: { type: String, required: true },
    month:{type:String,required:true},
    year:{type:Number,required:true},
    totalBill: { type: Number, required: true }
})

const Monthlybill = mongoose.model('Monthlybill',MonthlyBillSchema)

module.exports = Monthlybill