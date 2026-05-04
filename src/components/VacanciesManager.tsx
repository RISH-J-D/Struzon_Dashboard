import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit } from 'lucide-react';

interface Vacancy {
  id: string;
  title: string;
  type: string;
  location: string;
  experience: string;
  status: string;
  spots: number;
}

export function VacanciesManager() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<Vacancy | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '', type: 'Full-time', location: 'Remote', experience: '1-3 years', status: 'Open', spots: 1
  });

  const fetchVacancies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('vacancies').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setVacancies(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await supabase.from('vacancies').update(formData).eq('id', isEditing.id);
    } else {
      await supabase.from('vacancies').insert([formData]);
    }
    setIsEditing(null);
    setIsCreating(false);
    fetchVacancies();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vacancy?')) {
      await supabase.from('vacancies').delete().eq('id', id);
      fetchVacancies();
    }
  };

  const openEdit = (v: Vacancy) => {
    setFormData({ title: v.title, type: v.type, location: v.location, experience: v.experience, status: v.status, spots: v.spots });
    setIsEditing(v);
    setIsCreating(true);
  };

  const openCreate = () => {
    setFormData({ title: '', type: 'Full-time', location: 'Remote', experience: '1-3 years', status: 'Open', spots: 1 });
    setIsEditing(null);
    setIsCreating(true);
  };

  if (loading && !vacancies.length) return <div>Loading vacancies...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Vacancies Manager</h2>
        {!isCreating && (
          <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            <Plus size={20} /> Add Vacancy
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4 dark:text-white">{isEditing ? 'Edit Vacancy' : 'New Vacancy'}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
              <input required className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option>Full-time</option><option>Part-time</option><option>Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <select 
                className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})}
              >
                <option>Remote</option>
                <option>Onsite</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience Requirement</label>
              <div className="flex flex-wrap gap-6 items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border dark:border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.experience === 'Fresher'} 
                    onChange={() => setFormData({...formData, experience: 'Fresher'})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Fresher</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.experience !== 'Fresher'} 
                    onChange={() => {
                      if (formData.experience === 'Fresher') {
                        setFormData({...formData, experience: '1-3 Years'});
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Experienced</span>
                </label>

                {formData.experience !== 'Fresher' && (
                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300 pl-6 border-l dark:border-gray-700 ml-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400">From</span>
                      <select 
                        className="p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.experience.split('-')[0]?.replace('Years', '').trim() || '1'}
                        onChange={(e) => {
                          const toPart = formData.experience.split('-')[1]?.trim() || '3 Years';
                          setFormData({...formData, experience: `${e.target.value} - ${toPart}`});
                        }}
                      >
                        {Array.from({length: 12}, (_, i) => i + 1).map(y => <option key={y} value={y}>{y} Years</option>)}
                      </select>
                    </div>
                    <div className="text-gray-400 mt-4 px-1">to</div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400">To</span>
                      <select 
                        className="p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.experience.split('-')[1]?.replace('Years', '').trim() || '3'}
                        onChange={(e) => {
                          const fromPart = formData.experience.split('-')[0]?.trim() || '1';
                          setFormData({...formData, experience: `${fromPart} - ${e.target.value} Years`});
                        }}
                      >
                        {Array.from({length: 12}, (_, i) => i + 1).map(y => <option key={y} value={y}>{y} Years</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option>Open</option><option>Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Available Spots</label>
              <input type="number" min="1" required className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.spots} onChange={e => setFormData({...formData, spots: parseInt(e.target.value) || 1})} />
            </div>
            <div className="sm:col-span-2 flex gap-3 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
              <button type="button" onClick={() => setIsCreating(false)} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type/Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spots</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {vacancies.map((v) => (
                <tr key={v.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{v.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.type} • {v.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${v.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.spots}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEdit(v)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {vacancies.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No vacancies found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
