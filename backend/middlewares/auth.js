

// Used to read the token
const jwt = require("jwt-then");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw "Forbidden!!";

    // Within the request we can find the token
    const token = req.headers.authorization.split(" ")[1];

    // Need to pass the secret in order to read the token
    const payload = await jwt.verify(token, process.env.SECRET);
    req.payload = payload;

    // Return the Object if user has been authorized
    // If return NULL, than the AUTH object will fail
    next(); 

  } catch (err) {
    res.status(401).json({
      message: "Forbidden 🚫🚫🚫",
    });
  }
};


