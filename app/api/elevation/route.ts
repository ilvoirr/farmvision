export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  try {
    // Free elevation API - no key needed
    const response = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`
    );
    const data = await response.json();
    return Response.json({
      elevation: data.results[0]?.elevation || 0
    });
  } catch (error) {
    return Response.json({ elevation: 0 }, { status: 200 });
  }
}
