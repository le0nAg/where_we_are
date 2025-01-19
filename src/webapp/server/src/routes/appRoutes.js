const router = require("express").Router();
const { userAuthnBearerBased } = require("../middlewares/authMiddleware");
const { getIdFromReq } = require("../utils/jwtUtils");
const User = require("../models/operatorModel");

router.get("/api/map", userAuthnBearerBased, async (req, res) => {
  const id = getIdFromReq(req);
  const user = await User.findById(id).select('username');

  res.json({ message: `Welcome, ${user.username}. You accessed the Map route!` });
});

module.exports = router;