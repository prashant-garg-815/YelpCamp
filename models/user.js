const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const { use } = require('../routes/reviews');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);   //Automatically adds username and password to the userSchema

module.exports = mongoose.model('User', userSchema);