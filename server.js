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
connection.connect();

app.post('/api/login', (req, res) => {
    let dbUser;

    connection.query(`SELECT username, password, firstname, lastname FROM users WHERE username = '` + req.body.username + `' AND password = '` + req.body.password + `'`, function(err, results) {
        /*if (err) {
            throw err;
        }*/

        try {
            dbUser = {
                username: results[0].username,
                password: results[0].password,
                firstname: results[0].firstname,
                lastname: results[0].lastname
        };
        } catch (err) {
            res.sendStatus(401);
        }

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
});

/*app.get('/api/test', (req, res) => {
    console.log('sad');
    res.send({
       test: [{ test: 'test'}, {test:'test2'}]
    });
});*/

app.post('/api/guardedRoute', verifyToken, (req, res) => {
    console.log('2eaq');
    jwt.verify(req.token, jwtKey, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Works',
                authData
            });
        }
    });
    
});

function verifyToken(req, res, next) {
    console.log('2asdasdeaq');
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

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