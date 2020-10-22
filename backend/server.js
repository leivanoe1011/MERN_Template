

// This will bring in the ENV variables
require("dotenv").config();

const mongoose = require("mongoose");

const config = require("./config/key");

const mongoose = require("mongoose");

// Connect to the Mongoose server
// The database connection lives in the ENV file
mongoose.connect(config.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  
  // Record Mongoose Error
  mongoose.connection.on("error", (err) => {
    console.log("Mongoose Connection ERROR: " + err.message);
  });
  
  // Open up the Mongoose Connection
  mongoose.connection.once("open", () => {
    console.log("MongoDB Connected!");
  });
















  



