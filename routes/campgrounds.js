const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware.js');
const campgroundController = require('../controllers/campgrounds');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });


router.get('/', catchAsync (campgroundController.index))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundController.editCampground))

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync (campgroundController.addCampground))
// router.post('/', upload.array('image'), (req, res, next)=>{
//     console.log(req.files);
//     res.send(req.body);
// })

router.get('/new', isLoggedIn, campgroundController.renderNewForm)

router.get('/:id', catchAsync(campgroundController.showCampgrounds))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm))

module.exports = router;