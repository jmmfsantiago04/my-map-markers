
import { getMarkers } from '../actions/markers';
import Map from '../../components/Map';
import MarkerList from '../../components/MarkerList';

type MarkerData = {
  id: number;
  lat: number;
  lng: number;
  title: string;
  curiosity: string;
};


export default async function MapWithListPage() {

  const markers: MarkerData[] = await getMarkers();

  return (
    <div className="container mx-auto p-6 space-y-8 lg:max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Map with Marker List</h1>

      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">

        <MarkerList markers={markers} />

        <div className="lg:w-2/3">
          <Map markers={markers} />
        </div>
      </div>
    </div>
  );
}
