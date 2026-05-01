import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Edit2, Check, X, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ContentItem {
  key: string;
  value: string;
  page: string;
  type: string;
}

export function ContentManager() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [uploading, setUploading] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_content').select('*').order('key');
    if (!error && data) {
      setContent(data.map(d => ({ 
        key: d.key, 
        value: typeof d.value === 'string' ? d.value : JSON.stringify(d.value),
        page: d.page || 'Global',
        type: d.type || 'text'
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const pages = Array.from(new Set(content.map(c => c.page))).sort();
  const currentContent = content.filter(c => c.page === activeTab);

  const handleEdit = (item: ContentItem) => {
    setEditingKey(item.key);
    let val = item.value;
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    // Remove escaped newlines if it's a JSON string
    try {
        if (item.value.startsWith('"')) {
            val = JSON.parse(item.value);
        }
    } catch (e) {}
    setEditValue(val);
  };

  const handleSave = async (key: string) => {
    const jsonValue = JSON.stringify(editValue);
    await supabase.from('site_content').upsert({ key, value: jsonValue, updated_at: new Date() });
    setEditingKey(null);
    fetchContent();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `content/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('site_media').upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      alert('Error uploading file!');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('site_media').getPublicUrl(filePath);
    
    // Save new URL to site_content
    await supabase.from('site_content').upsert({ key, value: JSON.stringify(publicUrlData.publicUrl), updated_at: new Date() });
    setUploading(false);
    setEditingKey(null);
    fetchContent();
  };

  if (loading && !content.length) return <div>Loading content...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Website Content Manager</h2>
      </div>

      {pages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 border-b dark:border-gray-700">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => setActiveTab(page)}
              className={`px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === page 
                  ? 'bg-white dark:bg-gray-800 text-brand-red border-t border-x dark:border-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {currentContent.map((item) => (
            <li key={item.key} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-6">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wider">
                    {item.key.toUpperCase().replace(/_/g, ' ')}
                  </h3>
                  {editingKey === item.key ? (
                    <div className="mt-1">
                      {item.type === 'image' ? (
                        <div className="flex items-center gap-4">
                          <label className={`flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded cursor-pointer hover:bg-red-700 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            {uploading ? <Upload className="animate-bounce" size={20} /> : <Upload size={20} />}
                            {uploading ? 'Uploading...' : 'Select New Image'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, item.key)} disabled={uploading} />
                          </label>
                          <button onClick={() => setEditingKey(null)} className="flex items-center gap-1 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white px-3 py-2 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500">
                            <X size={16} /> Cancel
                          </button>
                        </div>
                      ) : item.type === 'textarea' ? (
                        <textarea
                          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          rows={4}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      )}
                      
                      {item.type !== 'image' && (
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => handleSave(item.key)} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700">
                            <Check size={16} /> Save
                          </button>
                          <button onClick={() => setEditingKey(null)} className="flex items-center gap-1 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white px-3 py-1.5 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500">
                            <X size={16} /> Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {item.type === 'image' ? (
                        <img src={item.value.startsWith('"') ? JSON.parse(item.value) : item.value} alt={item.key} className="h-24 rounded shadow-sm" />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 text-lg whitespace-pre-line">
                          {item.value.startsWith('"') && item.value.endsWith('"') ? JSON.parse(item.value) : item.value}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {editingKey !== item.key && (
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <Edit2 size={18} />
                  </button>
                )}
              </div>
            </li>
          ))}
          {currentContent.length === 0 && (
            <li className="p-6 text-center text-gray-500">No dynamic content found for {activeTab}.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
