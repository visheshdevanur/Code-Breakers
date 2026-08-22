import { useState } from 'react';
import { ArrowRight, Check, X, Truck, Clock } from 'lucide-react';
import { getStatus } from '../../lib/aiEngine';
import { seedVehicles } from '../../lib/seedData';

export default function RecommendationCard({ recommendation, onAccept, onReject }) {
  const [status, setStatus] = useState(recommendation.status || 'pending');
  const [assignedVehicle, setAssignedVehicle] = useState(null);
  const st = getStatus(recommendation.priority_score);
  const resIcons = { food: '🍚', water: '💧', medicine: '💊', shelter: '🏠' };

  const handleAccept = () => {
    setStatus('accepted');
    const vehicle = seedVehicles.find(v => v.availability === 'available');
    setAssignedVehicle(vehicle);
    onAccept?.(recommendation, vehicle);
  };

  return (
    <div className={`bg-slate-800 rounded-xl border-l-4 ${st.border} border border-slate-700 p-4 animate-slide-in`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${st.bg} ${st.text}`}>{st.label}</span>
        <span className="text-xs text-slate-500">Score: {recommendation.priority_score}</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-green-500/10 px-3 py-2 rounded-lg text-center">
          <div className="text-xs text-green-400">FROM</div>
          <div className="font-bold text-green-300 text-sm">{recommendation.source_camp}</div>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
        <div className="bg-red-500/10 px-3 py-2 rounded-lg text-center">
          <div className="text-xs text-red-400">TO</div>
          <div className="font-bold text-red-300 text-sm">{recommendation.target_camp}</div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-300 mb-3">
        <span>{resIcons[recommendation.resource_type]} {recommendation.quantity} {recommendation.resource_type}</span>
        <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3 h-3" /> ETA: {recommendation.estimated_delivery_hours}h</span>
      </div>
      <p className="text-xs text-slate-400 mb-3">{recommendation.reason}</p>
      {status === 'pending' ? (
        <div className="flex gap-2">
          <button onClick={handleAccept} className="flex-1 flex items-center justify-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold py-2 rounded-lg transition-colors text-sm">
            <Check className="w-4 h-4" /> Accept
          </button>
          <button onClick={() => { setStatus('rejected'); onReject?.(recommendation); }} className="flex-1 flex items-center justify-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-2 rounded-lg transition-colors text-sm">
            <X className="w-4 h-4" /> Reject
          </button>
        </div>
      ) : status === 'accepted' ? (
        <div className="bg-green-500/10 rounded-lg p-3">
          <div className="text-green-400 font-bold text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Accepted</div>
          {assignedVehicle && (
            <div className="text-xs text-green-300 mt-1 flex items-center gap-1">
              <Truck className="w-3 h-3" /> Assigned: {assignedVehicle.driver_name} • {assignedVehicle.vehicle_type} {assignedVehicle.vehicle_number}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-red-500/10 rounded-lg p-3 text-red-400 font-bold text-sm">✕ Rejected</div>
      )}
    </div>
  );
}
