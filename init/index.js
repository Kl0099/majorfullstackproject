const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");



main().catch(err => console.log(err));

async function main() {
 await mongoose.connect('mongodb://127.0.0.1:27017/airhub');

 // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj , owner: "653c9e4b0c11370047b82948"}))
    await Listing.insertMany(initData.data);
    console.log("data was init");
}

initDB();