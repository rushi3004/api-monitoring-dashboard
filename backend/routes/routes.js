const express = require('express');
const router = express.Router();
const { singupUser, loginUser, logoutUser } = require('../Controlller/user-controller');
const { authenticateToken } = require('../Controlller/jwt-controller')
const { createPost } = require('../Controlller/post-controller');
const { counter } = require('../Controlller/counter-controller');
const { download, getDownloadSize } = require('../Controlller/download-controller');
const { CalBill } = require('../Controlller/CalculateBill-controller');
const {calculateMonthlyBill} = require('../Controlller/CalculateMonthlyBill-controller')

router.post('/login', loginUser);
router.post('/signup', singupUser);
router.post('/logout',logoutUser); 
router.post('/create',authenticateToken,createPost)
router.get('/counter',counter)
router.get('/download',download)
router.get('/totalFileSize', getDownloadSize);
router.get('/calculateBill',CalBill)
router.get('/monthlyBill',calculateMonthlyBill)



module.exports = router;
