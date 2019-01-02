const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var mysql = require('mysql');

const jwt = require('jsonwebtoken');

// JWT key
const jwtKey = 'key';

const app = express();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'move'
});


app.use(bodyParser.json());

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


app.listen(8000, () => {
    console.log('Server started!');
});

app.post('/api/login', (req, res) => {
    let dbUser;
    connection.connect();

    connection.query(`SELECT username, password, firstname, lastname FROM users WHERE username = '` + req.body.username + `' AND password = '` + req.body.password + `'`, function(err, results) {
        if (err) {
            throw err;
        }
        if(results === []) {
        console.log(results);
            return;
        }
        dbUser = {
            username: results[0].username,
            password: results[0].password,
            firstname: results[0].firstname,
            lastname: results[0].lastname
        };

        jwt.sign({dbUser}, jwtKey, {expiresIn: '30s'}, (err, token) => {
            
            res.json({
                 username: dbUser.username,
                 password: dbUser.password,
                 firstName: dbUser.firstname,
                 lastname: dbUser.lastname,
                 token
            });
        });
    });
    connection.end;
});

app.route('/api/cats').get((req, res) => {
    res.send({
        cats: [
            { id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' },
            { id: 2, username: 'chs5421', password: 'cHr.1702', firstName: 'Christopher', lastName: 'Senn' }
        ]
    });
});

/*
app.route('/api/cats/:name').post((req, res) => {
    const requestedCatName = req.params['name']
    res.send({ name: requestedCatName });
});


app.route('/api/cats').post((req, res) => {
    res.send(201, req.body);
});

app.route('/api/cats/:name').put((req, res) => {
    res.send(200, req.body);
});

app.route('/api/cats/:name').delete((req, res) => {
    res.sendStatus(204);
});*/

/*connection.connect();

connection.query('SELECT *  FROM users', function(err, rows, fields) {
    if (err) throw err;
    console.log(rows);
});
connection.end;*/