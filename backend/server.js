

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

//Bring in the models
require("./models/User");
require("./models/Chatroom");
require("./models/Message");


// Bring in the Express Server
const app = require("./app");

const PORT = process.env.PORT || 8000

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


const io = require("socket.io")(server);
const jwt = require("jwt-then");


const Message = mongoose.model("Message");
const User = mongoose.model("User");



io.use(async (socket, next) => {
    try{

        console.log("In socket io validating JWT token");

        const token = socket.handshake.query.token;

        // validate the token is correct
        const payload = await jwt.verify(token, process.env.SECRET);

        // Get the Mongo DB User ID
        socket.userId = payload.id;

        // Return the object with the verification information above
        next();
    }
    catch(err){}
});


// socket io listening
io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);
  
    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.userId);
    });
  
    socket.on("joinRoom", ({ chatroomId }) => {
      socket.join(chatroomId);
      console.log("A user joined chatroom: " + chatroomId);
    });
  
    socket.on("leaveRoom", ({ chatroomId }) => {
      socket.leave(chatroomId);
      console.log("A user left chatroom: " + chatroomId);
    });
  
    socket.on("chatroomMessage", async ({ chatroomId, message }) => {
      
      console.log("In socket Chatroom Message");
      
      if (message.trim().length > 0) {
        const user = await User.findOne({ _id: socket.userId });
        const newMessage = new Message({
          chatroom: chatroomId,
          user: socket.userId,
          message,
        });
  
        console.log(newMessage);
  
        io.to(chatroomId).emit("newMessage", {
          message,
          name: user.name,
  
          // This user ID is used to track the User that typed the message
          userId: socket.userId,
        });
        await newMessage.save();
      }
  
    });
      
  });
  

















