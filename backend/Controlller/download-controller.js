const DownloadStats = require('../models/download')
const moment = require('moment')

const download = async (req,res) => {
    try {
        const {username} = req.query;
        const fileSize = getFileSize('./apifile.pdf');
        const currentDate = moment().toISOString();

        let downloadStats = await DownloadStats.findOne({ username: username, date: { $gte: moment().startOf('day').toISOString(), $lt: moment().endOf('day').toISOString() } });

        if(downloadStats){
            downloadStats.fileSize = parseFloat(downloadStats.fileSize) + parseFloat(fileSize); 
        }else{
            downloadStats = new DownloadStats({
                username:username,
                fileSize: parseFloat(fileSize),
            date:currentDate  
            })
        }
        await downloadStats.save();

        console.log('Download Data saved',downloadStats);
    } catch (error) {
        console.error('Error in saving',error);
    }
        res.setHeader('Content-Disposition', 'attachment; filename="apifile.pdf"');
    res.download('./apifile.pdf','apifile.pdf',(err) => {
        if(err){
            console.error('Error in sending file',err);
            res.status(500).send('Error downloading file')
        }else{
            console.log('File sent');
        }
    })
}

function getFileSize(filePath){
    const fs = require('fs')
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size
    console.log(stats.size);
    const fileSizeInGB = fileSizeInBytes/(1024 * 1024* 1024)
    return fileSizeInGB.toFixed(5)
}

const getDownloadSize =  async (req, res) => {
    try {
        const {username,date} = req.query;

        if(!date || !username){
            return res.status(200).json({error:'Date and username required'})
        }

        const formattedDate = new Date(date).toISOString().slice(0,10)

        const downloadStats = await DownloadStats.find({
            username:username,
            date:{ $gte: new Date(formattedDate), $lt: new Date(formattedDate).setDate(new Date(formattedDate).getDate() + 1) }
        })

        let totalFileSize = 0;

        downloadStats.forEach(stat => {
            totalFileSize += parseFloat(stat.fileSize); 
        });

        res.status(200).json({totalFileSize:totalFileSize})
    } catch (error) {
        console.error('Error in fetching size',error);
        res.status(500).json({error:'Internal error'})
    }
}
module.exports = {download,getDownloadSize}