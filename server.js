const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.listen(8000, () => {
    console.log('Server started!');
});

app.route('/api/cats').get((req, res) => {
    res.send({
        cats: [
            { id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' },
            { id: 2, username: 'chs5421', password: 'cHr.1702', firstName: 'Christopher', lastName: 'Senn' }
        ]
    });
});

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
});