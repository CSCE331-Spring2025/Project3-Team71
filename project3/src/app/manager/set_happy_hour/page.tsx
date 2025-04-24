"use client";

import { useEffect, useState } from "react";

interface HappyHourEntry {
  id: number;
  start_datetime: string;
  end_datetime: string;
}

export default function SetHappyHourPage() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<HappyHourEntry[]>([]);

  const fetchEntries = async () => {
    const res = await fetch("/api/happyhour/list");
    const data = await res.json();
    setEntries(data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/happyhour", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start_datetime: start, end_datetime: end }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Happy Hour scheduled!");
      fetchEntries();
    } else {
      setMessage("Failed to schedule Happy Hour");
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/happyhour/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Happy Hour entry deleted!");
      fetchEntries();
    } else {
      setMessage("Failed to delete Happy Hour");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-xl bg-accent text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Manage Happy Hour</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date & Time</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              className="w-full p-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date & Time</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              className="w-full p-2 rounded text-black"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Set Happy Hour
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}

        <h2 className="text-xl font-semibold mt-6 mb-2">Scheduled Happy Hours</h2>
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="flex justify-between items-center bg-white text-black px-3 py-2 rounded">
              <span>
                {new Date(entry.start_datetime).toLocaleString()} - {new Date(entry.end_datetime).toLocaleString()}
              </span>
              <button
                onClick={() => handleDelete(entry.id)}
                className="ml-4 text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
