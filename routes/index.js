var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/greeting', (req, res)=>{
    res.render('greeting');
})

module.exports = router;
