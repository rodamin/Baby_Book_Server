var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();

var express = require('express');
var router = express.Router();

mysql_dbc.test_open(connection);
router.post('/write',function(req,res){
    var baby_name = req.body.baby_name;
    var idx = req.body.idx;
    var story = req.body.story;
    var code = req.body.code;
    var sql = 'insert into BabyBook_Story(baby_name,idx,story,code) values(?,?,?,?)';
    connection.query(sql,[baby_name,idx,story,code],function(err,result){
        if(err)
        {
            res.status(404).json({error:'query error'});
            throw err;
        }
        res.status(201).json({success: '1'});  
    });
});
router.get('/load',function(req,res){
    var baby_name = req.query.baby_name;
    var idx = req.query.idx;
    var code = req.query.code;
    var sql = 'select story from BabyBook_Story where baby_name = ? and idx = ? and code = ?';
    connection.query(sql,[baby_name,idx,code],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json(result);
    });
});
router.post('/update',function(req,res){
    var baby_name = req.body.baby_name;
    var idx = req.body.idx;
    var story = req.body.story;
    var code = req.body.code;
    var sql = 'update BabyBook_Story set story = ? where baby_name = ? and idx = ? and code = ?';
    connection.query(sql,[story,baby_name,idx,code],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json({success:'1'});
    });
});

module.exports = router;