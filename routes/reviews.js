const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const {reviewSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateReview, isAuthor, isReviewAuthor} = require('../middleware');
const reviewController = require('../controllers/reviews');


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

router.post('/', isLoggedIn, validateReview,  catchAsync(reviewController.addReview))

module.exports = router;