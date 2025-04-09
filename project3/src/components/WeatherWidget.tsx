'use client';

import { useEffect, useState } from 'react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather?city=Doha');
        const data = await res.json();
        if (res.ok) {
          setWeather(data.weather);
        } else {
          setError(data.error || 'Error fetching weather');
        }
      } catch (err) {
        setError('Network error');
      }
    }

    fetchWeather();
  }, []);

  if (error) return null;
  if (!weather) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 bg-white bg-opacity-90 backdrop-blur-md border border-gray-300 shadow-lg rounded-xl p-3 text-sm w-64"
    >
      <h2 className="font-semibold mb-1">Weather in {weather.name}</h2>
      <p>🌡 Temp: {weather.main.temp}°C</p>
      <p>☁️ Condition: {weather.weather[0].description}</p>
    </div>
  );
}
