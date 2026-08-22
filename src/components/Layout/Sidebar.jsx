import { LayoutDashboard, Map, Bot, Heart, Zap, ClipboardList, Truck, Eye, MapPin, X } from 'lucide-react';

const navConfig = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'camps', label: 'Manage Camps', icon: MapPin },
    { id: 'map', label: 'Disaster Map', icon: Map },
    { id: 'recommendations', label: 'AI Recommendations', icon: Bot },
    { id: 'camp-request', label: 'Camp Request', icon: ClipboardList },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'simulation', label: 'Simulation', icon: Zap },
    { id: 'public', label: 'Public View', icon: Eye },
  ],
  coordinator: [
    { id: 'camp-request', label: 'Situation Report', icon: ClipboardList },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  ],
  ngo: [
    { id: 'map', label: 'Needs Map', icon: Map },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recommendations', label: 'Recommendations', icon: Bot },
  ],
  driver: [
    { id: 'recommendations', label: 'My Deliveries', icon: Truck },
    { id: 'map', label: 'Route Map', icon: Map },
  ],
  donor: [
    { id: 'donations', label: 'Donate', icon: Heart },
    { id: 'dashboard', label: 'Impact', icon: LayoutDashboard },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'public', label: 'Transparency', icon: Eye },
  ],
};

export default function Sidebar({ role = 'admin', currentPage, onNavigate, isOpen, onClose }) {
  const items = navConfig[role] || navConfig.admin;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-60 lg:w-56 bg-[var(--surface-1)] border-r border-slate-800/50
        flex flex-col flex-shrink-0 overflow-y-auto
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800/50">
          <span className="text-sm font-bold text-white">Menu</span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 flex-1">
          <div className="text-[10px] uppercase text-slate-600 font-bold tracking-widest px-3 pt-2 pb-3">
            Navigation
          </div>
          <nav className="space-y-1" role="navigation">
            {items.map(item => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); onClose?.(); }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 focus-ring
                    ${isActive
                      ? 'bg-blue-500/10 text-blue-400 shadow-sm shadow-blue-500/5 border border-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border border-transparent'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                  <span className="truncate">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Role info at bottom */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="text-[10px] text-slate-600 uppercase tracking-wider">Logged in as</div>
          <div className="text-sm font-medium text-slate-300 capitalize mt-0.5">{role}</div>
        </div>
      </aside>
    </>
  );
}
