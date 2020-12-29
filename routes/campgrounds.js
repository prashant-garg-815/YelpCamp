const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware.js');

// const isAuthor = catchAsync(async(req, res, next)=>{
//     const {id} = req.params;
//     const camp = await Campground.findById(id);
//     if(!camp.author.equals(req.user._id)){
//         req.flash('error', "You must be the author of the campground to edit")
//         res.redirect(`/campgrounds/${camp._id}`);
//     }
//     else{
//         next();
//     }
// })

router.get('/', catchAsync (async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/index', {campgrounds});
}))

router.delete('/:id', isLoggedIn, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(campground.author.equals(req.user._id)){
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Campground removed successfully!');
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        req.flash('error', 'You must be the author to edit this campground');
        res.redirect(`/campgrounds`);
    }
    
}))

router.put('/:id', catchAsync(async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(campground.author.equals(req.user._id)){
        await Campground.findByIdAndUpdate(id, req.body, {runValidators:true});
        req.flash('success', 'Successfully updated the campground!!!');
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        req.flash('error', 'You must be the author to edit this campground');
        res.redirect(`/campgrounds/${id}`);
    }
}))

router.post('/', isLoggedIn, validateCampground, catchAsync (async(req, res)=>{
    const new_campground = new Campground(req.body);
    new_campground.author = req.user._id;
    await new_campground.save();
    req.flash('success', 'Successfully added a campground!!!');
    //console.log(new_campground);
    res.redirect(`/campgrounds/${new_campground._id}`);
}))

router.get('/new', isLoggedIn, (req, res)=>{
    res.render('campground/new');
})

router.get('/:id', catchAsync(async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    if(!campground){
        req.flash('error', 'Campground does not exist anymore!!');
        return res.redirect('/campgrounds');
    }
    //console.log(campground);
    res.render('campground/show', {campground});
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res)=>{
    //res.render('campground/edit', {camp});
    console.log('lol');
    const camp = await Campground.findById(req.params.id);
    res.render('campground/edit', {camp});
}))

module.exports = router;