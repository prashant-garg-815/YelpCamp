const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');

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

app.get('/', (req, res)=>{
    //res.send('Welcome to YelpCamp')
    res.redirect('/campgrounds');
})


const sessionConfig = {
    secret: "Get a session secret that's woth it!!!",
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
app.use(flash());
app.use((req, res, next)=>{
    res.locals.success = req.flash(success);
    res.locals.error = req.flash(error);
    next();
})
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


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