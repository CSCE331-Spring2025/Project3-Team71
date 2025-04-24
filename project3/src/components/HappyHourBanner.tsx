"use client";

import { useEffect, useState } from "react";

export default function HappyHourBanner() {
  const [endTime, setEndTime] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/happyhour")
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const start = new Date(data.start_datetime);
        const end = new Date(data.end_datetime);

        if (now >= start && now <= end) {
          setEndTime(new Date(data.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      });
  }, []);

  if (!endTime) return null;

  return (
    <div className="bg-yellow-400 text-black text-center py-2 font-bold">
      🎉 Happy Hour is ON! Ends at {endTime}
    </div>
  );
}
