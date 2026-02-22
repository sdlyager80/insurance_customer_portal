import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Button, Typography, Chip } from '@mui/material';
import { VideoCall, Phone, Navigation as NavigationIcon } from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Provider, Location } from '../types/provider';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon for user location (red marker)
const userLocationIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#D02E2E"/>
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Custom icon for providers
const providerIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#37A526"/>
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

interface ProviderMapProps {
  providers: Provider[];
  userLocation?: Location;
  onBookProvider: (provider: Provider) => void;
}

// Component to handle map centering
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

const ProviderMap = ({ providers, userLocation, onBookProvider }: ProviderMapProps) => {
  // Calculate map center
  const getMapCenter = (): [number, number] => {
    if (userLocation) {
      return [userLocation.latitude, userLocation.longitude];
    }
    if (providers.length > 0) {
      return [providers[0].latitude, providers[0].longitude];
    }
    // Default to New York
    return [40.7589, -73.9851];
  };

  const center = getMapCenter();
  const zoom = userLocation ? 12 : 4;

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
          >
            <Popup>
              <Box sx={{ p: 1, minWidth: 220 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: '#D02E2E' }}>
                  📍 Your Location
                </Typography>
                {userLocation.address && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {userLocation.address}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Providers are shown relative to this location
                </Typography>
              </Box>
            </Popup>
          </Marker>
        )}

        {/* Provider Markers */}
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            position={[provider.latitude, provider.longitude]}
            icon={providerIcon}
          >
            <Popup minWidth={280} maxWidth={320}>
              <Box sx={{ p: 1 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {provider.name}
                </Typography>

                <Chip
                  label={provider.specialty}
                  size="small"
                  sx={{ mb: 1, bgcolor: '#1B75BB20', border: '1px solid #1B75BB4D', color: '#000000', fontWeight: 600 }}
                />

                {provider.telemedicine && (
                  <Chip
                    icon={<VideoCall fontSize="small" sx={{ color: '#000000 !important' }} />}
                    label="Telemedicine"
                    size="small"
                    sx={{ ml: 0.5, mb: 1, bgcolor: '#37A52620', border: '1px solid #37A5264D', color: '#000000', fontWeight: 600 }}
                  />
                )}

                <Box sx={{ my: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <NavigationIcon fontSize="small" />
                    {provider.address}, {provider.city}, {provider.state}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone fontSize="small" />
                    {provider.phone}
                  </Typography>
                  {provider.distance !== undefined && (
                    <Typography variant="body2" fontWeight={600} color="#000000" sx={{ mt: 0.5 }}>
                      {provider.distance.toFixed(1)} miles away
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  onClick={() => onBookProvider(provider)}
                  sx={{ mt: 1, minHeight: 44, bgcolor: '#1B75BB', '&:hover': { bgcolor: '#155f99' } }}
                >
                  Book Appointment
                </Button>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default ProviderMap;
