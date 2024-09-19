"use client"

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const Home = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [submittedOrigin, setSubmittedOrigin] = useState('');
  const [submittedDestination, setSubmittedDestination] = useState('');

  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapsScript);

    googleMapsScript.addEventListener('load', () => {
      if (originRef.current && destinationRef.current) {
        const originAutocomplete = new window.google.maps.places.Autocomplete(originRef.current);
        const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationRef.current);


        originAutocomplete.addListener('place_changed', () => {
          const place = originAutocomplete.getPlace();
          if (place.geometry?.location) {
            setOrigin(place.formatted_address || '');
          }
        });

        // Listen for place selection on destination
        destinationAutocomplete.addListener('place_changed', () => {
          const place = destinationAutocomplete.getPlace();
          if (place.geometry?.location) {
            setDestination(place.formatted_address || '');
          }
        });
      }
    });

    return () => {
      if (googleMapsScript) {
        googleMapsScript.remove();
      }
    };
  }, []);

  const handleRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOrigin(origin);
    setSubmittedDestination(destination);
  };

  return (
    <div>
      <Head>
        <title>Google Maps Directions with Autocomplete</title>
        <meta name="description" content="Google Maps Directions with Autocomplete in Next.js 14 with TypeScript" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Google Maps Directions with Autocomplete</h1>

        <form onSubmit={handleRouteSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="origin" className="block text-gray-700 text-sm font-bold mb-2">Origin:</label>
            <input
              type="text"
              id="origin"
              ref={originRef}
              placeholder="Enter origin"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="destination" className="block text-gray-700 text-sm font-bold mb-2">Destination:</label>
            <input
              type="text"
              id="destination"
              ref={destinationRef}
              placeholder="Enter destination"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Get Route
          </button>
        </form>

        {/* Map container */}
        <div className="w-full max-w-4xl mt-8">
          <Map origin={submittedOrigin} destination={submittedDestination} />
        </div>
      </main>
    </div>
  );
};

export default Home;
