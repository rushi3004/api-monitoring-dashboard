const express = require('express');
const router = express.Router();
const { singupUser, loginUser, logoutUser } = require('../Controlller/user-controller');
const { createPost } = require('../Controlller/post-controller')
const { authenticateToken } = require('../Controlller/jwt-controller')
const {counter} = require('../Controlller/counter-controller')


router.post('/login', loginUser);
router.post('/signup', singupUser);
router.post('/logout',logoutUser); 
router.post('/create',authenticateToken,createPost);
router.get('/counter',counter)

router.get('/download',(req,res) =>{
    res.download('./apifile.pdf')
})


module.exports = router;
