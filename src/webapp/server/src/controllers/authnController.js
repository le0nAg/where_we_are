const Operator = require("../models/operatorModel");
const { createSecretToken, createRefreshToken, verifySecretToken, verifyRefreshToken } = require("../utils/jwtUtils");
const argon2 = require('argon2');

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await Operator.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await Operator.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await Operator.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const auth = await argon2.verify(user.password, password);
    if (!auth) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const accessToken = createSecretToken(user._id); 
    const refreshToken = createRefreshToken(user._id); 

    // Imposta i cookie HTTP-only
    res.cookie("accessToken", accessToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict", // Previene attacchi CSRF
      maxAge: 3600000, // 1 ora di validità
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 3600000, // 7 giorni di validità
    });

    res.status(200).json({ message: "User logged in successfully", success: true });

    next();
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
    console.error(error);
  }
};

module.exports.Logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "User logged out successfully", success: true });
    next();
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
    console.error(error);
  }
};

module.exports.RefreshToken = async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: 'strict',
      })
      .json({ message: "Access token refreshed", success: true, accessToken });
      
  } catch (error) {
    return res.status(400).send('Invalid refresh token.');
  }
}

module.exports.CheckAuth = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ isAuthenticated: false });
    }

    const decoded = verifySecretToken(accessToken);
    res.status(200).json({ isAuthenticated: true, user: decoded.user });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
};

