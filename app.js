const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./routes');
const dotenv = require('dotenv');
const connection = require('./database');
dotenv.config();

const app = express();

connection.connect((err) => {
    if(err) throw err;
    console.log("Database connected.");
});

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json()); 

app.use('/', routes);

app.listen(process.env.PORT, () => {console.log("Server is running on port " + process.env.PORT)});