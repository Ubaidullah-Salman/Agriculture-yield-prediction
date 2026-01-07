import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../contexts/ThemeContext';

// Fix for default marker icon in React Leaflet
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Coordinate mapping for Pakistan Cities/Provinces
const LOCATION_COORDINATES: Record<string, [number, number]> = {
    'punjab': [31.1704, 72.7097],
    'sindh': [25.8943, 68.5247],
    'kpk': [34.9526, 72.3311],
    'khyber pakhtunkhwa': [34.9526, 72.3311],
    'balochistan': [28.4907, 65.0958],
    'islamabad': [33.6844, 73.0479],
    'lahore': [31.5204, 74.3587],
    'karachi': [24.8607, 67.0011],
    'peshawar': [34.0151, 71.5249],
    'quetta': [30.1798, 66.9750],
    'multan': [30.1575, 71.5249],
    'faisalabad': [31.4504, 73.1350],
    'rawalpindi': [33.5651, 73.0169],
    'unknown': [30.3753, 69.3451] // Center of Pakistan fallback
};

interface UserData {
    id: string;
    name: string;
    location: string;
    [key: string]: any;
}

interface UserMapProps {
    users: UserData[];
    height?: string;
}

export function UserMap({ users, height = '600px' }: UserMapProps) {
    const { theme } = useTheme();

    // Helper to get coordinates with some random jitter to prevent overlap
    const getCoordinates = (location: string): [number, number] => {
        const normalizedLoc = location?.toLowerCase().trim() || 'unknown';
        const baseCoords = LOCATION_COORDINATES[normalizedLoc] || LOCATION_COORDINATES['unknown'];

        // Add varying jitter based on location specificity
        // Province-level locations need more jitter, specific cities need less
        const isProvince = ['punjab', 'sindh', 'kpk', 'balochistan'].includes(normalizedLoc);
        const jitter = isProvince ? 2.0 : 0.05; // 2 degrees spread for province, 0.05 for city

        return [
            baseCoords[0] + (Math.random() - 0.5) * jitter,
            baseCoords[1] + (Math.random() - 0.5) * jitter
        ];
    };

    return (
        <div className="w-full rounded-lg overflow-hidden bg-background" style={{ height }}>
            <MapContainer
                center={[30.3753, 69.3451]} // Center of Pakistan
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={theme === 'dark'
                        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                />
                {users.map((user) => {
                    const position = getCoordinates(user.location);
                    return (
                        <Marker
                            key={user.id}
                            position={position}
                            icon={redIcon}
                        >
                            <Popup>
                                <div className="text-sm font-medium">
                                    <p className="font-bold">{user.location || 'Unknown Location'}</p>
                                    <p className="text-secondary-foreground">{user.name}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
