// Add 'use client' to make this a client component
'use client';

import { getMarkers } from '../actions/markers';
import Map from '../../components/Map';
import MarkerList from '../../components/MarkerList';
import { useRef, useEffect, useState } from 'react';

type MarkerData = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  curiosity: string;
};

export default function MapWithListPage() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const mapRef = useRef<{ focusMarker: (id: string) => void } | null>(null);

  // Fetch the markers in the client
  useEffect(() => {
    const fetchMarkers = async () => {
      const markersData = await getMarkers();
      setMarkers(markersData);
    };

    fetchMarkers();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8 lg:max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Map with Marker List</h1>

      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        
        {/* Marker List - Client Component */}
        <MarkerList markers={markers} mapRef={mapRef} />

        {/* Map - Client Component */}
        <div className="lg:w-2/3">
          <Map ref={mapRef} markers={markers} />
        </div>
      </div>
    </div>
  );
}
