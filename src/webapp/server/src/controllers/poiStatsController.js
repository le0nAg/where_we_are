const PoiStatsSchema = require('../models/poiStatsSchema');

// Get all POIs
exports.getAllPoiStats = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc', populate } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    let query = PoiStatsSchema.find()
      .skip(skip)
      .limit(Math.min(limit, 100))
      .sort({ [sort]: sortOrder });

    if (populate === 'true') {
      query = query.populate('poiId');
    }

    const data = await query;
    const total = await PoiStatsSchema.countDocuments();

    res.json({
      success: true,
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get stats for a specific POI
exports.getPoiStats = async (req, res) => {
  try {
    const { poiId } = req.params;
    const { populate, include_visits = 'true', date_from, date_to } = req.query;

    const filter = { poiId };
    
    if (date_from || date_to) {
      filter['visits.timestamp'] = {};
      if (date_from) filter['visits.timestamp'].$gte = new Date(date_from);
      if (date_to) filter['visits.timestamp'].$lte = new Date(date_to);
    }

    let query = PoiStatsSchema.findOne(filter);
    if (populate === 'true') {
      query = query.populate('poiId');
    }

    const data = await query;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Stats not found' });
    }

    if (include_visits !== 'true') {
      data.visits = undefined;
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// stat per più POI, filtraggio server e resto client
exports.getBulkPoiStats = async (req, res) => {
  try {
    const ids = req.query.ids?.split(',');
    if (!ids?.length) {
      return res.status(400).json({ success: false, error: 'Missing IDs' });
    }

    const { populate, summary_only } = req.query;

    let query = PoiStatsSchema.find({ poiId: { $in: ids } });
    
    if (populate === 'true') {
      query = query.populate('poiId');
    }
    if (summary_only === 'true') {
      query = query.select('-visits');
    }

    const data = await query;
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// principalmente di debug, ma utile per avere un riepilogo delle statistiche
exports.getStatsSummary = async (req, res) => {
  try {
    const poiStats = await PoiStatsSchema.find();
    
    const totalPOIs = poiStats.length;
    const totalVisits = poiStats.reduce((sum, stat) => sum + (stat.visits?.length || 0), 0);
    const totalUpvotes = poiStats.reduce((sum, stat) => sum + (stat.upvotes || 0), 0);
    const totalDownvotes = poiStats.reduce((sum, stat) => sum + (stat.downvotes || 0), 0);
    const averageRating = poiStats.reduce((sum, stat) => sum + (stat.rating || 0), 0) / (totalPOIs || 1);

    const topRatedPOIs = poiStats
      .filter(stat => stat.rating)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        totalPOIs,
        totalVisits,
        totalUpvotes,
        totalDownvotes,
        averageRating,
        topRatedPOIs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// get dei dati per i poi visitati
exports.getVisitAnalytics = async (req, res) => {
  try {
    const { poi_id, date_from, date_to, group_by = 'month', timezone = 'UTC' } = req.query;

    const poiStats = await PoiStatsSchema.findOne({ poiId: poi_id });
    if (!poiStats) {
      return res.status(404).json({ success: false, error: 'Stats not found' });
    }

    const visits = poiStats.visits || [];
    const filteredVisits = visits.filter(visit => {
      const timestamp = new Date(visit.timestamp);
      return (!date_from || timestamp >= new Date(date_from)) && 
             (!date_to || timestamp <= new Date(date_to));
    });

    const visitsByPeriod = {};
    filteredVisits.forEach(visit => {
      const date = new Date(visit.timestamp).toLocaleString('it-IT', {
        timeZone: timezone,
        [group_by]: 'numeric'
      });
      visitsByPeriod[date] = (visitsByPeriod[date] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalVisits: filteredVisits.length,
        visitsByPeriod
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// prendo le statistiche di rating aggregate
exports.getRatingAnalytics = async (req, res) => {
  try {
    const poiStats = await PoiStatsSchema.find();
    
    const overall = {
      upvotes: 0,
      downvotes: 0
    };

    poiStats.forEach(stat => {
      overall.upvotes += stat.upvotes || 0;
      overall.downvotes += stat.downvotes || 0;
    });

    overall.totalVotes = overall.upvotes + overall.downvotes;
    overall.rating = overall.totalVotes ? (overall.upvotes - overall.downvotes) / overall.totalVotes : 0;
    overall.positivePercentage = overall.totalVotes ? (overall.upvotes / overall.totalVotes) * 100 : 0;

    const monthly = {};
    poiStats.forEach(stat => {
      (stat.visits || []).forEach(visit => {
        const month = new Date(visit.timestamp).toISOString().slice(0, 7);
        if (!monthly[month]) {
          monthly[month] = { upvotes: 0, downvotes: 0, totalVotes: 0, rating: 0 };
        }
        monthly[month].upvotes += visit.upvotes || 0;
        monthly[month].downvotes += visit.downvotes || 0;
        monthly[month].totalVotes += (visit.upvotes || 0) + (visit.downvotes || 0);
        monthly[month].rating = monthly[month].totalVotes ? 
          (monthly[month].upvotes - monthly[month].downvotes) / monthly[month].totalVotes : 0;
      });
    });

    res.json({
      success: true,
      data: { overall, monthly }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// I poi più apprezzati
exports.getTopPois = async (req, res) => {
  try {
    const poiStats = await PoiStatsSchema.find();
    const topPois = poiStats
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, 10);

    res.json({ success: true, data: topPois });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// confronto le statistiche di più POI
exports.comparePoiStats = async (req, res) => {
  try {
    const { poi_ids, date_from, date_to } = req.query;
    const ids = poi_ids?.split(',') || [];

    const poiStats = await PoiStatsSchema.find({ poiId: { $in: ids } });
    
    const filteredStats = poiStats.map(stat => {
      const visits = stat.visits?.filter(visit => {
        const timestamp = new Date(visit.timestamp);
        return (!date_from || timestamp >= new Date(date_from)) && 
               (!date_to || timestamp <= new Date(date_to));
      });

      return {
        poiId: stat.poiId,
        visits: visits?.length || 0,
        upvotes: stat.upvotes || 0,
        downvotes: stat.downvotes || 0,
        rating: stat.rating || 0
      };
    });

    res.json({ success: true, data: filteredStats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ricevo le attività recenti di un POI, default nelle ultime 24 ore
exports.getRecentActivity = async (req, res) => {
  try {
    const { poi_id, limit = 20, activity_type, hours = 24 } = req.query;

    const poiStats = await PoiStatsSchema.findOne({ poiId: poi_id });
    if (!poiStats) {
      return res.status(404).json({ success: false, error: 'Stats not found' });
    }

    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);

    const recentActivity = (poiStats.activities || [])
      .filter(activity => {
        const timestamp = new Date(activity.timestamp);
        return timestamp >= cutoff && (!activity_type || activity.type === activity_type);
      })
      .slice(0, limit);

    res.json({ success: true, data: recentActivity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};