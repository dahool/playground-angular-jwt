var express = require('express');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser');

const uuidv1 = require('uuid/v1');

const KEY = '12345678';

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
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
    console.log(req.headers);
    let options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
    }
    let val = uuidv1();
    res.cookie('SESSIONID', val, options);
    var token = jwt.sign(user, KEY + val);
    console.log(token);
    user.token = token;
    res.json(user);
});

router.get('/users', function(req, res) {
    console.log(req.headers);
    console.log(req.cookies);
    var sess = req.cookies['SESSIONID'];
    var token = req.header('authorization').substring(7);
    console.log(token);
    jwt.verify(token, KEY + sess, function (err, decoded) {
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
    console.log(req.headers);
    console.log(req.cookies);
    var token = req.header('authorization').substring(7);
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

app.use('/', router);

app.listen(3000, "0.0.0.0", () => console.log('Started'));