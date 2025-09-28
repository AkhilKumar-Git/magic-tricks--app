// Supabase Storage utilities for file uploads
import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  userId: string;
}

/**
 * Upload a file to Supabase storage
 */
export const uploadFile = async ({
  bucket,
  path,
  file,
  userId
}: UploadOptions): Promise<UploadResult> => {
  try {
    // Create the full path with user ID folder
    const fullPath = `${userId}/${path}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: true // This will overwrite existing files
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath);

    return {
      success: true,
      url: urlData.publicUrl,
      path: fullPath
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Upload a profile picture
 */
export const uploadProfilePicture = async (
  file: File,
  userId: string
): Promise<UploadResult> => {
  // Generate a unique filename
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const filename = `profile_${timestamp}.${fileExtension}`;

  return uploadFile({
    bucket: 'profile_pictures',
    path: filename,
    file,
    userId
  });
};

/**
 * Upload a user video
 */
export const uploadUserVideo = async (
  file: File,
  userId: string,
  customName?: string
): Promise<UploadResult> => {
  // Generate a unique filename
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop() || 'mp4';
  const filename = customName ? `${customName}_${timestamp}.${fileExtension}` : `video_${timestamp}.${fileExtension}`;

  return uploadFile({
    bucket: 'user_videos',
    path: filename,
    file,
    userId
  });
};

/**
 * Delete a file from Supabase storage
 */
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Delete a profile picture
 */
export const deleteProfilePicture = async (
  userId: string,
  filename: string
): Promise<{ success: boolean; error?: string }> => {
  const fullPath = `${userId}/${filename}`;
  return deleteFile('profile_pictures', fullPath);
};

/**
 * Delete a user video
 */
export const deleteUserVideo = async (
  userId: string,
  filename: string
): Promise<{ success: boolean; error?: string }> => {
  const fullPath = `${userId}/${filename}`;
  return deleteFile('user_videos', fullPath);
};

/**
 * Get the public URL for a file
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Validate file type and size
 */
export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSizeInBytes: number
): { valid: boolean; error?: string } => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Check file size
  if (file.size > maxSizeInBytes) {
    const maxSizeMB = Math.round(maxSizeInBytes / (1024 * 1024));
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`
    };
  }

  return { valid: true };
};

/**
 * Validate profile picture
 */
export const validateProfilePicture = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validateFile(file, allowedTypes, maxSize);
};

/**
 * Validate user video
 */
export const validateUserVideo = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  return validateFile(file, allowedTypes, maxSize);
};

/**
 * Extract filename from Supabase storage URL
 */
export const extractFilenameFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1];
  } catch {
    return null;
  }
};

/**
 * Extract user ID from Supabase storage URL
 */
export const extractUserIdFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Path format: /storage/v1/object/public/bucket_name/user_id/filename
    const userIdIndex = pathParts.findIndex(part => part === 'public') + 2;
    return pathParts[userIdIndex] || null;
  } catch {
    return null;
  }
};
