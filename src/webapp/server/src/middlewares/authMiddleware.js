const User = require("../models/operatorModel");
const jwt = require("jsonwebtoken");

//The user is authenticated using a refresh token
module.exports.userAuthnCookieBased = (req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    return res.status(401).json({ status: false, message: "Access Denied. No token provided." });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: false, message: "Invalid token." });
    }

    const user = await User.findById(decoded.id);
    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(401).json({ status: false, message: "User not found." });
    }
  });
};

//The user is authenticated using a Bearer token
module.exports.userAuthnBearerBased = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required." });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Token missing from authorization header." });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
