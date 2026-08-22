import { LayoutDashboard, Map, Bot, Heart, Zap, ClipboardList, Truck, Eye, MapPin, X } from 'lucide-react';

const navConfig = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'camps', label: 'Manage Camps', icon: MapPin },
    { id: 'map', label: 'Disaster Map', icon: Map },
    { id: 'recommendations', label: 'AI Engine', icon: Bot },
    { id: 'camp-request', label: 'Camp Report', icon: ClipboardList },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'simulation', label: 'Simulation', icon: Zap },
  ],
  coordinator: [
    { id: 'camp-request', label: 'Report', icon: ClipboardList },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  ],
  ngo: [
    { id: 'map', label: 'Needs Map', icon: Map },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recommendations', label: 'AI', icon: Bot },
  ],
  driver: [
    { id: 'recommendations', label: 'Deliveries', icon: Truck },
    { id: 'map', label: 'Map', icon: Map },
  ],
  donor: [
    { id: 'donations', label: 'Donate', icon: Heart },
    { id: 'dashboard', label: 'Impact', icon: LayoutDashboard },
    { id: 'map', label: 'Map', icon: Map },
  ],
};

export default function Sidebar({ role = 'admin', currentPage, onNavigate, isOpen, onClose }) {
  const items = navConfig[role] || navConfig.admin;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 lg:w-52 flex flex-col flex-shrink-0 overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>

        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/[0.04]">
          <span className="text-sm font-bold text-white">Menu</span>
          <button onClick={onClose} className="p-1 text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-3 flex-1">
          <div className="text-[9px] uppercase text-neutral-700 font-bold tracking-[0.2em] px-3 pt-3 pb-3">Navigation</div>
          <nav className="space-y-0.5">
            {items.map(item => {
              const active = currentPage === item.id;
              return (
                <button key={item.id} onClick={() => { onNavigate(item.id); onClose?.(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                    ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                    : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.03] border border-transparent'
                  }`}>
                  <item.icon className={`w-4 h-4 ${active ? 'text-red-400' : ''}`} />
                  <span className="truncate">{item.label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-white/[0.04]">
          <div className="text-[9px] text-neutral-700 uppercase tracking-wider">Role</div>
          <div className="text-xs font-medium text-neutral-400 capitalize mt-0.5">{role}</div>
        </div>
      </aside>
    </>
  );
}
