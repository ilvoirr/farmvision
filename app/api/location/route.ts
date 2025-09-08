export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  try {
    // Use OpenWeather's reverse geocoding (free)
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const location = data[0];
      // Build a readable location name
      const locationName = [
        location.name,
        location.state,
        location.country
      ].filter(Boolean).join(', ');
      
      return Response.json({
        name: locationName,
        village: location.name,
        state: location.state,
        country: location.country
      });
    } else {
      return Response.json({ error: 'Location not found' }, { status: 404 });
    }
  } catch (error) {
    return Response.json({ error: 'Failed to get location' }, { status: 500 });
  }
}
