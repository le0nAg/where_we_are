const router = require("express").Router();
const { userAuthnBearerBased } = require("../middlewares/authMiddleware");
const { getIdFromReq } = require("../utils/jwtUtils");
const User = require("../models/operatorModel");
const PointOfInterest = require("../models/poiSchema");

router.get("/api/map", userAuthnBearerBased, async (req, res) => {
  const id = getIdFromReq(req);
  const user = await User.findById(id).select('username');

  res.json({ message: `Welcome, ${user.username}. You accessed the Map route!` });
});

router.get("/api/app/getAllPois", async (req, res) => {
  const pois = await PointOfInterest.find();
  res.json(pois);
});

module.exports = router;