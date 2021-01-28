if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const campgroundRouter = require('./routes/campgrounds');
const registerRouter = require('./routes/users')
const reviewRouter = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const user = require('./models/user');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.engine('ejs', ejsMate);


const mongoose = require('mongoose');
//const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { findById } = require('./models/campground');
const { date } = require('joi');
// const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
// const { urlencoded } = require('express');
mongoose.connect('mongodb://localhost/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
  console.log('Database connected!!')
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionConfig = {
    secret: "Get a session secret that's worth it!!!",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + (1000*60*60*24*7),
        maxage: (1000*60*60*24*7)
    }
}
app.use(session(sessionConfig));
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));
//authenticate is a fucntion aded to the user model automatically by the passport-local-mongoose
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(flash());
app.use((req, res, next)=>{
    //console.log(req.session);
    res.locals.currentUser = req.user;
    //console.log(res.locals.currentUser);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.get('/', (req, res)=>{
    //res.send('Welcome to YelpCamp')
    res.redirect('/campgrounds');
})

// app.get('/fakeUser', async(req, res)=>{
//     const User = new user({email: 'prashantgarg815@gmail.com', username: 'rashant'});
//     const newUser = await user.register(User, 'thiS is my password');
//     res.send(newUser);
// })

app.use('/', registerRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);


// app.all('*', (err,req, res, next)=>{
//     next(new ExpressError('page not found', 404));
// })

app.use((err, req, res, next)=>{
    const {statusCode=500} = err;
    if(!err.message){
        err.message = 'Oh boy, something went wrong';
    }
    //res.send('Oh boy, something went wrong');
    console.log(err.message);
    res.status(statusCode).render('error', {err});
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})