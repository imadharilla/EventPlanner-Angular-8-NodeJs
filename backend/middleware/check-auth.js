const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "secret_aimad_bajbsayasuygsaygxhvxygaihas");
  req.userData = {email: decodedToken.email, userId: decodedToken.userId};
  next();
} catch(err) {
    res.status(401).json({message: "You're not authenticated yet! Please login first"});
  }

};
