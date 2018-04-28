var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();

var express = require('express');
var router = express.Router();

mysql_dbc.test_open(connection);
router.post('/store',function(req,res){
    var sql = 'insert into Baby(code,baby_name,gender,birth) values(?,?,?,?)';
    var baby_name = req.body.baby_name;
    var gender = req.body.gender;
    var birth = req.body.birth;
    var code = req.session.code;
    connection.query(sql,[code,baby_name,gender,birth],function(err,result){
        if(err)
        {
            res.status(404).json({error:'query error'});
            throw err;
        }
    });
});
router.post('/update',function(req,res){
    var sql = 'update Baby set baby_name = ?, gender = ?, birth = ? where code = ? and baby_name = ?';
    var new_baby_name = req.body.new_baby_name;
    var prev_baby_name = req.body.prev_baby_name;
    var gender = req.body.gender;
    var birth = req.body.birth;
    var code = req.session.code;
    connection.query(sql,[new_baby_name,gender,birth,code,prev_baby_name],function(err,result){
        if(err)
        {
            res.status(404).json({error:'query error'});
            throw err;
        }

    });
});

module.exports = router;