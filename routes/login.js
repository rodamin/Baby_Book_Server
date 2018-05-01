var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();

var express = require('express');
var router = express.Router();

mysql_dbc.test_open(connection);
function findCode(req,res,id){                                                          //parent code find end store in session
    var sql2 = 'select code from Parent where mother_id = ? or father_id = ?';
    connection.query(sql2,[id,id],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }
        if(result.length>0)
        {
            //console.log(result[0]);
            //req.session.code=result[0].code;
            //console.log(req.session.code);
            //console.log("code session 저장 성공");
            console.log("login-test");
            res.status(201).json(result);
        }else{
            res.status(404).json({error: 'Unknown user'});
        }
    });
};
router.post('/',function(req,res){
    var sql = 'select password from User where id =?';
    var id = req.body.id;
    var pw = req.body.password;
    console.log(id);
    console.log(pw);
    connection.query(sql,[id],function(err,result){
        if(err) 
        {
            res.status(404).json({error: 'query error'});
            throw err;
        }

        if(result.length>0)
        {
            console.log(result[0].password);
            if(result[0].password == pw)
            {

                console.log("로그인 성공");
                
                findCode(req,res,id);
            }else{
            console.log("로그인 실패");
            res.status(404).json({error: 'Incorrect password'});
            }
        }else{
            console.log("존재하지 않는 사용자입니다.");
            res.status(404).json({error: 'Unknown user'});
        }
    });
});


module.exports = router;