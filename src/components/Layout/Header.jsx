import { ShieldAlert, Bell, LogOut, Menu } from 'lucide-react';

export default function Header({ currentPage, userRole, onLogout, onToggleSidebar }) {
  const badges = {
    admin: { label: 'Admin', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    coordinator: { label: 'Coordinator', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    ngo: { label: 'NGO', cls: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
    driver: { label: 'Driver', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    donor: { label: 'Donor', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  };
  const b = badges[userRole] || badges.donor;

  return (
    <header className="glass-nav sticky top-0 z-50 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="lg:hidden p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/15">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-white leading-none">ReliefChain</h1>
              <p className="text-[9px] text-neutral-600 leading-none mt-0.5">Coordination Intelligence</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`badge border ${b.cls}`}>{b.label}</span>
          <button className="relative p-2 text-neutral-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors" aria-label="Notifications">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <button onClick={onLogout} className="p-2 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors" aria-label="Logout">
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
