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
    var code = req.body.code; 
    var sql = 'insert into Growth_Data(code,baby_name,date,weight,height) values(?,?,?,?,?)';
    connection.query(sql,[code,baby_name,date,weight,height],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json({success: '1'});  
    });
   
});
router.post('/update',function(req,res){
    var baby_name = req.body.baby_name;
    var date = req.body.date;
    var weight = req.body.weight;
    var height = req.body.height;
    var code = req.body.code;
    var sql = 'update Growth_Data set weight = ?, height = ? where code = ? and baby_name = ? and date = ?';
    connection.query(sql,[weight,height,code,baby_name,date],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json({success: '1'});  
    });
});
router.post('/',function(req,res){
    var baby_name = req.body.baby_name;
    var code = req.body.code;
    var sql = 'select * from Growth_Data where code = ? and baby_name = ?';
    connection.query(sql,[code,baby_name],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        if(result.length>0)
        {
            res.status(201).json(result);
        }
    });
});

module.exports = router;