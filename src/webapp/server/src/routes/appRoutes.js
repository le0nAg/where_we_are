const router = require("express").Router();
const path = require("path");
const { userAuthnBearerBased } = require("../middlewares/authMiddleware");
const { getIdFromReq } = require("../utils/jwtUtils");
const User = require("../models/operatorModel");
const PointOfInterest = require("../models/poiSchema");
const poiStatsController = require("../controllers/poiStatsController");  


function generateKML(pois) {
  const placemarks = pois.map(poi => {
    const coords = poi.geometry?.coordinates?.[0]?.[0];
    const [lng, lat] = coords || [0, 0];
    
    return `    <Placemark>
      <name>${poi.properties.name || 'Unnamed'}</name>
      <description>${poi.properties.description || ''}</description>
      <Point>
        <coordinates>${lat},${lng},0</coordinates>
      </Point>
    </Placemark>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>POIs Export</name>
${placemarks}
  </Document>
</kml>`;
}

const multer = require("multer");
const upload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({ storage: upload }).array('files');

const util = require('util');

const API_PREFIX = "/api/app"
const API_PREFIX_STAT = "/api/stat"

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


//TODO manage upload images, done
router.put(`${API_PREFIX}/pois/:uidPoi`, async (req, res) => {
  console.log(req.body);
  try {
    const poiId = req.params.uidPoi;
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

router.post(`${API_PREFIX}/upload-images`, uploadMiddleware, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    const poiId = req.body.poiId;

    const updatedPoi = await PointOfInterest.findByIdAndUpdate(
      poiId,
      { $push: { 'properties.images': { $each: imageUrls } } },
      { new: true }
    );

    if (!updatedPoi) {
      return res.status(404).json({ message: "POI not found" });
    }

    console.log("Images saved and POI updated:", updatedPoi);
    res.status(201).json({ imageUrls });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Image upload failed" });
  }
});

router.delete(`${API_PREFIX}/images/:imageUrl`, async (req, res) => {
  try {
    const imageUrl = req.params.imageUrl;
    const poiId = req.body.poiId;

    const updatedPoi = await PointOfInterest.findByIdAndUpdate(
      poiId,
      { $pull: { 'properties.images': imageUrl } },
      { new: true }
    );

    if (!updatedPoi) {
      return res.status(404).json({ message: "POI not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Failed to delete image" });
  }
});

// gli endpoint più complessi (quelli per l'interrogazione dei dati)
// li gestisco con un controller (comeper l'auth)
router.get(`${API_PREFIX_STAT}/stats`, poiStatsController.getAllPoiStats);

router.get(`${API_PREFIX_STAT}/poi/:poiId`, poiStatsController.getPoiStats);

router.get(`${API_PREFIX_STAT}/bulk`, poiStatsController.getBulkPoiStats);

router.get(`${API_PREFIX_STAT}/summary`, poiStatsController.getStatsSummary);

router.get(`${API_PREFIX_STAT}/visits`, poiStatsController.getVisitAnalytics);

router.get(`${API_PREFIX_STAT}/ratings`, poiStatsController.getRatingAnalytics);

router.get(`${API_PREFIX_STAT}/top`, poiStatsController.getTopPois);

router.get(`${API_PREFIX_STAT}/compare`, poiStatsController.comparePoiStats);

router.get(`${API_PREFIX_STAT}/recent`, poiStatsController.getRecentActivity);

// gli endpoint più semplici (update dei dati: lik/dislike, visita) li gestisco con 
// una funzione in linea

// aggiungo un like al poi
router.put(`${API_PREFIX_STAT}/like/:poid`, async (req, res) => {
  try {
    const { poid } = req.params;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const poiStats = await PoiStatsSchema.findOneAndUpdate(
      { poiId: poid },
      {
        $inc: { 'rating.upvotes': 1 },
        $setOnInsert: { poiId: poid, visits: [] }
      },
      { upsert: true, new: true }
    );

    //aggiorno le stats del mese
    await PoiStatsSchema.updateOne(
      { poiId: poid, 'ratingMensile.year': year, 'ratingMensile.month': month },
      { $inc: { 'ratingMensile.$.upvotes': 1 } }
    );

    await PoiStatsSchema.updateOne(
      { poiId: poid, 'ratingMensile.year': { $ne: year }, 'ratingMensile.month': { $ne: month } },
      { $push: { ratingMensile: { year, month, upvotes: 1, downvotes: 0 } } }
    );

    res.json({
      success: true,
      data: { poiId: poid, upvotes: poiStats.rating.upvotes, downvotes: poiStats.rating.downvotes }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// aggiungo un unlike a POI
router.put(`${API_PREFIX_STAT}/unlike/:poid`, async (req, res) => {
  try {
    const { poid } = req.params;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const poiStats = await PoiStatsSchema.findOneAndUpdate(
      { poiId: poid },
      {
        $inc: { 'rating.downvotes': 1 },
        $setOnInsert: { poiId: poid, visits: [] }
      },
      { upsert: true, new: true }
    );

    await PoiStatsSchema.updateOne(
      { poiId: poid, 'ratingMensile.year': year, 'ratingMensile.month': month },
      { $inc: { 'ratingMensile.$.downvotes': 1 } }
    );

    await PoiStatsSchema.updateOne(
      { poiId: poid, 'ratingMensile.year': { $ne: year }, 'ratingMensile.month': { $ne: month } },
      { $push: { ratingMensile: { year, month, upvotes: 0, downvotes: 1 } } }
    );

    res.json({
      success: true,
      data: { poiId: poid, upvotes: poiStats.rating.upvotes, downvotes: poiStats.rating.downvotes }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// aggiungo la visita ad un POI
router.put(`${API_PREFIX_STAT}/visit/:poid`, async (req, res) => {
  try {
    const { poid } = req.params;

    const poiStats = await PoiStatsSchema.findOneAndUpdate(
      { poiId: poid },
      {
        $push: { visits: { timestamp: new Date() } },
        $setOnInsert: { rating: { upvotes: 0, downvotes: 0 }, ratingMensile: [] }
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      data: { poiId: poid, totalVisits: poiStats.visits.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});




router.get(`${API_PREFIX}/download`, async (req, res) => {
  try {
    const { pois } = req.query;
    
    if (!pois) {
      return res.status(400).json({ message: "Missing 'pois' parameter" });
    }

    const poiIds = pois.split(',').filter(id => id.trim());
    const foundPois = await PointOfInterest.find({ _id: { $in: poiIds } });

    if (foundPois.length === 0) {
      return res.status(404).json({ message: "No POIs found" });
    }

    const kml = generateKML(foundPois);

    res.setHeader('Content-Type', 'application/vnd.google-earth.kml+xml');
    res.setHeader('Content-Disposition', `attachment; filename="pois.kml"`);
    res.send(kml);

  } catch (error) {
    res.status(500).json({ message: "Failed to generate KML" });
  }
});


router.get(`${API_PREFIX}/user`, userAuthnBearerBased, async (req, res) => {
  try {
    const userId = getIdFromReq(req);
    const user = await User.findById(userId).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 
);


module.exports = router;