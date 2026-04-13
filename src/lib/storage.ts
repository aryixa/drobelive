import { supabase } from './supabase';

export interface UploadProgress {
  percentage: number;
}

export const generateStoragePath = (userId: string, fileName: string) => {
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  return `${userId}/${timestamp}_${cleanFileName}`;
};

export const validateFile = (file: File) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 15 * 1024 * 1024; // 15MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Please upload a JPEG or PNG image.');
  }

  if (file.size > maxSize) {
    throw new Error('File size exceeds 15MB limit.');
  }

  return true;
};

export const uploadWardrobeImage = async (
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
) => {
  try {
    validateFile(file);
    const path = generateStoragePath(userId, file.name);

    // Supabase JS SDK doesn't natively support progress in the default upload method,
    // but we can simulate or use standard XHR if needed. For now, we'll use a simple upload.
    const { data, error } = await supabase.storage
      .from('wardrobe')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('wardrobe')
      .getPublicUrl(path);

    return {
      publicUrl,
      storagePath: path,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload image');
  }
};

export const deleteWardrobeImage = async (path: string) => {
  try {
    const { error } = await supabase.storage
      .from('wardrobe')
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Storage deletion failed:', error);
    // Even if storage fails, we might want to proceed or handle it specifically
    return false;
  }
};
