const express = require('express');
const { CLIENT_SECURE_CONNECTION } = require('mysql/lib/protocol/constants/client');
const connection = require('../database');
const router = express.Router();

//HOME PAGE ROUTE
router.get('/', (req, res) => {
  if (req.session.loggedin) {
        res.render('overview', {loggedIn : true});
	} else {
		res.render('login', {loggedIn : false});
	}
});

//LOGIN
router.get('/login', (req, res) => {
    res.render('login', {loggedIn: false});
});

router.get('/login/:message', (req, res) => {
  if (req.params.message == 1){
    res.render('login', {
      loggedIn : false,
      message: "Please login or register an account to create a budget",
      messageClass: "message-alert"
    });
  } else {
    res.render('login', {loggedIn: false});
  }
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
          messageClass: 'message-alert',
          loggedIn: false
        });
      }
      res.end();
    });
  } else {
    res.render('login', {
      message: 'Please enter Username and Password.',
      messageClass: 'message-alert',
      loggedIn: false
    });
		res.end();
  }
});

router.get('/logout', (req,res) => {
  if (req.session){
    req.session.destroy(err => {
      if (err){
        res.status(400).send("Unable to log out");
      } else {
        res.redirect('/');
      }
    })
  }
})

router.get('/register', (req,res) => {
  res.render('register', {loggedIn: false});
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
              messageClass: 'message-alert',
              loggedIn: false
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
            messageClass: "message-success",
            loggedIn: false
          });
        }
      });
    }
  } else {
      res.render('register', {
        message: 'Passwords do not match',
        messageClass: 'message-alert',
        loggedIn: flase
      });
    }
});

//BUDGET
router.get('/create', (req, res) => {
  if (req.session.loggedin)
    res.render('create', {loggedIn: true});
  else{
    res.redirect('/login/1');
  }
    
});

//SAVE BUDGET

router.post('/save-budget', (req, res) => {
  const budget = req.body;

  var sql = "SELECT id FROM accounts WHERE username = ?";
  var user = req.session.username;

  function insertData(sql, user, budget){
    connection.query(sql, user, function(error,results){
      if (error){
        throw error;
      }
      var user_id = results[0].id;

      var incomeValues = [];
      budget.i.forEach(e => {
        incomeValues.push([user_id, e[0], e[1], e[2], e[3], e[4]]);
      });
      var expenseValues = [];
      budget.e.forEach(e => {
        expenseValues.push([user_id, e[0], e[1], e[2], e[3], e[4]]);
      });
      var savingsValues = [];
      budget.s.forEach(e => {
        savingsValues.push([user_id, e[0], e[1], e[2], e[3], e[4], e[5]]);
      });
      var values = [user_id, user_id, user_id, incomeValues, expenseValues, savingsValues];

      var sql = "";
      sql += "DELETE FROM income WHERE user_id = ?;";
      sql += "DELETE FROM expenses WHERE user_id = ?;";
      sql += "DELETE FROM savings WHERE user_id = ?;";

      if (incomeValues.length > 0){
        sql += "INSERT INTO income (user_id, name, total, freq, custom, monthly_total) VALUES ?;";
      }
      if (expenseValues.length > 0){
        sql += "INSERT INTO expenses (user_id, type, total, freq, custom, monthly_total) VALUES ?;";
      }
      if (savingsValues.length > 0){
        sql += "INSERT INTO savings (user_id, type, total, goal_date, custom, months, monthly_payment) VALUES ?";
      }

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
  insertData(sql, user, budget);
  res.redirect("/");
});

router.get('/get-budget', (req, res) => {
  if (req.session.loggedin) {
    var sql = "SELECT id FROM accounts WHERE username = ?"
    connection.query(sql, req.session.username, function(err, results){
      if (err){
        throw err;
      }
      var id = results[0].id;
      var sql = "SELECT name,total,freq,custom,monthly_total FROM income WHERE user_id = ?;";
      sql += "SELECT type,total,freq,custom,monthly_total FROM expenses WHERE user_id = ?;"
      sql += "SELECT type,total,goal_date,custom,monthly_payment,months FROM savings WHERE user_id = ?;"

      connection.query(sql, [id,id,id], function(err,results){
        if (err){
          throw err;
        }
        var incomeValues = [];
        var expenseValues = [];
        var savingsValues = [];

        results[0].forEach(e => {
          incomeValues.push(Object.values(e));
        });
        results[1].forEach(e => {
          expenseValues.push(Object.values(e));
        });
        results[2].forEach(e => {
          savingsValues.push(Object.values(e));
        });

        var budget = {
          i: incomeValues,
          e: expenseValues,
          s: savingsValues
        };
        
        res.send(budget);
      });
    });
	}
});

module.exports = router;