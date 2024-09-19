import { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

type GoogleMapProps = google.maps.MapOptions;
type City = {
  lat: number;
  lng: number;
  title: string;
  curiosity: string;
};

const Map = ({ origin, destination }: { origin: string; destination: string }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  let openInfoWindow: google.maps.InfoWindow | null = null;

  useEffect(() => {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapsScript);

    googleMapsScript.addEventListener('load', () => {
      if (mapRef.current) {
        const mapOptions: GoogleMapProps = {
          center: { lat: 0, lng: 0 },
          zoom: 2,
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);

        const cities: City[] = [
          { lat: 40.712776, lng: -74.005974, title: 'New York City', curiosity: 'Home to the Statue of Liberty, a gift from France in 1886.' },
          { lat: 48.856613, lng: 2.352222, title: 'Paris', curiosity: 'The Eiffel Tower was supposed to be dismantled after 20 years.' },
          { lat: -33.868820, lng: 151.209290, title: 'Sydney', curiosity: 'The Opera House’s design was chosen from over 200 entries.' },
          { lat: 35.689487, lng: 139.691711, title: 'Tokyo', curiosity: 'The most populous metropolitan area in the world, with over 37 million residents.' },
          { lat: 51.507351, lng: -0.127758, title: 'London', curiosity: 'London has over 170 museums.' },
          { lat: -34.603722, lng: -58.381592, title: 'Buenos Aires', curiosity: 'Known as the "Paris of South America".' },
          { lat: 55.755825, lng: 37.617298, title: 'Moscow', curiosity: 'The Moscow Kremlin is the world’s largest medieval fortress still in use.' },
          { lat: -23.550520, lng: -46.633308, title: 'São Paulo', curiosity: 'Largest city in Brazil and the Southern Hemisphere.' },
          { lat: 39.904202, lng: 116.407394, title: 'Beijing', curiosity: 'Home to the Forbidden City, the largest palace complex in the world.' },
          { lat: -22.906847, lng: -43.172897, title: 'Rio de Janeiro', curiosity: 'Famous for its Carnival and the Christ the Redeemer statue.' },
        ];

        const markers = cities.map((city) => {
          const marker = new window.google.maps.Marker({
            position: { lat: city.lat, lng: city.lng },
            map,
            title: city.title,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="
                padding: 12px;
                background-color: #f8fafc;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 250px;
                font-family: Arial, sans-serif;
              ">
                <h3 style="
                  font-size: 1.125rem;
                  margin-bottom: 8px;
                  font-weight: 600;
                  color: #1f2937;
                ">${city.title}</h3>
                <p style="
                  font-size: 0.875rem;
                  color: #4b5563;
                  line-height: 1.5;
                ">${city.curiosity}</p>
              </div>
            `,
          });

          marker.addListener('click', () => {
            if (openInfoWindow) {
              openInfoWindow.close();
            }
            infoWindow.open(map, marker);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            openInfoWindow = infoWindow;
          });

          return marker;
        });

        new MarkerClusterer({ markers, map });

        if (origin && destination) {
          const directionsService = new window.google.maps.DirectionsService();
          const directionsRenderer = new window.google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map);

          directionsService.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
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

  return <div ref={mapRef} className="h-96 w-full rounded-lg shadow-lg border" />;
};

export default Map;
