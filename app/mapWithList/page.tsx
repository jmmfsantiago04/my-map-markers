"use client"

import { useState, useRef, useEffect } from 'react';
import Map from '../../components/Map'; 
import { getMarkers } from '../actions/markers';

const MapWithListPage = () => {
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      const fetchedMarkers = await getMarkers();
      setMarkers(fetchedMarkers);
    };

    fetchMarkers();
  }, []);

  
  const handleMarkerClick = (id: string) => {
    if (mapRef.current) {
      mapRef.current.focusMarker(id);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 lg:max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Map with Marker List</h1>

      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Marker List */}
        <div className="lg:w-1/3 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Marker List</h2>
          <ul className="space-y-4">
            {markers.map((marker) => (
              <li
                key={marker.id}
                onClick={() => handleMarkerClick(marker.id)}
                className="cursor-pointer p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <h3 className="text-xl font-bold text-gray-800">{marker.title}</h3>
                <p className="text-gray-600">{marker.curiosity}</p>
                <p className="text-sm text-gray-500">Lat: {marker.lat}, Lng: {marker.lng}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div className="lg:w-2/3">
          <Map ref={mapRef} />
        </div>
      </div>
    </div>
  );
};

export default MapWithListPage;
