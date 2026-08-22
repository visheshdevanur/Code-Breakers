import { useState } from 'react';
import { ArrowRight, Check, X, Truck, Clock, Apple, Droplets, Pill, Home } from 'lucide-react';
import { getStatus } from '../../lib/aiEngine';
import { seedVehicles } from '../../lib/seedData';

export default function RecommendationCard({ recommendation, onAccept, onReject }) {
  const [status, setStatus] = useState(recommendation.status || 'pending');
  const [assignedVehicle, setAssignedVehicle] = useState(null);
  const st = getStatus(recommendation.priority_score);
  
  const resIcons = { 
    food: <Apple className="w-4 h-4" />, 
    water: <Droplets className="w-4 h-4" />, 
    medicine: <Pill className="w-4 h-4" />, 
    shelter: <Home className="w-4 h-4" /> 
  };

  const handleAccept = () => {
    setStatus('accepted');
    const vehicle = seedVehicles.find(v => v.availability === 'available');
    setAssignedVehicle(vehicle);
    onAccept?.(recommendation, vehicle);
  };

  return (
    <div className={`dark-card p-4 anim-slide border-l-4 ${st.border}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`badge ${st.bg} ${st.text}`}>{st.label}</span>
        <span className="text-xs text-neutral-500 font-medium">Score: {recommendation.priority_score}</span>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white/[0.04] px-4 py-2 rounded-12 text-center flex-1 border border-white/[0.02]">
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">From</div>
          <div className="font-bold text-neutral-200 text-sm truncate">{recommendation.source_camp}</div>
        </div>
        <div className="icon-box w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.04]">
          <ArrowRight className="w-4 h-4 text-neutral-500" />
        </div>
        <div className="bg-red-500/10 px-4 py-2 rounded-12 text-center flex-1 border border-red-500/20">
          <div className="text-[10px] uppercase tracking-wider text-red-400 mb-1">To</div>
          <div className="font-bold text-red-100 text-sm truncate">{recommendation.target_camp}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-neutral-300 mb-3 bg-white/[0.02] p-3 rounded-12 border border-white/[0.02]">
        <span className="flex items-center gap-2 font-medium">
          <span className="text-neutral-400">{resIcons[recommendation.resource_type]}</span>
          {recommendation.quantity} <span className="capitalize">{recommendation.resource_type}</span>
        </span>
        <span className="w-px h-4 bg-white/[0.1]"></span>
        <span className="flex items-center gap-1.5 text-neutral-400">
          <Clock className="w-4 h-4" /> 
          <span>ETA {recommendation.estimated_delivery_hours}h</span>
        </span>
      </div>
      
      <p className="text-sm text-neutral-400 mb-4 leading-relaxed">{recommendation.reason}</p>
      
      {status === 'pending' ? (
        <div className="flex gap-3">
          <button onClick={handleAccept} className="btn-red flex-1 flex items-center justify-center gap-2 text-sm py-2.5">
            <Check className="w-4 h-4" /> Accept
          </button>
          <button onClick={() => { setStatus('rejected'); onReject?.(recommendation); }} className="btn-dark flex-1 flex items-center justify-center gap-2 text-sm py-2.5">
            <X className="w-4 h-4" /> Reject
          </button>
        </div>
      ) : status === 'accepted' ? (
        <div className="bg-green-500/10 rounded-12 p-3 border border-green-500/20">
          <div className="text-green-400 font-medium text-sm flex items-center gap-2 mb-1.5">
            <Check className="w-4 h-4" /> Accepted
          </div>
          {assignedVehicle && (
            <div className="text-xs text-green-200/70 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> 
              {assignedVehicle.driver_name} • {assignedVehicle.vehicle_type} {assignedVehicle.vehicle_number}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/[0.04] rounded-12 p-3 text-neutral-400 font-medium text-sm border border-white/[0.04] flex items-center gap-2">
          <X className="w-4 h-4" /> Rejected
        </div>
      )}
    </div>
  );
}
