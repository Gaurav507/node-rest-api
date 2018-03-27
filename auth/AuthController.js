
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var User = require('../model/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('./VerifyToken');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

// API for registering the user

router.post('/register' , function(req,res){
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name:req.body.name,
        email:req.body.email,
        password: hashedPassword
    },
    function(err, user){
        if(err) res.status(500).send("There was some problem in registering new user.Please try after some time");
       
        var token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 86400
        });
        res.status(200).send({ auth: true, token: token });
    });
});

    router.get('/me', VerifyToken, function(req, res) {
      //  var token = req.headers['x-access-token'];
        //if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

        //jwt.verify(token, config.secret, function(err, decoded) {
       // if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        //res.status(200).send(decoded);
        User.findById(req.userId, {password :0 },
            function(err,user){
            if(err) res.status(500).send("There was some problem getting the user details");
            if(!user) res.status(404).send("User not found");
           // res.status(200).send(user);
           res.status(200).send(user); // add this line
                });
        });
    //});

   router.post('/login', function(req, res){

    User.findOne({ email:req.body.email }, function(err, user){
        if(err) res.status(500).send("There is problem with login.");
        if(!user) res.status(404).send("User could not be find");

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordIsValid) res.status(401).send({ auth: false, token: null });
        
        var token = jwt.sign({id:user._id}, config.secret , {
            expiresIn:86400
        });
        res.status(200).send({ auth: true, token: token });
    });
   }) ;

   //middleware
   // add the middleware function
    router.use(function (user, req, res, next) {
    res.status(200).send(user);
  });

 module.exports = router;