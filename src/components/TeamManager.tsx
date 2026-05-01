import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Plus, Upload, Edit2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import imgRajadurai from '../assets/rajadurai.png';
import imgBalasaravana from '../assets/balasaravanan.png';
import imgSaravanan from '../assets/saravanan.png';
import imgAnand from '../assets/anand.png';
import imgAlan from '../assets/alan.png';

const localImages: Record<string, string> = {
  "Rajadurai": imgRajadurai,
  "Balasaravana": imgBalasaravana,
  "Saravanan": imgSaravanan,
  "Anand": imgAnand,
  "Alan (P.E)": imgAlan
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  linkedin: string;
  image_url: string;
  bio: string[];
  sort_order: number;
}

export function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    email: '',
    linkedin: '',
    image_url: '',
    bio: []
  });

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true });
    if (data) setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSaveMember = async () => {
    if (!editingMember) return;
    const { error } = await supabase.from('team_members').update({
      name: editingMember.name,
      role: editingMember.role,
      email: editingMember.email,
      linkedin: editingMember.linkedin,
      image_url: editingMember.image_url,
      bio: editingMember.bio,
      updated_at: new Date()
    }).eq('id', editingMember.id);

    if (!error) {
      setEditingMember(null);
      fetchMembers();
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    fetchMembers();
  };

  const handleAddMember = async () => {
    const { error } = await supabase.from('team_members').insert([
      { ...newMember, sort_order: members.length }
    ]);
    if (!error) {
      setShowAddModal(false);
      setNewMember({ name: '', role: '', email: '', linkedin: '', image_url: '', bio: [] });
      fetchMembers();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, memberId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `team/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('site_media').upload(filePath, file);

    if (uploadError) {
      alert('Error uploading image');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('site_media').getPublicUrl(filePath);
    const url = publicUrlData.publicUrl;

    if (memberId) {
      setEditingMember(prev => prev ? { ...prev, image_url: url } : null);
    } else {
      setNewMember(prev => ({ ...prev, image_url: url }));
    }
    setUploading(false);
  };

  const moveMember = async (id: string, direction: 'up' | 'down') => {
    const index = members.findIndex(m => m.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === members.length - 1)) return;

    const newMembers = [...members];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];

    // Update sort_order for all members to be safe
    const updates = newMembers.map((m, i) => ({
      id: m.id,
      sort_order: i
    }));

    for (const update of updates) {
      await supabase.from('team_members').update({ sort_order: update.sort_order }).eq('id', update.id);
    }
    fetchMembers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Team Management</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          <Plus size={20} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading team...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map(member => (
            <div key={member.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border dark:border-gray-700 flex flex-col">
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                <img 
                  src={member.image_url || localImages[member.name]} 
                  alt={member.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (localImages[member.name]) {
                      target.src = localImages[member.name];
                    }
                  }}
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <button onClick={() => setEditingMember(member)} className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-blue-600 hover:text-blue-800 shadow-sm">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteMember(member.id)} className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-red-600 hover:text-red-800 shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1">
                   <button onClick={() => moveMember(member.id, 'up')} className="p-1 bg-white/80 dark:bg-gray-800/80 rounded hover:bg-white text-navy"><ChevronUp size={14}/></button>
                   <button onClick={() => moveMember(member.id, 'down')} className="p-1 bg-white/80 dark:bg-gray-800/80 rounded hover:bg-white text-navy"><ChevronDown size={14}/></button>
                </div>
              </div>
              <div className="p-4 flex-1 text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-xs font-bold text-brand-red uppercase mb-2">{member.role}</p>
                <div className="text-xs text-gray-500 truncate">{member.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-xl font-bold dark:text-white">Edit Member: {editingMember.name}</h3>
              <button onClick={() => setEditingMember(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editingMember.name}
                      onChange={e => setEditingMember({...editingMember, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editingMember.role}
                      onChange={e => setEditingMember({...editingMember, role: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editingMember.email}
                      onChange={e => setEditingMember({...editingMember, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editingMember.linkedin}
                      onChange={e => setEditingMember({...editingMember, linkedin: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Profile Image</label>
                    <div className="aspect-[4/5] w-48 mx-auto relative rounded-lg overflow-hidden border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 group">
                      <img 
                        src={editingMember.image_url || localImages[editingMember.name]} 
                        className={`w-full h-full object-cover ${uploading ? 'opacity-50' : ''}`} 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (localImages[editingMember.name]) {
                            target.src = localImages[editingMember.name];
                          }
                        }}
                      />
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <Upload className="text-white" />
                        <input type="file" className="hidden" disabled={uploading} onChange={e => handleImageUpload(e, editingMember.id)} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Bio (One paragraph per line)</label>
                <textarea 
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white h-48 resize-none font-sans text-sm"
                  value={editingMember.bio.join('\n\n')}
                  onChange={e => setEditingMember({...editingMember, bio: e.target.value.split('\n\n').filter(p => p.trim())})}
                  placeholder="Paste bio paragraphs here, separated by double newlines..."
                />
              </div>
            </div>

            <div className="p-6 border-t dark:border-gray-700 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-800">
              <button onClick={() => setEditingMember(null)} className="px-6 py-2 border rounded dark:text-white hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveMember} className="px-6 py-2 bg-brand-red text-white rounded hover:bg-red-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Add Team Member</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={newMember.name}
                      onChange={e => setNewMember({...newMember, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={newMember.role}
                      onChange={e => setNewMember({...newMember, role: e.target.value})}
                    />
                  </div>
               </div>
              <div className="aspect-[4/5] w-32 mx-auto relative rounded-lg overflow-hidden border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 group">
                {newMember.image_url ? (
                  <img src={newMember.image_url} className={`w-full h-full object-cover ${uploading ? 'opacity-50' : ''}`} />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red"></div>
                    ) : (
                      <>
                        <Upload size={24} />
                        <span className="text-[10px] mt-1 text-center">Upload Photo</span>
                      </>
                    )}
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <Upload className="text-white" />
                  <input type="file" className="hidden" disabled={uploading} onChange={e => handleImageUpload(e)} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea 
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32 resize-none text-sm"
                  value={newMember.bio?.join('\n\n')}
                  onChange={e => setNewMember({...newMember, bio: e.target.value.split('\n\n').filter(p => p.trim())})}
                  placeholder="Bio paragraphs..."
                />
              </div>
              <button 
                onClick={handleAddMember}
                disabled={!newMember.name || !newMember.role || !newMember.image_url}
                className="w-full py-3 bg-brand-red text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
