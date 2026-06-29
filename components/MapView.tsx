'use client';

import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import VenuePin from './VenuePin';
import Legend from './Legend';
import { USER_LAT, USER_LNG } from '@/lib/geo';
import type { VenueWithDistance } from '@/lib/data';

const LONDON_CENTER = { longitude: USER_LNG, latitude: USER_LAT };

interface Props {
  venues: VenueWithDistance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function MapView({ venues, selectedId, onSelect }: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div className="relative flex-1 overflow-hidden">
      <Map
        mapboxAccessToken={token}
        initialViewState={{ ...LONDON_CENTER, zoom: 13 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        {venues.map(venue => (
          <Marker
            key={venue.id}
            longitude={venue.lng}
            latitude={venue.lat}
            anchor="bottom"
          >
            <VenuePin
              venue={venue}
              selected={venue.id === selectedId}
              onClick={() => onSelect(venue.id)}
            />
          </Marker>
        ))}
      </Map>
      <Legend />
    </div>
  );
}
