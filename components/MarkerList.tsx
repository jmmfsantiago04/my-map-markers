'use client'; // This marks it as a client component

type MarkerData = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  curiosity: string;
};

type MarkerListProps = {
  markers: MarkerData[];
  mapRef: React.RefObject<{ focusMarker: (id: string) => void }>; // Ref to communicate with the Map component
};

// Client Component for the interactive marker list
export default function MarkerList({ markers, mapRef }: MarkerListProps) {

  const handleMarkerClick = (id: string) => {
    if (mapRef.current) {
      mapRef.current.focusMarker(id); // Call the mapRef's focusMarker method
    }
  };

  return (
    <div className="lg:w-1/3 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Marker List</h2>
      <ul className="space-y-4">
        {markers.map((marker: MarkerData) => (
          <li
            key={marker.id}
            className="cursor-pointer p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            onClick={() => handleMarkerClick(marker.id)} // Interactive onClick handler
          >
            <h3 className="text-xl font-bold text-gray-800">{marker.title}</h3>
            <p className="text-gray-600">{marker.curiosity}</p>
            <p className="text-sm text-gray-500">Lat: {marker.lat}, Lng: {marker.lng}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
