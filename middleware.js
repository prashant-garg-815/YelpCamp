const Campground = require('./models/campground');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');

module.exports.isAuthor = catchAsync(async(req, res, next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', "You must be the author of the campground to edit")
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        next();
    }
})

module.exports.isReviewAuthor = catchAsync(async(req, res, next)=>{
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "You must be the author of the campground to edit")
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        next();
    }
})

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', "You must be logged in!");
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
        console.log(result);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
        //console.log(result);
    }
    else{
        next();
    }
}
