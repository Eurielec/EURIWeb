export async function geocodeCity(city: string, province: string): Promise<{ latitude: number, longitude: number } | null> {
  if (!city || !province) return null;

  try {
    const query = new URLSearchParams({
      city: city,
      state: province,
      country: 'Spain',
      format: 'json',
      limit: '1'
    });

    // Nominatim usage policy requires a User-Agent
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${query.toString()}`, {
      headers: {
        'User-Agent': 'Eurielec-Web-App (contacto@eurielec.es)'
      }
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
