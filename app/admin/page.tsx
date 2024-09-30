"use client"
import dynamic from 'next/dynamic';
import AddMarkerForm from '@/components/AddMarkerForm';
import { getMarkers, deleteMarker, editMarker } from '../actions/markers';
import { useEffect, useState } from 'react';


const MapWithNoSSR = dynamic(() => import('@/components/Map'), { ssr: false });

const AdminPage = () => {
  const [markers, setMarkers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editMarkerData, setEditMarkerData] = useState({ id: '', lat: '', lng: '', title: '', curiosity: '' });


  useEffect(() => {
    const fetchMarkers = async () => {
      const fetchedMarkers = await getMarkers();
      setMarkers(fetchedMarkers);
    };

    fetchMarkers();
  }, []);


  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this marker?')) {
      await deleteMarker(id);
      setMarkers(markers.filter((marker) => marker.id !== id));
    }
  };


  const handleEdit = (marker) => {
    setIsEditing(true);
    setEditMarkerData(marker);
  };


  const handleSaveEdit = async () => {
    await editMarker({
      id: editMarkerData.id,
      lat: parseFloat(editMarkerData.lat),
      lng: parseFloat(editMarkerData.lng),
      title: editMarkerData.title,
      curiosity: editMarkerData.curiosity,
    });
    setMarkers(markers.map((marker) => (marker.id === editMarkerData.id ? editMarkerData : marker)));
    setIsEditing(false);
    setEditMarkerData({ id: '', lat: '', lng: '', title: '', curiosity: '' });
  };

  return (
    <div className="container mx-auto p-6 space-y-8 lg:max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Panel</h1>

      {/* Add Marker Form */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Marker</h2>
        <AddMarkerForm />
      </div>


      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Existing Markers</h2>
        {markers.length > 0 ? (
          <ul className="space-y-4">
            {markers.map((marker) => (
              <li
                key={marker.id}
                className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">{marker.title}</h3>
                  <p className="text-gray-600">{marker.curiosity}</p>
                  <p className="text-sm text-gray-500">Lat: {marker.lat}, Lng: {marker.lng}</p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <button
                    onClick={() => handleEdit(marker)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(marker.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No markers available</p>
        )}
      </div>

      {isEditing && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit Marker</h2>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <input
              type="text"
              value={editMarkerData.lat}
              onChange={(e) => setEditMarkerData({ ...editMarkerData, lat: e.target.value })}
              placeholder="Latitude"
              required
              className="block w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
            <input
              type="text"
              value={editMarkerData.lng}
              onChange={(e) => setEditMarkerData({ ...editMarkerData, lng: e.target.value })}
              placeholder="Longitude"
              required
              className="block w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
            <input
              type="text"
              value={editMarkerData.title}
              onChange={(e) => setEditMarkerData({ ...editMarkerData, title: e.target.value })}
              placeholder="Title"
              required
              className="block w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
            <textarea
              value={editMarkerData.curiosity}
              onChange={(e) => setEditMarkerData({ ...editMarkerData, curiosity: e.target.value })}
              placeholder="Curiosity"
              required
              className="block w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Save
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Marker Locations</h2>
        <MapWithNoSSR />
      </div>
    </div>
  );
};

export default AdminPage;
