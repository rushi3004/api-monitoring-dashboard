const express = require('express');
const router = express.Router();
const { singupUser, loginUser, logoutUser } = require('../Controlller/user-controller');
const { authenticateToken } = require('../Controlller/jwt-controller')
const { createPost } = require('../Controlller/post-controller');
const { counter } = require('../Controlller/counter-controller');
const { download, getDownloadSize } = require('../Controlller/download-controller');
const { CalBill } = require('../Controlller/CalculateBill-controller');
const {calculateMonthlyBill} = require('../Controlller/CalculateMonthlyBill-controller')
const { DailyBill } = require('../Controlller/Daily_bill-controller');
const { MonthlyBill } = require('../Controlller/Monthly-bill-controller');
const { display_bill } = require('../Controlller/Display_Bill');


router.post('/login', loginUser);
router.post('/signup', singupUser);
router.post('/logout',logoutUser); 
router.post('/create',authenticateToken,createPost)
router.get('/counter',counter)
router.get('/download',download)
router.get('/totalFileSize', getDownloadSize);
router.post('/calculateBill',CalBill)
router.post('/monthlyBill',calculateMonthlyBill)
router.get('/bill-array',DailyBill)
router.get('/monthly_bill',MonthlyBill)
router.get('/displaybill', display_bill)


module.exports = router;
