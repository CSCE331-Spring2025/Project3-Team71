import { useEffect, useState } from "react";

interface HappyHourWindow {
  start_datetime: string;
  end_datetime: string;
}

export function useHappyHourStatus(): boolean {
  const [isHappyHour, setIsHappyHour] = useState(false);

  useEffect(() => {
    async function fetchHappyHour() {
      try {
        const res = await fetch("/api/happyhour");
        const window: HappyHourWindow = await res.json();

        if (!window?.start_datetime || !window?.end_datetime) return;

        const now = new Date();
        const start = new Date(window.start_datetime);
        const end = new Date(window.end_datetime);

        setIsHappyHour(now >= start && now <= end);
      } catch (error) {
        console.error("Failed to fetch happy hour status", error);
      }
    }

    fetchHappyHour();
  }, []);

  return isHappyHour;
}
