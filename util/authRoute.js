const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

module.exports = mashDBAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const token = authorization.replace("Bearer ", "");
  var secret = Buffer.from(process.env.SECRETE_KEY, "base64");
  jwt.verify(token, secret, (err, decodedToken) => {
    if (!err) {
      const { _id } = decodedToken;
      User.findById(_id)
        .select("-password")
        .then((userData) => {
          req.user = userData;
          return next();
        });
    } else {
      return res.status(403).json(err);
    }
  });
};
