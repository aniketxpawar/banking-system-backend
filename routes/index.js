var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/users',require('../user/userRouter'))
router.use('/bankers',require('../banker/bankerRouter'))

module.exports = router;
