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
import { LayoutDashboard, Users, FileText, Briefcase, LogOut, ImageIcon, FolderKanban, Shield, Rocket } from 'lucide-react';
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

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <img src="/struzon-logo.png" alt="Struzon" className="h-8 w-auto" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/content" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <FileText size={20} /> Content
          </Link>
          <Link to="/projects" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <FolderKanban size={20} /> Projects
          </Link>
          <Link to="/media" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <ImageIcon size={20} /> Media
          </Link>
          <Link to="/team" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Users size={20} /> Team
          </Link>
          <Link to="/vacancies" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Briefcase size={20} /> Vacancies
          </Link>
          <Link to="/users" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Shield size={20} /> Access Control
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-4 px-2 text-sm text-gray-500 truncate">{user?.email}</div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-8">
          {children}
        </div>
      </main>
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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h2>
      <p className="text-gray-600 dark:text-gray-400">Welcome back. Here is an overview of the current website data.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="text-brand-red" size={24} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Vacancies</h3>
          </div>
          <div className="space-y-3">
            {vacancies.length === 0 ? (
              <p className="text-sm text-gray-500">No vacancies found.</p>
            ) : (
              vacancies.map(v => (
                <div key={v.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-0">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{v.title}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${v.status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {v.status === 'Open' ? `Vacancy-${v.spots}` : 'Closed'}
                  </span>
                </div>
              ))
            )}
          </div>
          <Link to="/vacancies" className="mt-4 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline">Manage Vacancies &rarr;</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-brand-red" size={24} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Site Content</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">You are managing {contentItems} dynamic text elements on the website.</p>
          <Link to="/content" className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline">Edit Content &rarr;</Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Rocket className="text-brand-red" size={24} />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Pipeline Assets</h3>
        </div>
        <ImageAutoSlider />
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          These assets are pulled automatically from <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">src/assets/upcoming</code>. 
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
