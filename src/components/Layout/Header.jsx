import { ShieldAlert, Bell, LogOut, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';

export default function Header({ currentPage, userRole, onLogout, onToggleSidebar }) {
  const { isDark, toggle } = useTheme();

  const badges = {
    admin: { label: 'Admin', cls: 'bg-red-500/10 border-red-500/20' },
    coordinator: { label: 'Coordinator', cls: 'bg-blue-500/10 border-blue-500/20' },
    ngo: { label: 'NGO', cls: 'bg-violet-500/10 border-violet-500/20' },
    driver: { label: 'Driver', cls: 'bg-amber-500/10 border-amber-500/20' },
    donor: { label: 'Donor', cls: 'bg-emerald-500/10 border-emerald-500/20' },
  };
  const b = badges[userRole] || badges.donor;

  return (
    <header className="glass-nav sticky top-0 z-50 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors" style={{ color: 'var(--text-3)' }} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/15">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold leading-none" style={{ color: 'var(--text-1)' }}>ReliefChain</h1>
              <p className="text-[9px] leading-none mt-0.5" style={{ color: 'var(--text-4)' }}>Coordination Intelligence</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`badge border ${b.cls}`} style={{ color: 'var(--accent)' }}>{b.label}</span>
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors" style={{ color: 'var(--text-3)' }} aria-label="Toggle theme">
            {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>
          <button className="relative p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors" style={{ color: 'var(--text-3)' }} aria-label="Notifications">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <button onClick={onLogout} className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors" style={{ color: 'var(--text-3)' }} aria-label="Logout">
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
