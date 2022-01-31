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
        res.send('Incorrect username or password.');
      }
      res.end();
    });
  } else {
    res.send('Please enter Username and Password.');
		res.end();
  }
});

router.get('/register', (req,res) => {
  res.render('register');
})

//BUDGET
router.get('/create', (req, res) => {
  res.render('create');
});



module.exports = router;