function generateKML(pois) {
    const placemarks = pois.map(poi => {
      const coords = poi.geometry?.coordinates?.[0]?.[0];
      const [lng, lat] = coords || [0, 0];
      
      return `    <Placemark>
        <name>${poi.properties.name || 'Unnamed'}</name>
        <description>${poi.properties.description || ''}</description>
        <Point>
          <coordinates>${lng},${lat},0</coordinates>
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