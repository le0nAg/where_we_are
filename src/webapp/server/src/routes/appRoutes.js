const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { userAuthnBearerBased } = require("../middlewares/authMiddleware");
const { getIdFromReq } = require("../utils/jwtUtils");
const User = require("../models/operatorModel");
const PointOfInterest = require("../models/poiSchema");

const util = require('util');

const API_PREFIX = "/api/app"


router.get(`${API_PREFIX}/getAllPois`, async (req, res) => {
  const pois = await PointOfInterest.find();
  res.json(pois);
});

router.post(`${API_PREFIX}/addPoi`, async (req, res) => {
  res.status(200);

  try {
    const newPoi = new PointOfInterest(req.body);
    const savedPoi = await newPoi.save();
    
    res.status(201).json(savedPoi); 
  } catch (err) {
    
    res.status(400).json({ message: err.message });
  }
});

router.delete(`${API_PREFIX}/deletePois`, async (req, res) => {
  try {
    const idsToDelete = req.body.ids;
    
    if (!idsToDelete || !Array.isArray(idsToDelete) || idsToDelete.length === 0) {
      return res.status(400).json({ message: "Invalid or empty ID array" });
    }

    const result = await PointOfInterest.deleteMany({ _id: { $in: idsToDelete } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No POIs found with given IDs" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get(`${API_PREFIX}/pois/:uidPoi`, async (req, res) => {
  try {
    const poi = await PointOfInterest.findById(req.params.uidPoi);
    if (!poi) {
      return res.status(404).json({ message: 'POI non trovato' });
    }
    res.json(poi);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

//TODO manage upload images
router.put(`${API_PREFIX}/pois/:uidPoi`, async (req, res) => {
  try {
    const poiId = req.params.uidPoi;
    console.log(poiId);
    console.log(util.inspect(req.body, false, null, true));

    const updateData = {
      'properties.name': req.body.properties?.name || req.body.name,
      'properties.description': req.body.properties?.description || req.body.description,
    };

    const updatedPoi = await PointOfInterest.findByIdAndUpdate(poiId, { $set: updateData }, { new: true, runValidators: true });

    if (!updatedPoi) {
      return res.status(404).json({ message: 'POI non trovato' });
    }

    res.json(updatedPoi);
    console.log('save successful');
  } catch (err) {
    console.error("Error updating POI:", err);
    res.status(400).json({ message: err.message });
  }
});

//FINO A QUI FUNZIONANO 

//IMAGE MANAGEMENT 
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

module.exports = router;