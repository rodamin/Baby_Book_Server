var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

var login = require('./routes/login');
var join = require('./routes/join');
var conJoin = require('./routes/conJoin');
var baby = require('./routes/baby');
var growth = require('./routes/growth');
var diary = require('./routes/diary');
var story = require('./routes/story');
var video = require('./routes/video')

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended: true,parameterLimit:50000}));


//app.use(cookieParser("3CCC4ACD-6ED1-4844-9217-82131BDCB239"));
//app.use(session({
//    secret:'1234567890',
//    resave: false,
//    saveUninitialized:true
//}));

app.use('/login',login);
app.use('/join',join);
app.use('/conJoin',conJoin);
app.use('/baby',baby);
app.use('/growth',growth);
app.use('/diary',diary);
app.use('/story',story);
app.use('/video',video);
app.use(express.static('./'));

var server = app.listen(3000,function(){
    console.log("hello");
});