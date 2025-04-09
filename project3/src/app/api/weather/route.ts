import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city') || 'College Station';
  const lat = req.nextUrl.searchParams.get('lat');
  const long = req.nextUrl.searchParams.get('long');
  const apiKey = process.env.OPENWEATHER_API_KEY; // Add this to your .env file

  const url = `https://api.openweathermap.org/data/2.5/weather?lon=${lat}&lat=${long}&appid=${apiKey}&units=metric`;
  console.log('Weather API URL:', url); // Debugging line
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weather data');

    const data = await res.json();
    return NextResponse.json({ weather: data });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: 'Weather API error', detail: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
  
}
