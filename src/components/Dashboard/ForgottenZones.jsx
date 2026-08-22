import { AlertTriangle, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { detectForgottenZones } from '../../lib/aiEngine';

export default function ForgottenZones({ camps = seedCamps, resources = seedResources }) {
  const forgotten = detectForgottenZones(camps, resources);

  return (
    <div className="dark-card overflow-hidden">
      <div className="flex items-center justify-between" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <h3 className="text-[15px] font-bold flex items-center gap-2" style={{ color: 'var(--text-1)' }}>
          <AlertTriangle className="w-4 h-4" style={{ color: 'var(--danger)' }} />
          Forgotten Zones
        </h3>
        {forgotten.length > 0 && <span className="badge" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>{forgotten.length}</span>}
      </div>
      
      {forgotten.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3" style={{ padding: '40px 24px', color: 'var(--text-4)' }}>
          <CheckCircle2 className="w-8 h-8" />
          <span className="text-[13px]">No forgotten zones. All camps have supplies.</span>
        </div>
      ) : (
        <div>
          {forgotten.map((camp, i) => (
            <div key={camp.id} className="anim-up" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', animationDelay: `${i * 60}ms` }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div className="flex items-start gap-4">
                <div className="icon-box !w-10 !h-10 !rounded-lg flex-shrink-0" style={{ background: 'var(--danger-soft)' }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: 'var(--danger)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold" style={{ color: 'var(--text-1)' }}>{camp.name}</div>
                  <div className="text-[11px] flex items-center gap-1.5 mt-1" style={{ color: 'var(--text-4)' }}>
                    <MapPin className="w-3 h-3" /> {camp.village} · Pop: {camp.current_population}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {camp.reasons.map((r, idx) => (
                      <div key={idx} className="text-[12px] flex items-center gap-2" style={{ color: 'var(--danger)' }}>
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--danger)' }} /> {r}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap mt-4">
                    {camp.resources.map(r => {
                      const days = getDaysRemaining(r);
                      const isZero = r.quantity <= 0;
                      const isLow = days < 1;
                      return (
                        <span key={r.resource_type} className="badge" style={{
                          background: isZero ? 'var(--danger-soft)' : isLow ? 'var(--amber-soft)' : 'var(--bg-2)',
                          color: isZero ? 'var(--danger)' : isLow ? 'var(--amber)' : 'var(--text-3)',
                          border: `1px solid ${isZero ? 'rgba(244,63,94,0.15)' : isLow ? 'rgba(251,191,36,0.15)' : 'var(--border)'}`,
                        }}>
                          {r.resource_type}: {days}d
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ padding: '16px 24px' }}>
            <button className="btn-red w-full flex items-center justify-center gap-2 !text-[13px]">
              <FileText className="w-4 h-4" /> Generate Emergency Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
