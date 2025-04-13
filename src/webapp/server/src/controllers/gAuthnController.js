const User = require('../models/userModel');
const passport = require('passport');

exports.googleCallback = (req, res) => {
  res.redirect(process.env.CLIENT_URL);
};

exports.getCurrentUser = (req, res) => {
  if (req.user) {
    res.json({
      isAuthenticated: true,
      user: req.user
    });
  } else {
    res.json({
      isAuthenticated: false,
      user: null
    });
  }
};

exports.logout = (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect(process.env.CLIENT_URL);
  });
};