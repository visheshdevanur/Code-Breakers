import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { calculatePriorityScore, getStatus } from '../../lib/aiEngine';

const statusColors = { critical: '#dc2626', warning: '#f59e0b', watch: '#eab308', stable: '#16a34a' };

export default function DisasterMap({ camps = seedCamps, resources = seedResources, onCampClick }) {
  const getCampData = (camp) => {
    const res = resources.filter(r => r.camp_id === camp.id);
    const score = calculatePriorityScore(camp, resources);
    const st = getStatus(score);
    return { res, score, st };
  };

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden border border-slate-700">
      <MapContainer center={[10.1, 76.38]} zoom={10} className="h-full w-full" style={{ minHeight: '500px', background: '#0f172a' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {camps.map(camp => {
          const { res, score, st } = getCampData(camp);
          const food = res.find(r => r.resource_type === 'food');
          const water = res.find(r => r.resource_type === 'water');
          const med = res.find(r => r.resource_type === 'medicine');
          return (
            <CircleMarker
              key={camp.id}
              center={[camp.latitude, camp.longitude]}
              radius={Math.max(12, camp.current_population / 40)}
              fillColor={st.color}
              color="white"
              weight={2}
              fillOpacity={0.85}
              eventHandlers={{ click: () => onCampClick?.(camp) }}
            >
              <Popup>
                <div className="text-sm min-w-[220px]">
                  <div className="font-bold text-base mb-1" style={{ color: st.color }}>{camp.name}</div>
                  <div className="text-slate-300 mb-2">{camp.village} • Pop: {camp.current_population}</div>
                  <div className="space-y-1 text-xs">
                    <div>🍚 Food: <strong>{food ? getDaysRemaining(food) : '?'} days</strong></div>
                    <div>💧 Water: <strong>{water ? getDaysRemaining(water) : '?'} days</strong></div>
                    <div>💊 Medicine: <strong>{med ? getDaysRemaining(med) : '?'} days</strong></div>
                    <div>🏠 Shelter: <strong>{camp.current_population}/{camp.total_capacity}</strong></div>
                  </div>
                  <div className="mt-2 px-2 py-1 rounded text-xs font-bold text-center" style={{ background: st.color + '33', color: st.color }}>
                    Score: {score} — {st.label}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur rounded-lg p-3 border border-slate-700 z-[1000]">
        <div className="text-xs font-bold text-slate-300 mb-2">Status Legend</div>
        {[['🔴 Critical', '#dc2626'], ['🟠 Warning', '#f59e0b'], ['🟡 Watch', '#eab308'], ['🟢 Stable', '#16a34a']].map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 text-xs text-slate-400 py-0.5">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
