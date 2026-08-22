import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase, getCurrentUser, getProfile, signOut, canAccessDashboard, getBlockReason } from './lib/supabase';

// Layout
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

// Public
import LandingPage from './components/Public/LandingPage';
import SignInPage from './components/Auth/SignInPage';
import SignUpPage from './components/Auth/SignUpPage';
import AdminLoginPage from './components/Auth/AdminLoginPage';

// Dashboard components
import DisasterMap from './components/Map/DisasterMap';
import StatsCards from './components/Dashboard/StatsCards';
import ResourceTable from './components/Dashboard/ResourceTable';
import ResourceCharts from './components/Dashboard/ResourceCharts';
import AlertBanner from './components/Dashboard/AlertBanner';
import ForgottenZones from './components/Dashboard/ForgottenZones';
import RecommendationList from './components/AI/RecommendationList';
import SimulationPanel from './components/Simulation/SimulationPanel';
import SituationReportForm from './components/CampRequest/SituationReportForm';
import AIAnalysisResult from './components/CampRequest/AIAnalysisResult';
import MoneyDonationForm from './components/Donor/MoneyDonationForm';
import ItemDonationForm from './components/Donor/ItemDonationForm';
import DonationTracker from './components/Donor/DonationTracker';
import CampManager from './components/Admin/CampManager';
import UserManagement from './components/Admin/UserManagement';
import AccountStatusScreen from './components/Auth/AccountStatusScreen';
import NGOApprovalPanel from './components/NGO/NGOApprovalPanel';

import { seedCamps, seedResources } from './lib/seedData';

