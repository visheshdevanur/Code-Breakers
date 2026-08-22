import { ShieldAlert, Bell, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const roleBadges = {
  admin: { label: 'Admin', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  coordinator: { label: 'Coordinator', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  ngo: { label: 'NGO', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  driver: { label: 'Driver', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  donor: { label: 'Donor', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
};

export default function Header({ currentPage, userRole, onLogout, onToggleSidebar }) {
  const badge = roleBadges[userRole] || roleBadges.donor;

  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-800/50 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button onClick={onToggleSidebar} className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800" aria-label="Toggle menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-white leading-tight">ReliefChain</h1>
              <p className="text-[10px] text-slate-500 leading-tight -mt-0.5">Coordination Intelligence</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`${badge.bg} ${badge.text} ${badge.border} border px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold`}>
            {badge.label}
          </span>
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800" aria-label="Notifications">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800" title="Logout" aria-label="Logout">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
