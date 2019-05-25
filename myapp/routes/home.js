var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
//connection to mysql
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'nodejsdb'
    });
 router.post('/',function(req,res){
    connection.query("SELECT * FROM users WHERE email_address='"+req.body.emailAddress+"'", function(err, result, fields){
              if(result[0] ==null ){

          res.send('wrong Email Address');
          }
        else if (result[0].password== req.body.password){
                res.render('home',{user : result[0]});
                   }
         else {
            res.send('Wrong password')
         }
                   })
 })

module.exports = router;