// ─── Protected Layout ─────────────────────────────────────────────────────────
function DashboardLayout({ user, profile, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = profile?.role || 'donor';

  // Determine current page from path
  const path = location.pathname.split('/').pop() || 'dashboard';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
      <Header currentPage={path} userRole={role} onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar role={role} currentPage={path} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={(p) => {
          const base = role === 'admin' ? '/admin' : `/${role}`;
          navigate(`${base}/${p}`);
        }} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── Admin Dashboard Pages ────────────────────────────────────────────────────
function AdminDashboard({ user, profile }) {
  const [camps, setCamps] = useState([...seedCamps]);
  const [resources, setResources] = useState([...seedResources]);
  const [dbCamps, setDbCamps] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [reportData, setReportData] = useState(null);
  const location = useLocation();
  const page = location.pathname.split('/').pop() || 'dashboard';

  // Load data from Supabase
  const loadData = useCallback(async () => {
    try {
      const { data: campData } = await supabase.from('camps').select('*').order('created_at');
      if (campData?.length > 0) setDbCamps(campData);
      const { data: coordData } = await supabase.from('profiles').select('*').eq('role', 'coordinator');
      if (coordData) setCoordinators(coordData);
    } catch (e) { console.log('Using seed data'); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSimUpdate = useCallback((campId, values) => {
    if (values.population !== undefined) {
      setCamps(prev => prev.map(c => c.id === campId ? { ...c, current_population: values.population } : c));
    }
    setResources(prev => prev.map(r => {
      if (r.camp_id !== campId) return r;
      if (r.resource_type === 'food' && values.food !== undefined) return { ...r, quantity: values.food };
      if (r.resource_type === 'water' && values.water !== undefined) return { ...r, quantity: values.water };
      if (r.resource_type === 'medicine' && values.medicine !== undefined) return { ...r, quantity: values.medicine };
      if (r.resource_type === 'shelter' && values.shelter !== undefined) return { ...r, quantity: values.shelter };
      return r;
    }));
  }, []);

  const content = {
    dashboard: (
      <div className="space-y-6">
        <AlertBanner camps={camps} resources={resources} />
        <StatsCards camps={camps} resources={resources} />
        <ResourceCharts camps={camps} resources={resources} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2"><ResourceTable camps={camps} resources={resources} /></div>
          <div><ForgottenZones camps={camps} resources={resources} /></div>
        </div>
      </div>
    ),
    map: <div className="h-[calc(100vh-80px)]"><DisasterMap camps={camps} resources={resources} /></div>,
    recommendations: (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecommendationList camps={camps} resources={resources} />
        <ForgottenZones camps={camps} resources={resources} />
      </div>
    ),
    'camp-request': (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SituationReportForm camps={camps} onSubmit={setReportData} />
        <AIAnalysisResult formData={reportData} onSubmitAll={() => alert('✅ All requests submitted!')} />
      </div>
    ),
    camps: <CampManager camps={dbCamps} coordinators={coordinators} onRefresh={loadData} />,
    users: <UserManagement adminUser={user} />,
    donations: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <MoneyDonationForm camps={camps} />
          <ItemDonationForm />
        </div>
        <DonationTracker />
      </div>
    ),
    simulation: (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SimulationPanel camps={camps} resources={resources} onUpdate={handleSimUpdate} />
        <div className="space-y-6">
          <AlertBanner camps={camps} resources={resources} />
          <StatsCards camps={camps} resources={resources} />
          <RecommendationList camps={camps} resources={resources} />
        </div>
      </div>
    ),
  };

  return (
    <DashboardLayout user={user} profile={profile}>
      {content[page] || content.dashboard}
    </DashboardLayout>
  );
}

// ─── Coordinator Dashboard ────────────────────────────────────────────────────
function CoordinatorDashboard({ user, profile }) {
  const [reportData, setReportData] = useState(null);
  const location = useLocation();
  const page = location.pathname.split('/').pop() || 'camp-request';

  const content = {
    'camp-request': (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SituationReportForm onSubmit={setReportData} />
        <AIAnalysisResult formData={reportData} onSubmitAll={() => alert('✅ Requests submitted!')} />
      </div>
    ),
    map: <div className="h-[calc(100vh-80px)]"><DisasterMap /></div>,
    dashboard: (
      <div className="space-y-6">
        <StatsCards />
        <ResourceTable />
      </div>
    ),
  };

  return (
    <DashboardLayout user={user} profile={profile}>
      {content[page] || content['camp-request']}
    </DashboardLayout>
  );
}

// ─── Donor Dashboard ──────────────────────────────────────────────────────────
function DonorDashboard({ user, profile }) {
  const location = useLocation();
  const page = location.pathname.split('/').pop() || 'donations';

  const content = {
    donations: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <MoneyDonationForm />
          <ItemDonationForm />
        </div>
        <DonationTracker />
      </div>
    ),
    dashboard: <div className="space-y-6"><StatsCards /><ResourceTable /></div>,
    map: <div className="h-[calc(100vh-80px)]"><DisasterMap /></div>,
    public: <div className="space-y-6"><StatsCards /><ResourceTable /></div>,
  };

  return (
    <DashboardLayout user={user} profile={profile}>
      {content[page] || content.donations}
    </DashboardLayout>
  );
}

// ─── NGO Dashboard ────────────────────────────────────────────────────────────
function NGODashboard({ user, profile }) {
  const location = useLocation();
  const page = location.pathname.split('/').pop() || 'map';

  const content = {
    map: <div className="h-[calc(100vh-80px)]"><DisasterMap /></div>,
    dashboard: <div className="space-y-6"><AlertBanner /><StatsCards /><ResourceCharts /><ResourceTable /></div>,
    recommendations: <RecommendationList />,
    verify: <NGOApprovalPanel ngoUser={user} />,
  };

  return (
    <DashboardLayout user={user} profile={profile}>
      {content[page] || content.map}
    </DashboardLayout>
  );
}

// ─── Driver Dashboard ─────────────────────────────────────────────────────────
function DriverDashboard({ user, profile }) {
  const location = useLocation();
  const page = location.pathname.split('/').pop() || 'recommendations';

  const content = {
    recommendations: <RecommendationList />,
    map: <div className="h-[calc(100vh-80px)]"><DisasterMap /></div>,
  };

  return (
    <DashboardLayout user={user} profile={profile}>
      {content[page] || content.recommendations}
    </DashboardLayout>
  );
}

// ─── Auth Guard ───────────────────────────────────────────────────────────────
function ProtectedRoute({ user, profile, allowedRoles, children }) {
  if (!user) return <Navigate to="/signin" replace />;
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) return <Navigate to="/" replace />;

  // Dual approval gate: admin + NGO
  if (profile && !canAccessDashboard(profile)) {
    const reason = getBlockReason(profile);
    return <AccountStatusScreen status={reason} profile={profile} onLogout={() => { window.location.href = '/'; }} />;
  }

  return children;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function AppRoutes() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing session
    const init = async () => {
      try {
        const u = await getCurrentUser();
        if (u) {
          setUser(u);
          const p = await getProfile(u.id);
          setProfile(p);
        }
      } catch (e) {
        console.log('No session');
      }
      setLoading(false);
    };
    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const p = await getProfile(session.user.id);
        setProfile(p);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = (u, p) => { setUser(u); setProfile(p); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading ReliefChain...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage onAuth={handleAuth} />} />
      <Route path="/signup" element={<SignUpPage onAuth={handleAuth} />} />

      {/* Admin Routes — shows login page if not authenticated */}
      <Route path="/admin" element={
        user && profile?.role === 'admin'
          ? <AdminDashboard user={user} profile={profile} />
          : <AdminLoginPage onAuth={handleAuth} />
      } />
      <Route path="/admin/:page" element={
        user && profile?.role === 'admin'
          ? <AdminDashboard user={user} profile={profile} />
          : <AdminLoginPage onAuth={handleAuth} />
      } />

      {/* Coordinator Routes */}
      <Route path="/coordinator" element={
        <ProtectedRoute user={user} profile={profile} allowedRoles={['coordinator']}>
          <CoordinatorDashboard user={user} profile={profile} />
        </ProtectedRoute>
      } />
      <Route path="/coordinator/:page" element={
        <ProtectedRoute user={user} profile={profile} allowedRoles={['coordinator']}>
          <CoordinatorDashboard user={user} profile={profile} />
        </ProtectedRoute>
      } />

      {/* Donor Routes */}
      <Route path="/donor" element={
        <ProtectedRoute user={user} profile={profile}>
          <DonorDashboard user={user} profile={profile} />
        </ProtectedRoute>
      } />
      <Route path="/donor/:page" element={
        <ProtectedRoute user={user} profile={profile}>
          <DonorDashboard user={user} profile={profile} />
        </ProtectedRoute>
      } />

      {/* NGO Routes */}
      <Route path="/ngo" element={
        <ProtectedRoute user={user} profile={profile} allowedRoles={['ngo']}>
          <NGODashboard user={user} profile={profile} />
        </ProtectedRoute>
      } />
      <Route path="/ngo/:page" element={
        <ProtectedRoute user={user} profile={profile} allowedRoles={['ngo']}>
          <NGODashboard user={user} profile={profile} />
        </ProtectedRoute>
      } />

      {/* Driver Routes */}
      <Route path="/driver" element={
        <ProtectedRoute user={user} profile={profile} allowedRoles={['driver']}>
          <DriverDashboard user={user} profile={profile} />
        </ProtectedRoute>
      } />
      <Route path="/driver/:page" element={
        <ProtectedRoute user={user} profile={profile} allowedRoles={['driver']}>
          <DriverDashboard user={user} profile={profile} />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
