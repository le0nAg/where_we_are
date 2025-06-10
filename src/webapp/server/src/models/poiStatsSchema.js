const mongoose = require('mongoose');

const POIStatsSchema = new mongoose.Schema({
    poiId: { type: mongoose.Schema.Types.ObjectId, ref: 'POI', required: true },
    visits: [{ timestamp: { type: Date, default: Date.now } }],
    rating: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 }
    },
    ratingMensile: [{
      year: Number,
      month: Number, 
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 }
    }],
    
  });
  
const PoiStats = mongoose.model('POIStats', POIStatsSchema);

module.exports = PoiStats;