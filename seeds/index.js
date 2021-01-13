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
            images: [
                {
                  url: 'https://res.cloudinary.com/striker/image/upload/v1609495262/YelpCamp/ge3ggu3prxhevemvzv0f.png', 
                  filename: 'YelpCamp/ge3ggu3prxhevemvzv0f'
                },
                {
                  url: 'https://res.cloudinary.com/striker/image/upload/v1609495262/YelpCamp/eev3wmsp0nx0obqh6ak6.png', 
                  filename: 'YelpCamp/eev3wmsp0nx0obqh6ak6'
                },
                {
                  url: 'https://res.cloudinary.com/striker/image/upload/v1609495261/YelpCamp/kxpvywvgk7hrdjitn67r.png', 
                  filename: 'YelpCamp/kxpvywvgk7hrdjitn67r'
                }
              ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos suscipit minus vitae recusandae explicabo est cupiditate laudantium ipsam at error. Minus dicta provident optio delectus quaerat sapiente. Labore, sequi magni.',
            price: price
        });
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});