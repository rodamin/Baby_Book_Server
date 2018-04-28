var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();

var express = require('express');
var router = express.Router();

mysql_dbc.test_open(connection);

router.post('/store',function(req,res){
    var baby_name = req.body.baby_name;
    var date = req.body.date;
    var weight = req.body.weight;
    var height = req.body.height;
    var code = req.session.code;
});
router.post('/update',function(req,res){
    var baby_name = req.body.baby_name;
    var date = req.body.date;
    var weight = req.body.weight;
    var height = req.body.height;
    var code = req.session.code;
});
router.get('/:baby_name',function(req,res){
    var baby_name = req.params.baby_name;
    var code = req.session.code;
});

module.exports = router;