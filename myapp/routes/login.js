var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var mysql = require('mysql');
const uuidv1 = require('uuid/v1');
var nodeMailer = require('nodemailer');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
//connection to mysql
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'nodejsdb'
    });

//connection to gmail
let transporter = nodeMailer.createTransport({
    service:'gmail',
    secure:false,
    port:25,
    auth: {
        user: 'ecommerce.noreply@gmail.com',
        pass: 'Spring1234'
    },
    tls: {
        rejectUnauthorized: false
    }
});
//Posting user info in Database

router.post('/', function(req, res) {
   console.log(req.body);
   connection.query("SELECT * FROM users WHERE email_address='"+req.body.emailAddress+"'", function(err, result, fields){
        if(result[0] ==null ){
   var confirmationToken = uuidv1();
   var sql = "INSERT into users values (null , '"+req.body.firstName+"', '"+req.body.lastName+"', '"+req.body.emailAddress+"', '"+confirmationToken+"','"+req.body.gender+"', '"+req.body.district+"', '"+req.body.password+"')";
   connection.query(sql);
    let HelperOptions= {
        from : 'ecommerce.noreply@gmail.com',
        to : req.body.emailAddress,
        subject: 'Hello Testing',
        text: 'Welcome '+req.body.firstName+'. Please use Cofirmation Token '+confirmationToken+' to activate account'
    }
    transporter.sendMail(HelperOptions,function(error,info){
        if(error){
            console.log('error');
        }
        else {
            console.log('Email Sent');
        }
        console.log(info);
    });
    res.render('users',{username : req.body.firstName });
    }
  else {
    res.render('users',{username : "username already exist!!" }); }
    })
  })

module.exports = router;