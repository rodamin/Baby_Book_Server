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
    var userfile=req.file;
    if(err) 
    {
        res.status(404).json({error: 'query error'});
        throw err;
    }
    res.status(201).json({success:'1'});
});


module.exports = router;