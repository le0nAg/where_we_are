const mongoose = require('mongoose');

const POISchema = new mongoose.Schema({
  type: { type: String, enum: ['Feature'], required: true, default: 'Feature' },
  geometry: {
    type: { type: String, enum: ['Point', 'LineString', 'Polygon'], required: true },
    coordinates: { type: [], required: true }, // Array of coordinates
  },
  properties: {
    name: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }], // Array of image URLs
    osmTags: mongoose.Schema.Types.Mixed, // OSM tags (key-value pairs)
    category: { type: String, enum: ['street', 'place', 'area', 'other'], 
                required: true },
  },
});

const POI = mongoose.model('POI', POISchema);

module.exports = POI;