'use client';

import { useState } from 'react';
import { addMarker } from '@/app/actions/markers'; 
import { useTransition } from 'react';

export default function AddMarkerForm() {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [title, setTitle] = useState('');
  const [curiosity, setCuriosity] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      addMarker({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        title,
        curiosity,
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        placeholder="Latitude"
        className="block w-full p-2 border rounded-lg"
        required
      />
      <input
        type="text"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
        placeholder="Longitude"
        className="block w-full p-2 border rounded-lg"
        required
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="block w-full p-2 border rounded-lg"
        required
      />
      <textarea
        value={curiosity}
        onChange={(e) => setCuriosity(e.target.value)}
        placeholder="Curiosity"
        className="block w-full p-2 border rounded-lg"
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="block w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {isPending ? 'Adding Marker...' : 'Add Marker'}
      </button>
    </form>
  );
}
