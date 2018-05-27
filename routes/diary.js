var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();

var express = require('express');
var router = express.Router();

var multer = require('multer');
var path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'imgs/')
    },
    filename: function (req, file, cb) {
      var extension=path.extname(file.originalname);  
      cb(null, file.fieldname + '-' + Date.now()+extension)
    }
  })  
var upload = multer({ storage: storage })

mysql_dbc.test_open(connection);

router.post('/add',upload.array('userfile',4),function(req,res){
    var baby_name = req.body.baby_name; 
    var date_time = req.body.date_time;
    var subject = req.body.subject;
    var diary = req.body.diary;
    var code = req.body.code;
    var files;
    var sql1 = 'insert into Image(code,baby_name,date_time,idx,img_path) values(?,?,?,?,?)';
    var sql = 'insert into Baby_Diary(baby_name,date_time,subject,diary,code) values(?,?,?,?,?)';
    
    connection.beginTransaction(function(err){
        if(err){
            res.status(404).json({error: 'transacion error'});
            throw err;
        }
        connection.query(sql,[baby_name,date_time,subject,diary,code],function(err,result){
            if(err) 
            {
                res.status(404).json({error: 'query error'});
                throw err;
            }
        });
        if(req.files.length>-1)
        {
            files = req.files;
            
            for(var i=0;i<files.length;i++)
            {
                console.log(files[i].path);
                connection.query(sql1,[code,baby_name,date_time,i,files[i].path],function(err,result){
                    if(err) 
                    {
                        res.status(404).json({error: 'query error'});
                        throw err;
                    }
                });
            }
        }
        
        connection.commit(function(err){
            if(err){
                console.error(err);
                connection.rollback(function(){
                    console.error('rollback error');
                    throw err;
                })
            }
            res.status(201).json({success:'1'});  
        });
    });
});
router.post('/delete',function(req,res){
    var baby_name = req.body.baby_name;
    var date_time = req.body.date_time;
    var code = req.body.code;
    var sql = 'delete from Baby_Diary where baby_name = ? and date_time = ? and code = ?';
    file_delete(baby_name,date_time,code);
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
    var files;
    var update_sql = 'update Baby_Diary set subject = ?, diary = ? where baby_name = ? and date_time = ? and code = ?';
    var delete_sql = 'delete from Image where baby_name = ? and date_time = ? and code = ?';
    var insert_sql = 'insert into Image(code,baby_name,date_time,idx,img_path) values(?,?,?,?,?)';
    connection.beginTransaction(function(err){
        if(err){
            res.status(404).json({error: 'transacion error'});
            throw err;
        }
        file_delete(baby_name,date_time,code);
        
        connection.query(delete_sql,[baby_name,date_time,code],function(err,result){
            if(err) 
            {
                res.status(404).json({error: 'query error'});
                throw err;
            }
        })
        connection.query(update_sql,[subject,diary,baby_name,date_time,code],function(err,result){
            if(err) 
            {
                res.status(404).json({error: 'query error'});
                throw err;
            }
        });
        if(req.files.length>-1)
        {
            files = req.files;
            
            for(var i=0;i<files.length;i++)
            {
                console.log(files[i].path);
                connection.query(sql1,[code,baby_name,date_time,i,files[i].path],function(err,result){
                    if(err) 
                    {
                        res.status(404).json({error: 'query error'});
                        throw err;
                    }
                });
            }
        }
        connection.commit(function(err){
            if(err){
                console.error(err);
                connection.rollback(function(){
                    console.error('rollback error');
                    throw err;
                })
            }
            res.status(201).json({success:'1'});  
        });
    })
    
});
router.get('/update_load',function(req,res){
    var baby_name = req.body.baby_name; 
    var date_time =req.body.date_time; 
    var code = req.body.code; 
    var sql = 'select DATE_FORMAT(date_time,"%Y-%m-%d %T") as date_time,subject,diary from Baby_Diary where baby_name = ? and date_time = ? and code = ?';
    var select_sql = 'select img_path from Image where baby_name = ? and date_time = ? and code = ?';
    var resArr;
    var resObj;
    connection.beginTransaction(function(err){
        connection.query(sql,[baby_name,date_time,code],function(err,result){
            if(err) 
            {
                res.status(404).json({error: 'query error'});
                throw err;
            }
            resArr=result;
        });
        connection.query(select_sql,[baby_name,date_time,code],function(err,result){
            if(err) 
            {
                res.status(404).json({error: 'query error'});
                throw err;
            }
            resArr.push(result);
        });
        connection.commit(function(err){
            if(err){
                console.error(err);
                connection.rollback(function(){
                    console.error('rollback error');
                    throw err;
                })
            }
            res.status(201).json(resArr);  
        });

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

function file_delete(baby_name,date_time,code)
{
    var select_sql = 'select img_path from Image where baby_name = ? and date_time = ? and code = ?';
    connection.query(select_sql,[baby_name,date_time,code],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        
        for(var i=0;i<result.length;i++)
        {
            fs.unlink(result[i].img_path,function(err){
                if(err) 
                {
                    res.status(404).json({error: 'file delete error'});
                    throw err;
                }
            });
        }
    });
}
module.exports = router;