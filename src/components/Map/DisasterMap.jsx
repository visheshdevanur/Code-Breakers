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
    <div className="relative h-full w-full rounded-16 overflow-hidden border border-white/[0.04]">
      <MapContainer center={[10.1, 76.38]} zoom={10} className="h-full w-full" style={{ minHeight: '500px', background: 'var(--bg-base)' }}>
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
              <Popup className="custom-popup">
                <div className="text-sm min-w-[220px] p-1">
                  <div className="font-bold text-base mb-1" style={{ color: st.color }}>{camp.name}</div>
                  <div className="text-neutral-400 mb-3 text-xs">{camp.village} • Pop: {camp.current_population}</div>
                  <div className="space-y-1.5 text-sm text-neutral-200">
                    <div className="flex justify-between"><span>🍚 Food</span> <strong>{food ? getDaysRemaining(food) : '?'} days</strong></div>
                    <div className="flex justify-between"><span>💧 Water</span> <strong>{water ? getDaysRemaining(water) : '?'} days</strong></div>
                    <div className="flex justify-between"><span>💊 Medicine</span> <strong>{med ? getDaysRemaining(med) : '?'} days</strong></div>
                    <div className="flex justify-between"><span>🏠 Shelter</span> <strong>{camp.current_population}/{camp.total_capacity}</strong></div>
                  </div>
                  <div className="mt-3 px-3 py-2 rounded-12 text-xs font-bold text-center border" style={{ background: st.color + '15', color: st.color, borderColor: st.color + '30' }}>
                    Score: {score} — {st.label}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      {/* Legend */}
      <div className="dark-card absolute bottom-6 right-6 z-[1000] p-4 shadow-xl">
        <div className="text-xs font-bold text-white mb-3 tracking-wide uppercase">Status Legend</div>
        <div className="space-y-2">
          {[['🔴 Critical', '#dc2626'], ['🟠 Warning', '#f59e0b'], ['🟡 Watch', '#eab308'], ['🟢 Stable', '#16a34a']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-3 text-sm text-neutral-400">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: color, boxShadow: `0 0 8px ${color}80` }} />
              {label.split(' ')[1]}
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .leaflet-popup-content-wrapper {
          background: var(--bg-card) !important;
          color: var(--text) !important;
          border: 1px solid var(--border) !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-tip {
          background: var(--bg-card) !important;
          border-top: 1px solid var(--border) !important;
          border-left: 1px solid var(--border) !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: var(--text-muted) !important;
          padding: 8px 8px 0 0 !important;
        }
      `}</style>
    </div>
  );
}
