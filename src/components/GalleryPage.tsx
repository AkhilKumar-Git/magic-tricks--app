import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, Image, Video, Trash2, Eye, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { uploadUserVideo, validateUserVideo, validateProfilePicture, deleteUserVideo } from '../lib/supabaseStorage';

interface GalleryPageProps {
  onBackToLanding: () => void;
}

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  type: 'image' | 'video';
  uploadedAt: string;
  size: number;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ onBackToLanding }) => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video' | null>(null);

  // Mock data for now - in real app this would come from API
  useEffect(() => {
    // This would be replaced with actual API call to fetch user's media
    const mockMedia: MediaItem[] = [
      {
        id: '1',
        url: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Sample+Image',
        filename: 'sample_image.jpg',
        type: 'image',
        uploadedAt: new Date().toISOString(),
        size: 1024000
      },
      {
        id: '2',
        url: 'https://via.placeholder.com/400x300/EC4899/FFFFFF?text=Sample+Video',
        filename: 'sample_video.mp4',
        type: 'video',
        uploadedAt: new Date().toISOString(),
        size: 5120000
      }
    ];
    setMediaItems(mockMedia);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !uploadType) return;

    // Validate file based on type
    const validation = uploadType === 'image' 
      ? validateProfilePicture(file) 
      : validateUserVideo(file);
    
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, upload: validation.error || 'Invalid file' }));
      return;
    }

    // Clear previous errors
    setErrors(prev => ({ ...prev, upload: '' }));
    setUploadStatus('uploading');
    setIsUploading(true);

    try {
      // Upload to Supabase storage
      const result = await uploadUserVideo(file, user.id, uploadType);
      
      if (result.success && result.url) {
        // Add to media items
        const newMediaItem: MediaItem = {
          id: Date.now().toString(),
          url: result.url,
          filename: file.name,
          type: uploadType,
          uploadedAt: new Date().toISOString(),
          size: file.size
        };
        
        setMediaItems(prev => [newMediaItem, ...prev]);
        setUploadStatus('success');
        setShowUploadModal(false);
        setUploadType(null);
        setTimeout(() => setUploadStatus('idle'), 2000);
      } else {
        setErrors(prev => ({ ...prev, upload: result.error || 'Upload failed' }));
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Media upload error:', error);
      setErrors(prev => ({ ...prev, upload: 'Upload failed. Please try again.' }));
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaItem: MediaItem) => {
    if (!user) return;

    try {
      const result = await deleteUserVideo(user.id, mediaItem.filename);
      if (result.success) {
        setMediaItems(prev => prev.filter(item => item.id !== mediaItem.id));
        if (selectedMedia?.id === mediaItem.id) {
          setSelectedMedia(null);
        }
      } else {
        console.error('Delete failed:', result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openUploadModal = (type: 'image' | 'video') => {
    setUploadType(type);
    setShowUploadModal(true);
    setErrors({});
    setUploadStatus('idle');
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadType(null);
    setErrors({});
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-white font-manrope">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-electric-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-magenta/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-medium-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-electric-blue to-magenta p-2 rounded-lg">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bebas text-white">
                  ContentGen Pro
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/magic-tricks')}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
                <button
                  onClick={onBackToLanding}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bebas text-white mb-4">
                  Media Gallery
                </h1>
                <p className="text-xl text-gray-300">
                  Showcase your images and videos
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={() => openUploadModal('image')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
                >
                  <Image className="w-5 h-5" />
                  <span>Upload Image</span>
                </button>
                <button
                  onClick={() => openUploadModal('video')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-magenta to-electric-blue text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-magenta/25 transition-all duration-300"
                >
                  <Video className="w-5 h-5" />
                  <span>Upload Video</span>
                </button>
              </div>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in-up">
            {mediaItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No media yet</h3>
                <p className="text-gray-500 mb-6">Upload your first image or video to get started</p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => openUploadModal('image')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-electric-blue to-magenta text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
                  >
                    <Image className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    onClick={() => openUploadModal('video')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-magenta to-electric-blue text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-magenta/25 transition-all duration-300"
                  >
                    <Video className="w-4 h-4" />
                    <span>Upload Video</span>
                  </button>
                </div>
              </div>
            ) : (
              mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-medium-gray rounded-2xl overflow-hidden border border-gray-700 hover:border-electric-blue/50 transition-all duration-300 hover:shadow-lg hover:shadow-electric-blue/10"
                >
                  {/* Media Preview */}
                  <div className="aspect-square relative overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x400/374151/FFFFFF?text=Image+Error';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                          onError={(e) => {
                            const target = e.target as HTMLVideoElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full bg-gray-800 flex items-center justify-center"><Video class="w-12 h-12 text-gray-400" /></div>';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setSelectedMedia(item)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        title="View"
                      >
                        <Eye className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(item)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white truncate mb-1">
                      {item.filename}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{formatDate(item.uploadedAt)}</span>
                      <span>{formatFileSize(item.size)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-medium-gray rounded-2xl p-8 max-w-md w-full border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bebas text-white">
                  Upload {uploadType === 'image' ? 'Image' : 'Video'}
                </h2>
                <button
                  onClick={closeUploadModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-electric-blue/50 transition-colors">
                  <div className="mb-4">
                    {uploadType === 'image' ? (
                      <Image className="w-12 h-12 text-gray-400 mx-auto" />
                    ) : (
                      <Video className="w-12 h-12 text-gray-400 mx-auto" />
                    )}
                  </div>
                  <p className="text-gray-300 mb-2">
                    Click to select {uploadType === 'image' ? 'an image' : 'a video'} file
                  </p>
                  <p className="text-sm text-gray-500">
                    {uploadType === 'image' 
                      ? 'Supports: JPEG, PNG, GIF, WebP (Max: 5MB)'
                      : 'Supports: MP4, WebM, QuickTime, AVI (Max: 50MB)'
                    }
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isUploading
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-electric-blue to-magenta text-white hover:shadow-lg hover:shadow-electric-blue/25'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Choose File</span>
                    </div>
                  )}
                </button>

                {errors.upload && (
                  <p className="text-red-400 text-sm text-center">{errors.upload}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Media Viewer Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl max-h-[90vh] w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {selectedMedia.filename}
                </h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="bg-medium-gray rounded-lg overflow-hidden">
                {selectedMedia.type === 'image' ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.filename}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full h-auto max-h-[70vh]"
                  />
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                <span>Uploaded: {formatDate(selectedMedia.uploadedAt)}</span>
                <span>Size: {formatFileSize(selectedMedia.size)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
