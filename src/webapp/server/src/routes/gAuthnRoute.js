const express = require('express');
const passport = require('passport');
const authnController = require('../controllers/gAuthnController');
const router = express.Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/glogin`,
    session: true
  }),
  authnController.googleCallback
);

// Get current user
router.get('/current-user', authnController.getCurrentUser);

// Logout route
router.get('/glogout', authnController.logout);

// Any other existing authentication routes...

module.exports = router;