var express = require('express');
var router = express.Router();
const bankerController = require('./bankerController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hi Banker');
});

router.post('/login',bankerController.login)
router.get('/getTransactions/:userId',bankerController.getTransactions)
router.get('/getUsers',bankerController.getAllUsers)
module.exports = router;
