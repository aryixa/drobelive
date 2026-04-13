import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';
import { uploadWardrobeImage } from '../../lib/storage';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'top' | 'bottom' | 'shoes' | 'accessory'>('top');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    try {
      // 1. Upload to storage
      const { publicUrl, storagePath } = await uploadWardrobeImage(user.id, file);

      // 2. Save metadata to DB
      const { error: dbError } = await supabase
        .from('wardrobe_items')
        .insert({
          user_id: user.id,
          name,
          category,
          image_url: publicUrl,
          image_path: storagePath,
        });

      if (dbError) throw dbError;

      toast.success('Item added to your drobe!', { duration: 2000 });
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error.message, { duration: 2000 });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setName('');
    setCategory('top');
    onClose();
  };

  const categories = ['top', 'bottom', 'shoes', 'accessory'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image Side */}
          <div className="w-full md:w-1/2 bg-zinc-50 border-r border-zinc-100 flex flex-col items-center justify-center p-8 min-h-[300px]">
            {preview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-[400px] object-contain rounded-2xl shadow-lg border-4 border-white"
                />
                <button
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-zinc-200 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-100/50 transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="text-zinc-400 group-hover:text-black transition-colors" size={24} />
                </div>
                <p className="font-medium text-zinc-900">Upload Image</p>
                <p className="text-sm text-zinc-400 mt-1">JPEG, PNG up to 15MB</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <h2 className="text-2xl font-serif text-zinc-900 mb-8">Add to Wardrobe!</h2>

            <form onSubmit={handleUpload} className="flex-1 flex flex-col space-y-6">
              <Input
                label="Item Name"
                placeholder="e.g. Silk Evening Gown"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat as any)}
                      className={cn(
                        'px-4 py-2.5 rounded-xl text-sm font-medium border transition-all text-center capitalize',
                        category === cat
                          ? 'bg-black text-white border-black'
                          : 'bg-zinc-50 text-zinc-500 border-zinc-100 hover:border-zinc-300'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <Button
                  type="submit"
                  className="w-full h-14"
                  loading={uploading}
                  disabled={!file || !name}
                >
                  {uploading ? 'Processing...' : 'Securely Upload'}
                </Button>
                <p className="text-[10px] text-zinc-400 text-center mt-3 uppercase tracking-widest leading-relaxed">
                  Indexed and optimized powered by model analysis
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
