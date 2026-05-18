const fs = require('fs');
const https = require('https');

const delay = ms => new Promise(res => setTimeout(res, ms));

function geocodeServerSide(city, country) {
  return new Promise((resolve) => {
    // Basic formatting
    const q = encodeURIComponent(`${city}, ${country}`);
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;
    
    https.get(url, { headers: { 'User-Agent': 'EurielecDemoProject/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.length > 0) {
            resolve({
              lat: parseFloat(parsed[0].lat),
              lon: parseFloat(parsed[0].lon)
            });
          } else {
            resolve(null);
          }
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

(async () => {
  const rawData = fs.readFileSync('tmp-eestec-api-0.json', 'utf8');
  let branches = [];
  try {
    const json = JSON.parse(rawData);
    branches = json.data || json;
  } catch(e) {
    console.error("Error parsing JSON", e);
    return;
  }

  const results = [];
  
  for (let i = 0; i < branches.length; i++) {
    const b = branches[i];
    console.log(`Geocoding ${i+1}/${branches.length}: ${b.name}, ${b.country}`);
    const coords = await geocodeServerSide(b.name, b.country);
    
    // We add it even if coordinates failed, just without coords
    results.push({
      name: b.name,
      country: b.country,
      type: b.branch_type?.name || 'Local Committee',
      website: b.website,
      member_no: b.member_no,
      coords: coords ? [coords.lon, coords.lat] : null
    });
    
    // 1 request per second policy for Nominatim
    await delay(1100);
  }

  // Save to public dir so the frontend map can load it statically
  fs.writeFileSync('public/eestec-lcs.json', JSON.stringify(results, null, 2));
  console.log('Saved to public/eestec-lcs.json successfully!');
})();
