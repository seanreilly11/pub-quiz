'use client';

import { useState, useCallback } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getVenues } from '@/lib/data';
import { midpoint, haversineKm, kmToMiles, USER_LAT, USER_LNG } from '@/lib/geo';

const COLORS = ['bg-brass text-ink', 'bg-[#7c6af7] text-white', 'bg-[#e06d9a] text-white', 'bg-[#4ac0c0] text-ink'];
const BRISTOL_CENTER = { longitude: USER_LNG, latitude: USER_LAT };

interface Friend { lat: number; lng: number }

export default function MeetMode() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const handleMapClick = useCallback((e: { lngLat: { lat: number; lng: number } }) => {
    if (friends.length >= 4) return;
    setFriends(prev => [...prev, { lat: e.lngLat.lat, lng: e.lngLat.lng }]);
  }, [friends.length]);

  const mid = friends.length >= 2 ? midpoint(friends) : null;
  const allVenues = getVenues();

  const ranked = mid
    ? [...allVenues]
        .map(v => ({ ...v, _midDist: kmToMiles(haversineKm(mid.lat, mid.lng, v.lat, v.lng)) }))
        .sort((a, b) => a._midDist - b._midDist)
        .slice(0, 5)
    : [];

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      <div className="flex-1 relative">
        <Map
          mapboxAccessToken={token}
          initialViewState={{ ...BRISTOL_CENTER, zoom: 12 }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          onClick={handleMapClick}
          cursor={friends.length < 4 ? 'crosshair' : 'default'}
        >
          {friends.map((f, i) => (
            <Marker key={i} longitude={f.lng} latitude={f.lat} anchor="center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm shadow-lg ${COLORS[i]}`}>
                {i === 0 ? 'Y' : String.fromCharCode(65 + i)}
              </div>
            </Marker>
          ))}

          {mid && (
            <Marker longitude={mid.lng} latitude={mid.lat} anchor="center">
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-brass/20 border-2 border-brass shadow-[0_0_12px_rgba(216,163,59,0.4)]" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-display uppercase tracking-wider bg-brass text-ink px-1.5 py-0.5 rounded whitespace-nowrap">
                  Midpoint
                </span>
              </div>
            </Marker>
          )}

          {ranked.slice(0, 3).map(v => (
            <Marker key={v.id} longitude={v.lng} latitude={v.lat} anchor="center">
              <div className="w-2.5 h-2.5 rounded-full bg-confirmed shadow-[0_0_6px_rgba(111,190,142,0.6)]" />
            </Marker>
          ))}
        </Map>

        {friends.length === 0 && (
          <div className="absolute inset-0 flex items-end justify-center pb-24 pointer-events-none">
            <p className="bg-bottle/90 border border-line rounded-xl px-4 py-3 text-sm text-chalk-dim text-center max-w-xs">
              Tap the map to drop a pin for each person (up to 4)
            </p>
          </div>
        )}

        {friends.length > 0 && friends.length < 4 && (
          <button
            onClick={() => setFriends([])}
            className="absolute top-3 right-3 text-[11px] text-chalk-dim border border-line rounded-lg px-3 py-1.5 bg-bottle/90 hover:border-brass hover:text-brass transition-colors"
          >
            Start over
          </button>
        )}

        {ranked.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-bottle border-t border-line rounded-t-2xl p-4 md:hidden">
            <div className="w-8 h-1 bg-line rounded-full mx-auto mb-3" />
            <RankedList ranked={ranked} />
          </div>
        )}
      </div>

      {ranked.length > 0 && (
        <div className="hidden md:flex flex-col w-[260px] bg-bottle border-l border-line overflow-hidden">
          <div className="px-4 py-3 border-b border-line font-display text-[11px] tracking-[1px] uppercase text-chalk-dim">
            Fairest for everyone
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <RankedList ranked={ranked} />
          </div>
        </div>
      )}
    </div>
  );
}

function RankedList({ ranked }: { ranked: Array<{ id: string; name: string; _midDist: number }> }) {
  return (
    <div className="flex flex-col gap-2">
      {ranked.map((v, i) => (
        <div
          key={v.id}
          className={[
            'flex items-center gap-3 bg-ink border rounded-xl p-3',
            i === 0 ? 'border-confirmed bg-confirmed/5' : 'border-line',
          ].join(' ')}
        >
          <span className={`font-display text-lg font-bold w-5 text-center ${i === 0 ? 'text-confirmed' : 'text-line'}`}>
            {i + 1}
          </span>
          <div>
            <p className="text-[12px] font-semibold text-chalk">{v.name}</p>
            <p className="text-[10px] text-chalk-dim">{v._midDist.toFixed(1)} mi from midpoint</p>
            {i === 0 && (
              <span className="inline-block mt-1 text-[9px] font-semibold bg-confirmed/15 border border-confirmed/30 text-confirmed rounded-full px-2 py-0.5">
                Fairest for everyone
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
