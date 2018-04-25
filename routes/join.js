var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();

var express = require('express');
var router = express.Router();

mysql_dbc.test_open(connection);

router.get('/:check_id',function(req,res){                                  //상대 계정이 parent에 있는지 점검
    var check_id=req.params.check_id;
    var select_sql ='select * from User where id = ?';
    console.log(check_id);
    connection.query(select_sql,[check_id],function(err,result){
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
    var email = req.body.email;
    connection.query(sql,[id,pw,name,gender,email],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }

        //사용자 id를 parent table에 insert
        var m_sql = 'insert into Parent(mother_id) values(?)';
        var f_sql = 'insert into Parent(father_id) values(?)';
        if(gender==0)                                                           //female:0
        {
            connection.query(m_sql,[id],function(err,result){
                if(err) 
                {
                    res.status(404).json({error: 'query error'});
                    throw err;
                }
                res.status(201).json({success: '1'});
            });
        }else{                                                                 //male:1
            connection.query(f_sql,[id],function(err,result){
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