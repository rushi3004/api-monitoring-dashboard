const mongoose = require('mongoose')

const billSchema = new mongoose.Schema({
    username: { type: String, required: true },
    date: { type: String, required: true },
    apiCallCount: { type: Number, required: true },
    totalDownloadSize: {
        type: Number,
        double: true, // Specify double type
        required:true
    },
    apiCallBill: {
        type: Number,
        double: true, // Specify double type
        required:true
    },
    downloadSizeBill:{
        type: Number,
        double: true, // Specify double type
        required:true
    },
    totalBill: {
        type: Number,
        double: true, // Specify double type
        required:true
    }
})

const Bill = mongoose.model('Bill',billSchema);

module.exports = Bill