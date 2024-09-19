"use client"

import { useEffect, useRef } from 'react';

type GoogleMapProps = google.maps.MapOptions;
type DirectionsProps = {
  origin: string;
  destination: string;
};

const Map = ({ origin, destination }: DirectionsProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`; // Load Places API
    window.document.body.appendChild(googleMapsScript);

    googleMapsScript.addEventListener('load', () => {
      if (mapRef.current) {
        const mapOptions: GoogleMapProps = {
          center: { lat: -12.9777, lng: -38.5016 }, //Salvador
          zoom: 5,
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);

        if (origin && destination) {
          const directionsService = new window.google.maps.DirectionsService();
          const directionsRenderer = new window.google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map);

          directionsService.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING},
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
              } else {
                console.error('Error fetching directions', result);
              }
            }
          );
        }
      }
    });

    return () => {
      if (googleMapsScript) {
        googleMapsScript.remove();
      }
    };
  }, [origin, destination]);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default Map;
