// basic setup
const express = require("express");
const app= express();

// public folder setup
const Listing= require("./models/listing.js")

// path and views folder setup
const path= require("path");
app.set("view engine","ejs");
app.set("views", path.join(__dirname , ("views")));

// get data in requests (id or form ) express setup
app.use(express.urlencoded({extended : true}));

// change requestes npm package method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// <---day42 setups start--->
const ejsMate= require("ejs-mate");
app.engine('ejs', ejsMate);

// static files link method (means link style.css or extra javascript file for logic)
app.use(express.static(path.join(__dirname , "/public")));
// <----------day42 end---->

// <---day45 setups start--->
// joi schema validtion 
const {listingSchema}= require("./schema.js");

// wrapAsync function from utils for server side error handling
const wrapAsync = require("./utils/wrapAsync.js");

// custom error handler for express
const ExpressError = require("./utils/ExpressError.js");
// <---day45 setups end--->


// mongoose setup
const mongoose = require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(res=>{
    console.log("connected to DB")
}).catch(err=>{
    console.log(err)
});

async function main(){
    await mongoose.connect(MONGO_URL);
};





// server start and port setup
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});





// setup end-------
// <-------middleware start----->
// schema validtion middleare
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")

        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

// <-------middleware end----->



// <---------main code start--------->

// 1: index route ("/listings")
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
    
});
// <------------>


// 2: add new route listing form ("/listings/new") get req
app.get("/listings/new", (req,res)=>{
    res.render("listings/new")
});

// <------------>

// 3:create route ("/listings") post req for create new listing in DB
app.post("/listings", validateListing ,wrapAsync(async(req,res,next)=>{
      
        // let {title,description,image,price,country,location}= req.body; 
    // let listing = req.body.listing; 
    let newListing = new Listing(req.body.listing);  //this compat way (smart way)
    await newListing.save();

    res.redirect("/listings")
   
}));

// <------------->


// 4: show route ("/listings/:id") [for show data of indiual(particular) linting]
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs", { listing })
}));


// <------------>


// 5:edit route listing ("/listings/:id/edit") get req
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}));

// <---------------->

// 6: update route listings ("/listings/:id/")
app.put("/listings/:id", wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid Data for Listing")
    }


    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)
}));

// <----------->

// 7:delete route ("listings/:id") by method-override package
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}));




// <----------------->

// <-----server side error handling middleware start------->
// for invalid api
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"))
});
// --------
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}= err;
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message)
    
});
// <-----server side error handling middleware end------->



// <-------end-------->



// testing
// app.get("/test",async (req,res)=>{

//     let sampleListing= new Listing({
//         title:"My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "GOA",
//         country:"India"
//     })

//     await sampleListing.save();

//     console.log("sample was saved");
//     res.send("successful testing")
// });