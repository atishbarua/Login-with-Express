var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
const boolean = require('boolean');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
//connection to mysql
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'nodejsdb'
    });

/* GET confirm token page. */
router.get('/', function(req, res, next) {
  res.render('confirm');
});


router.post('/', function(req, res) {
  console.log(req.body);
  connection.query("SELECT * FROM users WHERE Confirmation_Token='"+req.body.confirmationtoken+"'", function(err, result, fields){
          if(result[0] ==null ){

      res.send('wrong token');
      }
    else {
       connection.query("UPDATE users SET Enabled="+'TRUE'+" WHERE Confirmation_Token='"+req.body.confirmationtoken+"'", function(err, result, fields){
         res.redirect('./login');
               })
               }
               })
});
module.exports = router;