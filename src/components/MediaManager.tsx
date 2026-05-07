import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface GalleryItem {
  id: string;
  gallery_name: string;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
}

export function MediaManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGallery, setActiveGallery] = useState<string>('OfficeGallery');
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const galleries = ['OfficeGallery', 'UpcomingProjects'];

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('galleries').select('*').order('sort_order', { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdateTitle = async (id: string) => {
    await supabase.from('galleries').update({ title: editTitle }).eq('id', id);
    setEditingId(null);
    fetchItems();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${activeGallery}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('site_media').upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      alert('Error uploading file!');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('site_media').getPublicUrl(filePath);

    // Add to gallery
    await supabase.from('galleries').insert([
      {
        gallery_name: activeGallery,
        image_url: publicUrlData.publicUrl,
        title: file.name,
      }
    ]);

    setUploading(false);
    fetchItems();
  };

  const handleDelete = async (id: string, url: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    // Delete from DB
    await supabase.from('galleries').delete().eq('id', id);

    // Optionally delete from storage if we want (extract filepath from URL)
    try {
      const urlParts = url.split('/site_media/');
      if (urlParts.length > 1) {
        const path = urlParts[1];
        await supabase.storage.from('site_media').remove([path]);
      }
    } catch (e) {
      console.error("Could not delete from storage", e);
    }

    fetchItems();
  };

  const currentItems = items.filter(i => i.gallery_name === activeGallery);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Media & Galleries</h2>
        <label className={`flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded cursor-pointer hover:bg-red-700 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? <Upload className="animate-bounce" size={20} /> : <Plus size={20} />}
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="flex gap-2 border-b dark:border-gray-700 pb-2">
        {galleries.map(g => (
          <button
            key={g}
            onClick={() => setActiveGallery(g)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeGallery === g 
                ? 'bg-white dark:bg-gray-800 text-brand-red border-t border-x dark:border-gray-700' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
        {loading ? (
          <div>Loading images...</div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-10 text-gray-500 flex flex-col items-center">
            <ImageIcon size={48} className="mb-4 opacity-20" />
            <p>No images found in {activeGallery}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentItems.map(item => (
              <div key={item.id} className="group relative border dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 aspect-square">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-white text-black text-xs p-1 rounded border-none focus:ring-1 focus:ring-brand-red"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle(item.id)}
                      />
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleUpdateTitle(item.id)}
                          className="bg-green-600 text-white text-[10px] px-2 py-1 rounded"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="bg-gray-600 text-white text-[10px] px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-white text-xs drop-shadow-md font-bold uppercase tracking-wider">
                        {item.title || 'No Label'}
                        <button 
                          onClick={() => {
                            setEditingId(item.id);
                            setEditTitle(item.title || '');
                          }}
                          className="ml-2 text-white/50 hover:text-white"
                        >
                          Edit
                        </button>
                      </div>
                      <button 
                        onClick={() => handleDelete(item.id, item.image_url)}
                        className="self-end bg-red-600 text-white p-1.5 rounded hover:bg-red-700 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
