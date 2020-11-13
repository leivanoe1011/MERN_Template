

const mongoose = require("mongoose");
const User = mongoose.model("User");
const sha256 = require("js-sha256"); // encrypt password
const jwt = require("jwt-then"); // creates token


// Have to make the function below ASYNC
// In order to use AWAIT below. Also it will prevent the Event Handler
// To run before the code below runs
exports.register = async (req, res) => {

  console.log("in register user controller");

  // The order of the object variables below must be the same in the front end
  // const { name, email, password } = req.body;
  const { firstName, lastName, dob, email, password, role } = req.body;

  // Validate that either email extension below exists within the Email Entry
  // May need an API to make sure this is Dynamic
  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

  // email must contain one of the domains above
  if (!emailRegex.test(email)) throw "Email is not supported from your domain.";

  // Password must be 6 characters long at least
  if (password.length < 6) throw "Password must be atleast 6 characters long.";

  // First we validate if the user exists
  // Here we wait until moving to the next line of code
  const userExists = await User.findOne({
    email,
  });

  if (userExists) throw "User with same email already exits.";

  // Create the User Object
  const user = new User({
    email,
    password: sha256(password + process.env.SALT), // SALT will be used to encrypt password
    firstName,
    lastName,
    dob,
    role
  });


  // Load the new User Object
  await user.save();

  res.json({
    message: "User [" + firstName + "] registered successfully!"
  });
};

// The handler is expecting an ASYNC function so we 
// have to make the funtion below ASYNC
exports.login = async (req, res) => {
  
  console.log("In the Login function user controller");

  const { email, password } = req.body;

  const user = await User.findOne({
    email,
    password: sha256(password + process.env.SALT), // SALT to decrypt password
  });

  if (!user) throw "Email and Password did not match.";

  
  // The SECRET below is the key used to generate the token and read the token
  // Create the token which includes the USER ID
  // The user ID is captured above
  const token = await jwt.sign({ id: user.id}, process.env.SECRET);

  // when we query the json object below
  // index 0 is the message
  // index 1 is the token
  // the token is comprised of the User Mongoose _Id
  res.json({
    message: "User logged in successfully!",
    token,
    role: user.role
  });
};
