require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: "1h",
  });
};

module.exports.verifySecretToken = (token) => {
  return jwt.verify(token, process.env.TOKEN_KEY);
}

module.exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
}

module.exports.createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "7d",
  });
}

module.exports.getIdFromReq = (req) => {  
  const token = req.headers['authorization'].split(" ")[1];
  return jwt.verify(token, process.env.TOKEN_KEY).id;
}

module.exports.getIdFromToken = (token) => {  
  return jwt.verify(token, process.env.TOKEN_KEY).id;
}