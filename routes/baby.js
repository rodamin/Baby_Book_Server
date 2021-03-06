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
    var code = req.body.code;
    console.log(code);
    connection.query(sql,[code,baby_name,gender,birth],function(err,result){
        if(err)
        {
            res.status(404).json({error:'query error'});
            throw err;
        }
        res.status(201).json({success: '1'});  
    });
});
router.post('/update',function(req,res){
    var sql = 'update Baby set baby_name = ?, gender = ?, birth = ? where code = ? and baby_name = ?';
    var new_baby_name = req.body.new_baby_name;
    var prev_baby_name = req.body.prev_baby_name;
    var gender = req.body.gender;
    var birth = req.body.birth;
    var code = req.body.code;
    connection.query(sql,[new_baby_name,gender,birth,code,prev_baby_name],function(err,result){
        if(err)
        {
            res.status(404).json({error:'query error'});
            throw err;
        }
        res.status(201).json({success: '1'});  

    });
});
router.post('/delete',function(req,res){
    var baby_name = req.body.baby_name;
    var code = req.body.code;
    var sql = 'delete from Baby where baby_name = ? and code = ?';
    connection.query(sql,[baby_name,code],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json({success:'1'});  
    });
});
router.get('/load/:code',function(req,res){
    var code = req.params.code;
    var sql = 'select baby_name from Baby where code = ?';
    connection.query(sql,[code],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json(result);
    });
});
module.exports = router;