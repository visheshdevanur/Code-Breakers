import { LayoutDashboard, Map, Bot, Heart, Zap, ClipboardList, Truck, Eye, MapPin, X, Users } from 'lucide-react';

const navConfig = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'camps', label: 'Manage Camps', icon: MapPin },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'map', label: 'Disaster Map', icon: Map },
    { id: 'recommendations', label: 'AI Engine', icon: Bot },
    { id: 'camp-request', label: 'Camp Report', icon: ClipboardList },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'simulation', label: 'Simulation', icon: Zap },
  ],
  ngo: [
    { id: 'map', label: 'Needs Map', icon: Map },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recommendations', label: 'AI', icon: Bot },
    { id: 'verify', label: 'Verify Workers', icon: Users },
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
  coordinator: [
    { id: 'camp-request', label: 'Submit Report', icon: ClipboardList },
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'recommendations', label: 'AI', icon: Bot },
  ],
};

export default function Sidebar({ role = 'admin', currentPage, onNavigate, isOpen, onClose }) {
  const items = navConfig[role] || navConfig.admin;
  const basePath = role === 'admin' ? '/admin' : role === 'coordinator' ? '/coordinator' : role === 'ngo' ? '/ngo' : role === 'driver' ? '/driver' : '/donor';

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 z-50 flex flex-col border-r transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between p-4 lg:hidden border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>Navigation</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-3)' }}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button key={item.id}
                onClick={() => { onNavigate(`${basePath}/${item.id}`); onClose?.(); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${isActive ? 'text-white' : ''}`}
                style={isActive ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 2px 8px rgba(220,38,38,0.2)' } : { color: 'var(--text-3)' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
