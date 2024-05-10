const mongoose = require('mongoose');

const DownloadSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    name: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    createdDate:{
        type:Date
    }
});

const Download = mongoose.model('Download', DownloadSchema);

module.exports = Download;
