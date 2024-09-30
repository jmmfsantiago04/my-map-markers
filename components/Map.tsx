'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { getMarkers } from '@/app/actions/markers';

type MarkerData = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  curiosity: string;
};

type MapProps = {
  onMarkerClick?: (id: string) => void;
};

// ForwardRef allows the parent to call focusMarker from outside the component
const Map = forwardRef(({ onMarkerClick }: MapProps, ref) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [markersData, setMarkersData] = useState<MarkerData[]>([]);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const markerInstances = useRef<{ marker: google.maps.Marker; infoWindow: google.maps.InfoWindow }[]>([]);

  let openInfoWindow: google.maps.InfoWindow | null = null;

  // Fetch markers from the database
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const markers = await getMarkers();
        setMarkersData(markers);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };

    fetchMarkers();
  }, []);

  // Initialize Google Map and add markers
  useEffect(() => {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapsScript);

    googleMapsScript.addEventListener('load', () => {
      if (mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2, // Initial zoom level
        });
        setMapInstance(map);

        const markers = markersData.map((markerData) => {
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

          // Add click listener for markers to open info windows
          marker.addListener('click', () => {
            if (openInfoWindow) openInfoWindow.close();
            infoWindow.open(map, marker);
            openInfoWindow = infoWindow;

            // Center the map on the clicked marker and set a reasonable zoom level
            map.setCenter(marker.getPosition());
            map.setZoom(10); // Reasonable zoom level

            if (onMarkerClick) {
              onMarkerClick(markerData.id);
            }
          });

          markerInstances.current.push({ marker, infoWindow });

          return marker;
        });

        new MarkerClusterer({ markers, map });
      }
    });

    return () => {
      if (googleMapsScript) {
        googleMapsScript.remove();
      }
    };
  }, [markersData, onMarkerClick]);

  // Expose the `focusMarker` method to parent components
  useImperativeHandle(ref, () => ({
    focusMarker: (id: string) => {
      const markerToFocus = markerInstances.current.find((instance) => {
        const position = instance.marker.getPosition();
        return position?.lat() === markersData.find((m) => m.id === id)?.lat &&
               position?.lng() === markersData.find((m) => m.id === id)?.lng;
      });

      if (markerToFocus && mapInstance) {
        // Center map on the marker and open its info window
        mapInstance.setCenter(markerToFocus.marker.getPosition());
        mapInstance.setZoom(5); // Set zoom level to 10, not too close

        if (openInfoWindow) openInfoWindow.close();
        markerToFocus.infoWindow.open(mapInstance, markerToFocus.marker);
        openInfoWindow = markerToFocus.infoWindow;
      }
    },
  }));

  return <div ref={mapRef} className="h-96 w-full rounded-lg shadow-lg border" />;
});

Map.displayName = 'Map';

export default Map;
