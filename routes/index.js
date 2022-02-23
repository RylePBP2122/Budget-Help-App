const express = require('express');
const connection = require('../database');
const router = express.Router();

//HOME PAGE ROUTE
router.get('/', (req, res) => {
  if (req.session.loggedin) {
		res.render('overview');
	} else {
		res.render('login');
	}
	res.end();
});

//LOGIN
router.get('/login', (req, res) => {
  res.render('login');
});

//LOGIN AUTH
router.post('/login', (req, res) => {
  var user = req.body.username;
  var pass = req.body.password;
  var sql = 'SELECT * FROM accounts WHERE username = ? AND password = ?';
  if(user && pass){
    connection.query(sql, [user, pass], function(error,results,fields){
      if(results.length > 0){
        req.session.loggedin = true;
        req.session.username = user;
        res.redirect('/');
      } else {
        res.render('login', {
          message: 'Incorrect username or password',
          messageClass: 'message-alert'
        });
      }
      res.end();
    });
  } else {
    res.render('login', {
      message: 'Please enter Username and Password.',
      messageClass: 'message-alert'
    });
		res.end();
  }
});

router.get('/register', (req,res) => {
  res.render('register');
});

router.post('/register', (req,res) => {
  var data = req.body;  
  if (data.password === data.confirmPassword){
    var sql = 'SELECT * FROM accounts WHERE email = ?';
    if (data.username){
      connection.query(sql, data.email, function(error,results){
        if (error) throw error;
        if (results.length > 0){
            res.render('register', {
              message: 'Account with this email already exists',
              messageClass: 'message-alert'
            });
        } else {
          var sql = 'INSERT INTO accounts (username,password,email,firstname,lastname) VALUES (?,?,?,?,?)';
          var values = [data.username, data.password, data.email, data.firstname, data.lastname];
          connection.query(sql, values, function(error, result){
            if (error) throw error;
            console.log("Number of records inserted: " + result.affectedRows);
          });
          res.render('login', {
            message: 'Registration successful. Please login to continue.',
            messageClass: "message-success"
          });
        }
      });
    }
  } else {
      res.render('register', {
        message: 'Passwords do not match',
        messageClass: 'message-alert'
      });
    }
});

//BUDGET
router.get('/create', (req, res) => {
  res.render('create');
});

//SAVE BUDGET

router.post('/save-budget', (req, res) => {
  const budget = JSON.parse(JSON.stringify(req.body));
  const income = JSON.parse(budget.i);
  const expense = JSON.parse(budget.e);
  const savings = JSON.parse(budget.s);
  var sql = "SELECT id FROM accounts WHERE username = ?";
  var values = "admin";

  function insertData(sql, values){
    connection.query(sql, values, function(error,results){
      if (error){
        throw error;
      }
      var user_id = results[0].id;

      var incomeValues = [];
      income.forEach(e => {
        incomeValues.push([user_id, e[0], e[1], e[2]]);
      });
      var expenseValues = [];
      expense.forEach(e => {
        expenseValues.push([user_id, e[0], e[1], e[2]]);
      });
      var savingsValues = [];
      savings.forEach(e => {
        savingsValues.push([user_id, e[0], e[1], e[5], e[2]]);
      });
      var values = [user_id, incomeValues, user_id, expenseValues, user_id, savingsValues];

      var sql = "DELETE FROM income WHERE user_id = ?;";
      sql += "INSERT INTO income (user_id, name, total, freq) VALUES ?;";
      sql += "DELETE FROM expenses WHERE user_id = ?;";
      sql += "INSERT INTO expenses (user_id, type, total, freq) VALUES ?;";
      sql += "DELETE FROM savings WHERE user_id = ?;";
      sql += "INSERT INTO savings (user_id, type, total, monthly_payment, goal_date) VALUES ?";

      connection.query(sql, values, function(error, results){
        if (error){
          throw error;
        }
          var rows = 0;
          results.forEach(e=>{
            rows += e.affectedRows;
          });
          console.log("Number of rows inserted: " + rows);
      });
    });
  }
  insertData(sql, values);
  res.redirect('/');
});

module.exports = router;