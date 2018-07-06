var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Resource";
var app = express();
var cors = require("cors");
var port = 3004;
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
////
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
/////
// mongoose.connect("mongodb://localhost:27017/Resource");
// var db = mongoose.connection;

var User = require("./models/user");

var connStr = 'mongodb://localhost:27017/Resource';
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});





// app.post('/register', function(req, res) {
//     var new_user = new User({
//       username: req.username
//     });
  
//     new_user.password = new_user.generateHash(userInfo.password);
//     new_user.save();
//   });
  
//   app.post('/login', function(req, res) {
//     User.findOne({username: req.body.username}, function(err, user) {
  
//       if (!user.validPassword(req.body.password)) {
//         //password did not match
//       } else {
//         // password matched. proceed forward
//       }
//     });
//   });


//


// var dbo = db.db("Resource");
// var details = {
//     firstname : firstname, lastname : lastname, password : password , cpassword : cpassword, email : email ,address : address, gender : gender, dob : dob, mobile : mobile, date :date
// };

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var locationsRouter = require('./routes/location');
var catagoriesRouter = require('./routes/Catagories');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

////
app.use(passport.initialize());
app.use(passport.session());
/////
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', locationsRouter);
app.use('/', catagoriesRouter);


// var GoogleStrategy = require( 'passport-google-oauth' ).Strategy;
/////
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID:     '473347811574-sho7a9qjrj9lkq2381fcsk2hek02qd7g.apps.googleusercontent.com',
    clientSecret: 'MtZbuUtpqCBOfqapckFGzHBl',
    callbackURL: "http://localhost:3004/auth/google/callback",
    // passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(null, profile);
    // });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope:
  	[ 'https://www.googleapis.com/auth/plus.login',
  	  'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));

app.get( '/auth/google/callback',
	passport.authenticate( 'google', {
		successRedirect: 'http://localhost:4200/search',
		failureRedirect: 'http://localhost:4200'
}));
///////
/////
// passport.use(new GoogleStrategy({
//     consumerKey: '473347811574-sho7a9qjrj9lkq2381fcsk2hek02qd7g.apps.googleusercontent.com',
//     consumerSecret:'1IGTx0VpLG29LAt6RGyLEark',
//     callbackURL: "http://localhost:4200/auth/google/callback"
//   },
//   function(token, tokenSecret, profile, done) {
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return done(err, user);
//       });
//   }
// ));
//////

// passport.use(new GoogleStrategy({
//     clientID: '473347811574-sho7a9qjrj9lkq2381fcsk2hek02qd7g.apps.googleusercontent.com',
//     clientSecret: '1IGTx0VpLG29LAt6RGyLEark' ,
//     callbackURL: "http://localhost:4200/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//        User.findOrCreate({ googleId: profile.id }, function (err, user) {
//          return done(err, user);
//        });
//   }
// ));

////
// app.get('/auth/google',
//   passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));
////

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.


// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

////
//   app.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
////

// MongoClient.connect(url,function(err,db) {
//     if (err)
//         throw err;
//     console.log("connected");

// app.get('/data', function (req, res) {
//
//     console.log('hii');
//     var dbo = db.db("Resource");
//     dbo.collection("Rdetails").findOne({},
//         function(err,result){
//             if (err) throw err;
//             console.log(result);
//         })
//
// });
// app.post('/rdetails',function(req,res){
//     var Resource_name = req.body.Resource_name;
//     var dbo = db.db("Resource");
//     var data = {
//         Resource_name : Resource_name
//     }
//     dbo.collection("Rdetalis").insertOne(data,function (err,res){
//             if (err) throw err;
//             console.log(res);
//         }
//
//     )
//
// })




// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
// passport.use(new GoogleStrategy({
//     clientID:  '473347811574-tl9mffab4lne3070f3fglhe4mu3a9ql5.apps.googleusercontent.com',
//     clientSecret: '1IGTx0VpLG29LAt6RGyLEark',
//     callbackURL: "http://www.example.com/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     //    User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         console.log(profile);
//          return done(err, user);
//     //    });
//   }
// ));

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

app.post('/register', function(req, res) {
    // create a user a new user
    var testUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    
    // save user to database
    testUser.save(function(err,result) {
        if (err) throw err;
        res.json({result:true})
    });
});
    
app.post('/login', function(req, res) {
        // fetch user and test password verification
        console.log(req.body)
        User.findOne({ username: req.body.username }, function(err, user) {
            // if (err){ throw err};

            if(user == null){
                res.json({result:false})
            }
              
           else{
    
            // test a matching password
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) throw err;
                console.log('Password123:', isMatch); // -> Password123: true
                if(isMatch){
                    const token = jwt.sign({user: user.id}, 'secret_key');
                    res.json({
                        message: 'Authenticated! Use this token in the "Authorization" header',
                        token: token,
                        result:isMatch
                    });
                }
                else{
                    res.json({result:isMatch})
                }
                
            });
        }
        
    
            // test a failing password
            // user.comparePassword(req.body.password, function(err, isMatch) {
            //     if (err) throw err;
            //     console.log('123Password:', isMatch); // -> 123Password: false
            // });
        });
    });
    
    





// app.get('/', function (err, res) {
//     console.log('hii');
//     var dbo = db.db("Resource");
//     dbo.collection("Rskills").findOne({},
//         function (err, result) {
//             if (err) throw err;         
//             console.log(result);
//         })

// });


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});




app.listen(port);
module.exports = app;

