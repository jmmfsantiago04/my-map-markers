import { getMarkers } from '../actions/markers';
import AddMarkerForm from '../../components/AddMarkerForm';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../components/Map'), { ssr: false });


export default async function AdminPage() {
  const markers = await getMarkers();

  return (
    <div className="container mx-auto p-6 space-y-8 lg:max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>

      <AddMarkerForm />

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Existing Markers</h2>
        {markers.length > 0 ? (
          <ul className="space-y-4">
            {markers.map((marker) => (
              <li
                key={marker.id}
                className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{marker.title}</h3>
                  <p className="text-gray-600">{marker.curiosity}</p>
                  <p className="text-sm text-gray-500">
                    Latitude: {marker.lat}, Longitude: {marker.lng}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No markers available</p>
        )}
      </div>

      <div className="lg:w-2/3">
        <Map />
      </div>
    </div>
  );
}
