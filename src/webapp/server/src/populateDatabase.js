/**
 * File di utility per popolare il database con statistiche "fake"
 */

const mongoose = require('mongoose');
const POI = require('./models/poiSchema');
const POIStats = require('./models/poiStatsSchema');

mongoose.connect('mongodb+srv://mongo:zaBWxOgns1V60GfE@wwa-cluster.cugjh.mongodb.net/?retryWrites=true&w=majority&appName=wwa-cluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateInDays(days) {
  const now = new Date();
  const pastDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  const randomTime = pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
  return new Date(randomTime);
}

function generateVisits(poiCategory) {
  const visits = [];
  let numVisits;
  
  switch (poiCategory) {
    case 'street':
      numVisits = randomBetween(50, 200);
      break;
    case 'place':
      numVisits = randomBetween(100, 500);
      break;
    case 'area':
      numVisits = randomBetween(30, 150);
      break;
    default:
      numVisits = randomBetween(20, 100);
  }

  // distribuisco le visite in un 365 giorni
  for (let i = 0; i < numVisits; i++) {
    visits.push({
      timestamp: randomDateInDays(365)
    });
  }
  
    // ordino le visite per data
  visits.sort((a, b) => a.timestamp - b.timestamp);
  
  return visits;
}

function generateRatings(visits) {
  const totalVisits = visits.length;
  
  const ratingRate = Math.random() * 0.2 + 0.1; // 10-30%, modificare in caso di stat con bias diverse
  const totalRatings = Math.floor(totalVisits * ratingRate);
  
  const upvoteBias = Math.random() * 0.1 + 0.7; // 70-80%
  const upvotes = Math.floor(totalRatings * upvoteBias);
  const downvotes = totalRatings - upvotes;
  
  return { upvotes, downvotes };
}

function generateMonthlyRatings(visits, overallRating) {
  const monthlyRatings = {};
  
  visits.forEach(visit => {
    const date = new Date(visit.timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // i mesi di MongoDB sono 1-based (DC...)
    const key = `${year}-${month}`;
    
    if (!monthlyRatings[key]) {
      monthlyRatings[key] = {
        year,
        month,
        visits: 0,
        upvotes: 0,
        downvotes: 0
      };
    }
    monthlyRatings[key].visits++;
  });
  
  const totalVisits = visits.length;
  const ratingMensile = [];
  
  Object.values(monthlyRatings).forEach(monthData => {
    const monthVisitRatio = monthData.visits / totalVisits;
    const monthUpvotes = Math.floor(overallRating.upvotes * monthVisitRatio);
    const monthDownvotes = Math.floor(overallRating.downvotes * monthVisitRatio);
    
    if (monthUpvotes > 0 || monthDownvotes > 0) {
      ratingMensile.push({
        year: monthData.year,
        month: monthData.month,
        upvotes: monthUpvotes,
        downvotes: monthDownvotes
      });
    }
  });
  
  return ratingMensile;
}

async function generateFakeStats() {
  try {
    console.log('Starting fake stats generation...\n');
    
    const pois = await POI.find({});
    console.log(`Trovati ${pois.length} POIs in the database`);
    
    if (pois.length === 0) {
      console.log('No POIs found');
      return;
    }
    
    const existingStats = await POIStats.find({});
    if (existingStats.length > 0) {
      console.log(`Warning: Found ${existingStats.length} existing POI stats.`);
    }
    
    let createdCount = 0;
    
    for (const poi of pois) {
      try {
        const existingStat = await POIStats.findOne({ poiId: poi._id });
        if (existingStat) {
          console.log(`Stats already exist for POI: ${poi.properties.name} (${poi._id})`);
          continue;
        }
        
        const visits = generateVisits(poi.properties.category);
        const ratings = generateRatings(visits);
        const ratingMensile = generateMonthlyRatings(visits, ratings);
        

        const poiStats = new POIStats({
          poiId: poi._id,
          visits: visits,
          rating: {
            upvotes: ratings.upvotes,
            downvotes: ratings.downvotes
          },
          ratingMensile: ratingMensile
        });
        
        await poiStats.save();
        createdCount++;
        
        console.log(`Stats per POI: ${poi.properties.name}`);
        console.log(`  - visite: ${visits.length}`);
        console.log(`  - Upvotes: ${ratings.upvotes}, Downvotes: ${ratings.downvotes}`);
        console.log(`  - datiMensili: ${ratingMensile.length}`);
        
      } catch (error) {
        console.error("Errore: ", error.message);
      }
    }

    console.log('-----------------------------------');
    console.log('database popolato');
    console.log('-----------------------------------');

  } catch (error) {
    console.error('Error generating fake stats:', error);
  } finally {
    await mongoose.connection.close();
  }
}

async function clearAllStats() {
  try {
    const result = await POIStats.deleteMany({});
    console.log('statistiche eliminate');
  } catch (error) {
    console.error('Errorore: ', error.message);
  }
}

if (require.main === module) {
  // decommentare per pulire prima di generare i dati
  clearAllStats().then(() => generateFakeStats());
  
//   generateFakeStats();
}
