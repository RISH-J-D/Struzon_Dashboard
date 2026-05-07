import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { Login } from './components/Login';
import { VacanciesManager } from './components/VacanciesManager';
import { ContentManager } from './components/ContentManager';
import { UserManager } from './components/UserManager';
import { MediaManager } from './components/MediaManager';
import { ProjectManager } from './components/ProjectManager';
import { TeamManager } from './components/TeamManager';
import { LayoutDashboard, Users, FileText, Briefcase, LogOut, ImageIcon, FolderKanban, Shield, Rocket, Menu, X } from 'lucide-react';
import { ImageAutoSlider } from './components/ImageAutoSlider';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-navy text-white p-4 shadow-md z-40">
        <div className="flex items-center gap-3">
           <img src="/struzon-logo.png" alt="Struzon" className="h-6 w-auto filter brightness-0 invert" />
           <span className="font-bold uppercase tracking-widest text-xs">Admin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-navy text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-white/5">
          <img src="/struzon-logo.png" alt="Struzon" className="h-8 w-auto filter brightness-0 invert" />
          <h1 className="text-lg font-bold uppercase tracking-widest">Admin</h1>
        </div>
        
        <div className="p-6 md:hidden flex items-center justify-between border-b border-white/5">
          <h1 className="text-lg font-bold uppercase tracking-widest text-brand-red">Menu</h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {[
            { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
            { to: "/content", icon: <FileText size={18} />, label: "Content" },
            { to: "/projects", icon: <FolderKanban size={18} />, label: "Projects" },
            { to: "/media", icon: <ImageIcon size={18} />, label: "Media" },
            { to: "/team", icon: <Users size={18} />, label: "Team" },
            { to: "/vacancies", icon: <Briefcase size={18} />, label: "Vacancies" },
            { to: "/users", icon: <Shield size={18} />, label: "Access Control" }
          ].map((item) => (
             <Link 
               key={item.to} 
               to={item.to} 
               onClick={() => setIsMobileMenuOpen(false)}
               className="flex items-center gap-3 px-3 py-3 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-brand-red rounded-sm transition-all"
             >
               {item.icon} {item.label}
             </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 bg-navy-dark">
          <div className="mb-4 px-2 text-[10px] uppercase tracking-wider text-white/40 truncate">{user?.email}</div>
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-3 py-3 text-xs font-bold uppercase tracking-widest text-brand-red hover:text-white hover:bg-brand-red rounded-sm transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 dark:bg-gray-900 relative">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

const Dashboard = () => {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [contentItems, setContentItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: vData } = await supabase.from('vacancies').select('*').order('created_at', { ascending: false });
      if (vData) setVacancies(vData);
      const { count } = await supabase.from('site_content').select('*', { count: 'exact', head: true });
      if (count !== null) setContentItems(count);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-display font-black text-navy dark:text-white uppercase tracking-tight">Admin Dashboard</h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">Welcome back. Here is an overview of the current website data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-red"></div>
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="text-brand-red" size={20} />
            <h3 className="text-xs md:text-sm font-black text-navy dark:text-white uppercase tracking-widest">Active Vacancies</h3>
          </div>
          <div className="space-y-3">
            {vacancies.length === 0 ? (
              <p className="text-sm text-gray-500">No vacancies found.</p>
            ) : (
              vacancies.map(v => (
                <div key={v.id} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{v.title}</span>
                  <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm ${v.status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {v.status === 'Open' ? `Vacancy-${v.spots}` : 'Closed'}
                  </span>
                </div>
              ))
            )}
          </div>
          <Link to="/vacancies" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red hover:text-navy dark:hover:text-white transition-colors">Manage Vacancies &rarr;</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-red"></div>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-brand-red" size={20} />
            <h3 className="text-xs md:text-sm font-black text-navy dark:text-white uppercase tracking-widest">Site Content</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">You are managing <span className="font-bold text-navy dark:text-white">{contentItems}</span> dynamic text elements on the website.</p>
          <Link to="/content" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red hover:text-navy dark:hover:text-white transition-colors">Edit Content &rarr;</Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-red"></div>
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Rocket className="text-brand-red" size={20} />
          <h3 className="text-xs md:text-sm font-black text-navy dark:text-white uppercase tracking-widest">Upcoming Pipeline Assets</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 p-2 md:p-4 rounded-sm border border-gray-100 dark:border-gray-800">
          <ImageAutoSlider />
        </div>
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          These assets are pulled automatically from <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-brand-red font-mono">src/assets/upcoming</code>.
          To update these, add or remove images from that folder in the main project.
        </p>
      </div>
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/content" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ContentManager />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectManager />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/media" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MediaManager />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/vacancies" element={
            <ProtectedRoute>
              <DashboardLayout>
                <VacanciesManager />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/team" element={
            <ProtectedRoute>
              <DashboardLayout>
                <TeamManager />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <DashboardLayout>
                <UserManager />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
