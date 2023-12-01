var express = require('express');
var router = express.Router();
const userController = require('./userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hi User');
});

router.post('/login',userController.login)
router.get('/getTransactions/:id',userController.getTransactions)

module.exports = router;
