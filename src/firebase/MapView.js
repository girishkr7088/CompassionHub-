import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ camps, onCampSelect }) => {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden mb-8 border-2 border-gray-200">
      <MapContainer
        center={[20.5937, 78.9629]} // Default to India coordinates
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {camps.map((camp) => (
          camp.geoLocation && (
            <Marker
              key={camp.id}
              position={[camp.geoLocation.latitude, camp.geoLocation.longitude]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{camp.campName}</h3>
                  <p className="text-gray-600">{camp.location}</p>
                  <button 
                    onClick={() => onCampSelect(camp.id)}
                    className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
