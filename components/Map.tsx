"use client"

import { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

type GoogleMapProps = google.maps.MapOptions;

const Map = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    window.document.body.appendChild(googleMapsScript);

    googleMapsScript.addEventListener('load', () => {
      if (mapRef.current) {
        const mapOptions: GoogleMapProps = {
          center: { lat: -23.55052, lng: -46.633308 }, // São Paulo, Brazil
          zoom: 5,
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);

        const locations = [
          {
            position: { lat: -23.55052, lng: -46.633308 },
            title: "São Paulo",
            content: `
              <div style="max-width: 200px;">
                <h3>São Paulo</h3>
                <p>São Paulo is the largest city in Brazil and the Southern Hemisphere.</p>
              </div>
            `,
          },
          {
            position: { lat: -22.908333, lng: -43.196388 },
            title: "Rio de Janeiro",
            content: `
              <div style="max-width: 200px;">
                <h3>Rio de Janeiro</h3>
                <p>Famous for Christ the Redeemer and its iconic beaches.</p>
                <a href="https://en.wikipedia.org/wiki/Rio_de_Janeiro" target="_blank">Learn more</a>
              </div>
            `,
          },
          {
            position: { lat: -15.794229, lng: -47.882166 },
            title: "Brasília",
            content: `
              <div style="max-width: 200px;">
                <h3>Brasília</h3>
                <p>Inaugurated as Brazil's capital in 1960.</p>
              </div>
            `,
          },
          {
            position: { lat: -19.916681, lng: -43.934493 },
            title: "Belo Horizonte",
            content: `
              <div style="max-width: 200px;">
                <h3>Belo Horizonte</h3>
                <p>'Beautiful Horizon' in Portuguese.</p>
              </div>
            `,
          },
          {
            position: { lat: -12.9714, lng: -38.5014 },
            title: "Salvador",
            content: `
              <div style="max-width: 200px;">
                <h3>Salvador</h3>
                <p>Known for its outdoor parties and carnivals.</p>
              </div>
            `,
          },
        ];


        const markers = locations.map((location) => {
          const marker = new window.google.maps.Marker({
            position: location.position,
            map,
            title: location.title,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: location.content,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          return marker;
        });

        new MarkerClusterer({ map, markers });
      }
    });

    return () => {
      if (googleMapsScript) {
        googleMapsScript.remove();
      }
    };
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default Map;
