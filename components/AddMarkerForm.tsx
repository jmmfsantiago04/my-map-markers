'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import { addMarker } from '@/app/actions/markers';// Import the server action for adding markers

const AddMarkerForm = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [title, setTitle] = useState('');
  const [curiosity, setCuriosity] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      setErrorMessage('Latitude and longitude must be valid numbers');
      return;
    }

    startTransition(async () => {
      try {
        setErrorMessage(null);
        await addMarker({
          lat: latNum,
          lng: lngNum,
          title,
          curiosity,
        });
        alert('Marker added successfully');
        setLat('');
        setLng('');
        setTitle('');
        setCuriosity('');
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && <div className="text-red-600 bg-red-100 p-2 rounded">{errorMessage}</div>}
      <input
        type="text"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        placeholder="Latitude"
        required
        className="block w-full p-2 border rounded-lg"
      />
      <input
        type="text"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
        placeholder="Longitude"
        required
        className="block w-full p-2 border rounded-lg"
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="block w-full p-2 border rounded-lg"
      />
      <textarea
        value={curiosity}
        onChange={(e) => setCuriosity(e.target.value)}
        placeholder="Curiosity"
        required
        className="block w-full p-2 border rounded-lg"
      />
      <button type="submit" disabled={isPending} className="block w-full p-2 bg-blue-500 text-white rounded-lg">
        {isPending ? 'Adding Marker...' : 'Add Marker'}
      </button>
    </form>
  );
};

export default AddMarkerForm;
