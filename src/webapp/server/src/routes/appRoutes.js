const router = require("express").Router();
const multer = require("multer");
const path = require("path");
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

//TODO: test and ensure it's complete
router.post(`${API_PREFIX}/addPoi`, async (req, res) => {
  const newPoi  = new PointOfInterest(req.body);
  const util = require('util');
  console.log(util.inspect(req.body, false, null, true /* enable colors */));

  res.status(200);
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

router.delete(`${API_PREFIX}/deletePois`, async (req, res) => {
  const newPoi  = new PointOfInterest(req.body);
  const util = require('util');
  console.log("req arrived");
  console.log(util.inspect(req.body, false, null, true /* enable colors */));

  try {
    res.status(204).json({});
  } catch (err) {
    console.log("error diocan: ");
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// Endpoint for multiple image uploads
//  upload.array("images", 10), <-- if we want to limit the number of upload to X per req
router.post(`${API_PREFIX}/upload-images`, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Extract URLs of uploaded images
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    console.log("Images saved:", imageUrls);
    res.status(201).json({ imageUrls });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Image upload failed" });
  }
});

// GET single POI
router.get(`${API_PREFIX}/pois/:uidPoi`, async (req, res) => {
  try {
    const poi = await PointOfInterest.findById(req.params.uidPoi);
    if (!poi) {
      return res.status(404).json({ message: 'POI non trovato' });
    }
    res.json(poi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE POI
// put method on patch is prefered since the modification could arrive to the point of changing completly the POI
router.put(`${API_PREFIX}/pois/:uidPoi`, async (req, res) => {
  try {
    const updatedPoi = await Poi.findByIdAndUpdate(
      req.params.uidPoi,
      {
        $set: {
          'properties.name': req.body.properties.name,
          'properties.description': req.body.properties.description,
          'properties.images': req.body.properties.images,
          // Aggiungi altri campi modificabili se necessario
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedPoi) {
      return res.status(404).json({ message: 'POI non trovato' });
    }
    
    res.json(updatedPoi);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;