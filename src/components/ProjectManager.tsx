import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Plus, Upload, Edit2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Project {
  id: string;
  title: string;
  tag: string;
  details: string;
  location: string;
  engineer: string;
  main_image: string;
}

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
}

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    tag: '',
    details: '',
    location: '',
    engineer: 'Struzon Team',
    main_image: ''
  });

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  const fetchProjectImages = async (projectId: string) => {
    const { data } = await supabase.from('project_images').select('*').eq('project_id', projectId);
    if (data) setProjectImages(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    fetchProjectImages(project.id);
  };

  const handleSaveProject = async () => {
    if (!editingProject) return;
    const { error } = await supabase.from('projects').update({
      title: editingProject.title,
      tag: editingProject.tag,
      details: editingProject.details,
      location: editingProject.location,
      engineer: editingProject.engineer,
      main_image: editingProject.main_image,
      updated_at: new Date()
    }).eq('id', editingProject.id);

    if (!error) {
      setEditingProject(null);
      fetchProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  };

  const handleAddProject = async () => {
    const { data, error } = await supabase.from('projects').insert([newProject]).select();
    if (!error && data) {
      setShowAddModal(false);
      setNewProject({ title: '', tag: '', details: '', location: '', engineer: 'Struzon Team', main_image: '' });
      fetchProjects();
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `projects/main/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('site_media').upload(filePath, file);

    if (uploadError) {
      alert('Error uploading main image');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('site_media').getPublicUrl(filePath);
    const url = publicUrlData.publicUrl;

    if (projectId) {
      setEditingProject(prev => prev ? { ...prev, main_image: url } : null);
    } else {
      setNewProject(prev => ({ ...prev, main_image: url }));
    }
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `projects/gallery/${projectId}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('site_media').upload(filePath, file);

    if (uploadError) {
      alert('Error uploading gallery image');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('site_media').getPublicUrl(filePath);
    
    await supabase.from('project_images').insert({
      project_id: projectId,
      image_url: publicUrlData.publicUrl
    });

    setUploading(false);
    fetchProjectImages(projectId);
  };

  const handleDeleteGalleryImage = async (imageId: string, projectId: string) => {
    await supabase.from('project_images').delete().eq('id', imageId);
    fetchProjectImages(projectId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Project Management</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded hover:bg-red-700 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Plus size={20} />}
          {uploading ? 'Uploading...' : 'Add Project'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border dark:border-gray-700 flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img src={project.main_image} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => handleEditProject(project)} className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-blue-600 hover:text-blue-800 shadow-sm">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteProject(project.id)} className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-red-600 hover:text-red-800 shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1">
                <div className="text-xs font-bold text-brand-red uppercase mb-1">{project.tag}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">{project.title}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{project.details}</div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{project.location}</span>
                  <span>{project.engineer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-xl font-bold dark:text-white">Edit Project: {editingProject.title}</h3>
              <button onClick={() => setEditingProject(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editingProject.title}
                      onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tag</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editingProject.tag}
                      onChange={e => setEditingProject({...editingProject, tag: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Location</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editingProject.location}
                      onChange={e => setEditingProject({...editingProject, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Lead Engineer</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={editingProject.engineer}
                      onChange={e => setEditingProject({...editingProject, engineer: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Main Image</label>
                    <div className="aspect-video relative rounded-lg overflow-hidden border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 group">
                      <img src={editingProject.main_image} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <Upload className="text-white" />
                        <input type="file" className="hidden" onChange={e => handleMainImageUpload(e, editingProject.id)} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Details</label>
                    <textarea 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24 resize-none"
                      value={editingProject.details}
                      onChange={e => setEditingProject({...editingProject, details: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold dark:text-white">Sub-Pictures / Gallery</h4>
                  <label className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700 dark:text-white px-3 py-1.5 rounded cursor-pointer hover:bg-gray-200">
                    <Plus size={16} /> Add Image
                    <input type="file" className="hidden" onChange={e => handleGalleryUpload(e, editingProject.id)} />
                  </label>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {projectImages.map(img => (
                    <div key={img.id} className="aspect-square relative group rounded border dark:border-gray-700 overflow-hidden">
                      <img src={img.image_url} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => handleDeleteGalleryImage(img.id, editingProject.id)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t dark:border-gray-700 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-800">
              <button onClick={() => setEditingProject(null)} className="px-6 py-2 border rounded dark:text-white hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveProject} className="px-6 py-2 bg-brand-red text-white rounded hover:bg-red-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Create New Project</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tag</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g. Commercial"
                    value={newProject.tag}
                    onChange={e => setNewProject({...newProject, tag: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={newProject.location}
                    onChange={e => setNewProject({...newProject, location: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Main Image</label>
                <div className="aspect-video relative rounded-lg overflow-hidden border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 group">
                  {newProject.main_image ? (
                    <img src={newProject.main_image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <Upload size={32} />
                      <span className="text-xs mt-2">Upload Cover</span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload className="text-white" />
                    <input type="file" className="hidden" onChange={e => handleMainImageUpload(e)} />
                  </label>
                </div>
              </div>
              <button 
                onClick={handleAddProject}
                disabled={!newProject.title || !newProject.main_image}
                className="w-full py-3 bg-brand-red text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
