var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();

var express = require('express');
var router = express.Router();

var multer = require('multer');
var path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'video/')
    },
    filename: function (req, file, cb) {
      var extension=path.extname(file.originalname);  
      cb(null, file.fieldname + '-' + Date.now()+extension)
    }
  })  
var upload = multer({ storage: storage })

mysql_dbc.test_open(connection);

router.post('/save',upload.single('userfile'),function(req,res){
  var code = req.body.code;
  var baby_name = req.body.baby_name;  
  var userfile;
  var select_video='select video_path from Video where code = ? and baby_name = ?';
  var delete_video='delete form Video where code = ? and baby_name = ?';
  var insert_video='insert into Video(code,baby_name,video_path) values(?,?,?)';
  if(req.file!=null)
  {
    userfile=req.file;
  }else{
    res.status(404).json({error: 'file is not found'});
  }

  connection.beginTransaction(function(err){
    if(err){
      res.status(404).json({error: 'transacion error'});
      throw err;
    }
    connection.query(select_video,[code,baby_name],function(err,result){
      if(err) 
      {
          res.status(404).json({error: 'query error'});
          throw err;
      }
      if(result.length>0)
      {
          connection.query(delete_video,[code,baby_name],function(err,result){
            if(err) 
            {
                res.status(404).json({error: 'query error'});
                throw err;
            }
          });
      }
    });
    connection.query(insert_video,[code,baby_name,userfile.path],function(err,result){
      if(err) 
      {
          res.status(404).json({error: 'query error'});
          throw err;
      }
    });
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
router.get('/path',function(req,res)
{
  var code = req.body.code;
  var baby_name = req.body.baby_name;
  var select_video='select video_path from Video where code = ? and baby_name = ?';

  connection.query(select_video,[code,baby_name],function(err,result){
    if(result.length>0)
    {
      res.status(201).json(result);
    }else{
      res.status(404).json({error:'file does not exist'});
    }
  });
})

module.exports = router;