var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();

var express = require('express');
var router = express.Router();

mysql_dbc.test_open(connection);


router.get('/:other_id',function(req,res){                                  //상대 계정이 parent에 있는지 점검
    var other_id=req.params.other_id;
    var select_sql ='select * from Parent where mother_id = ? or father_id = ?';
    console.log(other_id);
    connection.query(select_sql,[other_id,other_id],function(err,result){
        if(err) throw err;

        if(result.length>0)
        {
            console.log(result[0].mother_id);
            res.status(201).json({success: '1'});                                                //있음
        }else{
            res.status(404).json({error: 'Unknown user'});                                       //없음
        }
    });
});

router.post('/',function(req,res){
    var sql = 'insert into User(id,password,name,gender,email) values(?,?,?,?,?)';
    var id = req.body.id;
    var pw = req.body.password;
    var name = req.body.name;
    var gender = req.body.gender;
    var other_id =req.body.other_id;
    var email = req.body.email;
    console.log(other_id);
    connection.query(sql,[id,pw,name,gender,email],function(err,result){
        if(err) throw err;
        var m_sql = 'update Parent set mother_id = ? where father_id = ?';
        var f_sql = 'update Parent set father_id = ? where mother_id = ?';
        
        if(gender==0){                                                     //update는 반환되는 값이 없다. 따라서 길이 체크 x
            connection.query(m_sql,[id,other_id],function(err,result){
                if(err){
                    res.status(404).json({error: 'query error'});
                    throw err;
                } 
                res.status(201).json({success: '1'});
            });
        }else{
            connection.query(f_sql,[id,other_id],function(err,result){
                if(err) 
                {
                    res.status(404).json({error: 'query error'});
                    throw err;
                }
                res.status(201).json({success: '1'});
            });
        }
    });
});


module.exports = router;