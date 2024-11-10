const mongoose= require("mongoose");

const Schema= mongoose.Schema;


// <-------start-------->

// 1: listing schema
const listingSchema= new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: String,
        // default:"https://unsplash.com/illustrations/city-landscape-with-houses-trees-and-clouds-design-architecture-and-urban-theme-vector-illustration-VM3PtJAkk8o",
        // set: (v)=> 
        //     v === "" ? "https://unsplash.com/illustrations/city-landscape-with-houses-trees-and-clouds-design-architecture-and-urban-theme-vector-illustration-VM3PtJAkk8o" : v
    },
    price: Number,
    location: String,
    country: String
});


const Listing= mongoose.model("Listing", listingSchema);

module.exports = Listing;