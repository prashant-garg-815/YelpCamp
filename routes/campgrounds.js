const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

const validateCampground = (req, res, next)=>{
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

router.get('/', catchAsync (async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/index', {campgrounds});
}))

router.delete('/:id', catchAsync(async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground removed successfully!');
    res.redirect('/campgrounds');
}))

router.put('/:id', catchAsync(async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body, {runValidators:true});
    req.flash('success', 'Successfully updated the campground!!!');
    res.redirect(`/campground/${id}`);
}))

router.post('/', validateCampground, catchAsync (async(req, res)=>{
    const new_campground = new Campground(req.body);
    await new_campground.save();
    req.flash('success', 'Successfully added a campground!!!');
    //console.log(new_campground);
    res.redirect(`/campgrounds/${new_campground._id}`);
}))

router.get('/new', (req, res)=>{
    res.render('campground/new');
})

router.get('/:id', catchAsync(async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', 'Campground does not exist anymore!!');
        return res.redirect('/campgrounds');
    }
    res.render('campground/show', {campground});
}))

router.get('/:id/edit', catchAsync(async(req, res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/edit', {camp});
}))

module.exports = router;