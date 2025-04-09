import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city') || 'Doha';
  const apiKey = process.env.OPENWEATHER_API_KEY; // Add this to your .env file

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weather data');

    const data = await res.json();
    return NextResponse.json({ weather: data });
  } catch (err) {
    return NextResponse.json({ error: 'Weather API error', detail: err.message }, { status: 500 });
  }
}
