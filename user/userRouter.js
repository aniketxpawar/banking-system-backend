var express = require('express');
var router = express.Router();
const userController = require('./userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hi User');
});

router.post('/login',userController.login)
router.get('/getTransactions/:userId',userController.getTransactions)
router.post('/transaction',userController.transaction)
router.get('/getBalance/:userId',userController.getBalance)
module.exports = router;
