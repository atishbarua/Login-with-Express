var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var mysql = require('mysql');
const uuidv1 = require('uuid/v1');
var nodeMailer = require('nodemailer');
const boolean = require('boolean');

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
//Set Storage
var storage = multer.diskStorage({
    destination:'/Node/Express-Login/myapp/public/images',
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now() + path.extname(file.originalname));
    }
})
var upload = multer({ storage: storage,
            limits: {fileSize: 1000000}
            }).single('profilePicture');
//Posting user info in Database
router.post('/', function(req, res) {
   upload(req,res,(err)=>{
           if(err){
               console.log('error');
           }
   else {
   console.log(req.file);
   connection.query("SELECT * FROM users WHERE email_address='"+req.body.emailAddress+"'", function(err, result, fields){
        if(result[0] ==null ){
   var confirmationToken = uuidv1();
   var sql = "INSERT into users values (null , '"+req.body.firstName+"', '"+req.body.lastName+"', '"+req.body.emailAddress+"','/images/"+req.file.filename+"', '"+confirmationToken+"',FALSE,'"+req.body.gender+"', '"+req.body.district+"', '"+req.body.password+"')";
   connection.query(sql);
    let HelperOptions= {
        from : 'ecommerce.noreply@gmail.com',
        to : req.body.emailAddress,
        subject: 'Hello Testing',
        text: 'Welcome '+req.body.firstName+'. Please use Confirmation Token '+confirmationToken+' to activate account'
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
    res.redirect('./confirm');
    }
  else {
    res.render('registration',{usernameExists : "username already exist!!" }); }
    })
    }
    })
  })

  router.get('/',function(req,res) {
    res.render('login');
  })

module.exports = router;