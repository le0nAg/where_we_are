const router = require("express").Router();
const { userAuthnBearerBased } = require("../middlewares/authMiddleware");
const { getIdFromReq } = require("../utils/jwtUtils");
const User = require("../models/operatorModel");
const PointOfInterest = require("../models/poiSchema");

const API_PREFIX = "/api/app"

router.get(`${API_PREFIX}/map`, userAuthnBearerBased, async (req, res) => {
  const id = getIdFromReq(req);
  const user = await User.findById(id).select('username');

  res.json({ message: `Welcome, ${user.username}. You accessed the Map route!` });
});

router.get(`${API_PREFIX}/getAllPois`, async (req, res) => {
  const pois = await PointOfInterest.find();
  res.json(pois);
});

router.post(`${API_PREFIX}/addPoi`, async (req, res) => {
  console.log("arrived poi:\n");
  console.log(req.body);
  const newPoi = new POI(req.body);
  try {
    const savedPoi = await newPoi.save();
    console.log("saved");
    res.status(201).json(savedPoi);
  } catch (err) {
    console.log("error diocan: ");
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;