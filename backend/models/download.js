const mongoose = require('mongoose');

const DownloadSchema = new mongoose.Schema({
    username:String,
    date:Date,
    fileSize: {
        type: Number,
        double: true  // Specify double type
    }
});

const DownloadStats = mongoose.model('DownloadStats', DownloadSchema);

module.exports = DownloadStats;
