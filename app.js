var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

var login = require('./routes/login');
var join = require('./routes/join');
var conJoin = require('./routes/conJoin');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret:'1234567890',
    resave: false,
    saveUninitialized:true
}));

app.use('/login',login);
app.use('/join',join);
app.use('/conJoin',conJoin);

var server = app.listen(3000,function(){
    console.log("hello");
});