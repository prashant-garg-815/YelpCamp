const Campground = require('../models/campground');

module.exports.index = async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/index', {campgrounds});
};

module.exports.deleteCampground =  async(req, res)=>{
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
    
}

module.exports.editCampground = async(req, res)=>{
    const {id} = req.params;
    console.log(req.body);
    const campground = await Campground.findById(id);
    if(campground.author.equals(req.user._id)){
        await Campground.findByIdAndUpdate(id, req.body, {runValidators:true});
        //console.log(req.files);
        const img = req.files.map(f=>({url: f.path, filename: f.filename}));
        campground.images.push(...img);
        await campground.save();
        req.flash('success', 'Successfully updated the campground!!!');
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        req.flash('error', 'You must be the author to edit this campground');
        res.redirect(`/campgrounds/${id}`);
    }
}

module.exports.addCampground = async(req, res)=>{
    const new_campground = new Campground(req.body);
    new_campground.images = req.files.map(f=>({url: f.path, filename: f.filename}));
    new_campground.author = req.user._id;
    await new_campground.save();
    console.log(new_campground);
    req.flash('success', 'Successfully added a campground!!!');
    //console.log(new_campground);
    res.redirect(`/campgrounds/${new_campground._id}`);
}

module.exports.renderNewForm = (req, res)=>{
    res.render('campground/new');
}

module.exports.showCampgrounds = async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Campground does not exist anymore!!');
        return res.redirect('/campgrounds');
    }
    //console.log(campground);
    res.render('campground/show', {campground});
}

module.exports.renderEditForm = async(req, res)=>{
    //res.render('campground/edit', {camp});
    console.log('lol');
    const camp = await Campground.findById(req.params.id);
    res.render('campground/edit', {camp});
}