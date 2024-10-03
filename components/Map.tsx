'use client'; // This marks it as a client component

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

type MarkerData = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  curiosity: string;
};

type MapProps = {
  markers: MarkerData[];
  onMarkerClick?: (id: string) => void;
};

const Map = forwardRef(({ markers, onMarkerClick }: MapProps, ref) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the map container div
  const mapInstanceRef = useRef<google.maps.Map | null>(null); // Ref for the Google Maps instance
  const markerInstances = useRef<{ marker: google.maps.Marker; infoWindow: google.maps.InfoWindow }[]>([]);

  let openInfoWindow: google.maps.InfoWindow | null = null;

  useEffect(() => {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapsScript);

    googleMapsScript.addEventListener('load', () => {
      if (mapContainerRef.current) {
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: 0, lng: 0 }, // Initial center
          zoom: 2,
        });

        // Save the map instance to mapInstanceRef
        mapInstanceRef.current = map;

        // Create markers
        const markersInstances = markers.map((markerData) => {
          const marker = new window.google.maps.Marker({
            position: { lat: markerData.lat, lng: markerData.lng },
            map,
            title: markerData.title,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; background-color: #f8fafc; border-radius: 8px;">
                <h3 style="font-size: 1.125rem; font-weight: bold;">${markerData.title}</h3>
                <p style="font-size: 0.875rem;">${markerData.curiosity}</p>
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
            if (onMarkerClick) {
              onMarkerClick(markerData.id);
            }
          });

          markerInstances.current.push({ marker, infoWindow });
          return marker;
        });

        new MarkerClusterer({ markers: markersInstances, map });
      }
    });

    return () => {
      googleMapsScript.remove();
    };
  }, [markers, onMarkerClick]);

  // Use `useImperativeHandle` to expose the `focusMarker` method to the parent component
  useImperativeHandle(ref, () => ({
    focusMarker: (id: string) => {
      const markerData = markers.find((m) => m.id === id); // Find marker data by id

      if (markerData && mapInstanceRef.current) {
        const { lat, lng } = markerData;
        const position = { lat, lng };

        // Set the map center to the marker's lat/lng and zoom in
        mapInstanceRef.current.setCenter(position); // Center the map on the marker
        mapInstanceRef.current.setZoom(10); // Zoom in

        // Find the corresponding marker and info window
        const markerToFocus = markerInstances.current.find(
          (instance) => instance.marker.getTitle() === markerData.title
        );

        if (markerToFocus) {
          const { marker, infoWindow } = markerToFocus;

          if (openInfoWindow) openInfoWindow.close(); // Close any open info windows
          infoWindow.open(mapInstanceRef.current, marker); // Open the info window for the selected marker
          openInfoWindow = infoWindow; // Set the new info window as open
        }
      }
    },
  }));

  return <div ref={mapContainerRef} className="h-96 w-full rounded-lg shadow-lg border" />;
});

Map.displayName = 'Map';

export default Map;
