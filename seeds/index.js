const express = require('express');
const app = express();
const path = require('path');
const Campground = require('../models/campground');
const citites = require('./cities');
const {descriptors, places} = require('./seedHelpers');

const mongoose = require('mongoose');
const campground = require('../models/campground');
const { title } = require('process');
mongoose.connect('mongodb://localhost/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
  console.log('Database connected!!')
});


const sample = array => array[Math.floor(Math.random()*array.length)];
const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let c=0; c<50; c++){
        const rand = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '5fe73a0d290bd41f5c2d402d',
            location: `${citites[rand].city}, ${citites[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos suscipit minus vitae recusandae explicabo est cupiditate laudantium ipsam at error. Minus dicta provident optio delectus quaerat sapiente. Labore, sequi magni.',
            price: price
        });
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});