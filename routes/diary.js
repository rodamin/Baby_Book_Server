var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();

var express = require('express');
var router = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../imgs/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
var upload = multer({ storage: storage });
mysql_dbc.test_open(connection);

router.post('/add',upload.array('userfile',4),function(req,res){
    var baby_name = req.body.baby_name; 
    var date_time = req.body.date_time;
    var subject = req.body.subject;
    var diary = req.body.diary;
    var code = req.body.code;
    var files;
    var sql1 = 'insert into Image(code,baby_name,date_time,idx,img_path) values(?,?,?,?,?)';
    if(req.files.length>-1)
    {
        files = req.files;
        console.log(files[i].path);
        //for(var i=0;i<files.length;i++)
        //{
        //    connection.query(sql1,[code,baby_name,date_time,i,files[i].path]);
        //}
    }
    var sql = 'insert into Baby_Diary(baby_name,date_time,subject,diary,code) values(?,?,?,?,?)';
    connection.query(sql,[baby_name,date_time,subject,diary,code],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json({success:'1'});  
    });
});
router.post('/delete',function(req,res){
    var baby_name = req.body.baby_name;
    var date_time = req.body.date_time;
    var code = req.body.code;
    var sql = 'delete from Baby_Diary where baby_name = ? and date_time = ? and code = ?';
    connection.query(sql,[baby_name,date_time,code],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json({success:'1'});  
    });
});
router.post('/update',function(req,res){
    var baby_name = req.body.baby_name; 
    var date_time = req.body.date_time;
    var subject = req.body.subject;
    var diary = req.body.diary;
    var code = req.body.code;
    var sql = 'update Baby_Diary set subject = ?, diary = ? where baby_name = ? and date_time = ? and code = ?';
    connection.query(sql,[subject,diary,baby_name,date_time,code],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json({success:'1'});
    });
});
router.get('/update_load',function(req,res){
    var baby_name = req.query.baby_name; 
    var date_time = req.query.date_time;
    var code = req.query.code;
    var sql = 'select DATE_FORMAT(date_time,"%Y-%m-%d %T") as date_time,subject,diary from Baby_Diary where baby_name = ? and date_time = ? and code = ?';
    connection.query(sql,[baby_name,date_time,code],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json(result);
    });
});
router.get('/load',function(req,res){
    var baby_name = req.query.baby_name; 
    var code = req.query.code;
    var sql = 'select DATE_FORMAT(date_time,"%Y-%m-%d %T") as date_time,subject,diary from Baby_Diary where baby_name = ? and code = ?';
    connection.query(sql,[baby_name,code],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        res.status(201).json(result);
    });
});

module.exports = router;