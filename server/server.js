var express = require('express');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");

const KEY = '12345678';

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var router = express.Router();

var user = {id: 1,
 username: 'test',
 password: 'test',
 firstName: 'test', 
 lastName: 'test',
 token: null
}

router.post('/users/authenticate', function(req, res) {
    console.log(req);
    var token = jwt.sign(user, KEY);
    console.log(token);
    user.token = token;
    res.json(user);
});

router.get('/users', function(req, res) {
    console.log(req);
    var token = req.header('authorization')
    jwt.verify(token, KEY, function (err, decoded) {
        if (err) {
            console.log("ERROR");
            res.status(401)
          if (err.name === "TokenExpiredError")
            return res.send('error');
          else
            return res.send('error');
        }
        res.json([user]);
    });
});

router.post('/token', function(req, res) {
    console.log(req);
    var token = req.header('authorization')
    jwt.verify(token, KEY, function (err, decoded) {
        if (err) {
            console.log("ERROR");
            res.status(401)
          if (err.name === "TokenExpiredError")
            return res.send('error');
          else
            return res.send('error');
        }
        var data = {'name': 'test'};
        var token = jwt.sign(data, KEY);
        res.json({user: {token: token}});
    });
});

/*
router.route('/save')
    .put(function(req, res) {
        if (!req.body) return res.sendStatus(400);
        h = heroes.find(hero => hero.id === req.body.id);
        h.name = req.body.name;
        res.json(h);
    })
    .post(function(req, res) {
        if (!req.body) return res.sendStatus(400);
        h = heroes[heroes.length-1]
        x = {id: ++h.id, name: req.body.name}
        heroes.push(x)
        res.json(x);
    })
*/
app.use('/', router);

app.listen(3000, "0.0.0.0", () => console.log('Started'));