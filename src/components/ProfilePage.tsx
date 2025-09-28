import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, User, Camera, Upload, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { uploadProfilePicture, validateProfilePicture, extractFilenameFromUrl } from '../lib/supabaseStorage';

interface ProfilePageProps {
  onBackToLanding: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBackToLanding }) => {
  const { user, userProfile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || '',
    bio: userProfile?.bio || '',
    profilePicture: userProfile?.profile || ''
  });

  // Update local state when userProfile changes
  useEffect(() => {
    setProfileData({
      name: userProfile?.name || '',
      bio: userProfile?.bio || '',
      profilePicture: userProfile?.profile || ''
    });
  }, [userProfile]);

  const handleSave = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (profileData.bio.length > 500) {
      newErrors.bio = 'Bio must be 500 characters or less';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');
    
    try {
      const { error } = await updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        profile: profileData.profilePicture
      });

      if (error) {
        console.error('Error updating profile:', error);
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        setIsEditing(false);
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('error');
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: userProfile?.name || '',
      bio: userProfile?.bio || '',
      profilePicture: userProfile?.profile || ''
    });
    setIsEditing(false);
    setErrors({});
    setSaveStatus('idle');
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const validation = validateProfilePicture(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, profilePicture: validation.error || 'Invalid file' }));
      return;
    }

    // Clear previous errors
    setErrors(prev => ({ ...prev, profilePicture: '' }));
    setUploadStatus('uploading');

    try {
      // Upload to Supabase storage
      const result = await uploadProfilePicture(file, user.id);
      
      if (result.success && result.url) {
        setProfileData(prev => ({ 
          ...prev, 
          profilePicture: result.url! 
        }));
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 2000);
      } else {
        setErrors(prev => ({ ...prev, profilePicture: result.error || 'Upload failed' }));
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      setErrors(prev => ({ ...prev, profilePicture: 'Upload failed. Please try again.' }));
      setUploadStatus('error');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
                  <User className="w-6 h-6 text-white" />
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bebas text-white mb-4">
              Profile
            </h1>
            <p className="text-xl text-gray-300">
              Manage your profile information and settings
            </p>
          </div>

          <div className="bg-medium-gray rounded-2xl p-8 border border-gray-700 animate-fade-in-up">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-electric-blue to-magenta p-1">
                  <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center overflow-hidden">
                    {profileData.profilePicture ? (
                      <img
                        src={profileData.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-4xl font-bold text-white">${getInitials(profileData.name || user?.email || 'U')}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {getInitials(profileData.name || user?.email || 'U')}
                      </span>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-electric-blue hover:bg-electric-blue/80 text-white p-2 rounded-full transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
              
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadStatus === 'uploading'}
                  className={`mt-4 flex items-center space-x-2 transition-colors ${
                    uploadStatus === 'uploading' 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-electric-blue hover:text-electric-blue/80'
                  }`}
                >
                  {uploadStatus === 'uploading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : uploadStatus === 'success' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Uploaded!</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Change Profile Picture</span>
                    </>
                  )}
                </button>
              )}
              
              {errors.profilePicture && (
                <p className="text-red-400 text-sm mt-2">{errors.profilePicture}</p>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bebas text-white">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-600 text-gray-300 rounded-full font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saveStatus === 'saving'}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                        saveStatus === 'saved'
                          ? 'bg-green-600 text-white'
                          : saveStatus === 'error'
                          ? 'bg-red-600 text-white'
                          : 'bg-gradient-to-r from-electric-blue to-magenta text-white hover:shadow-lg hover:shadow-electric-blue/25'
                      }`}
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : saveStatus === 'saved' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                      }`}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-charcoal border border-gray-600 rounded-lg text-white">
                      {profileData.name || 'Not set'}
                    </div>
                  )}
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-charcoal border border-gray-600 rounded-lg text-gray-400">
                    {user?.email || 'Not available'}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Email cannot be changed here</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors resize-none ${
                      errors.bio ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                    }`}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                ) : (
                  <div className="px-4 py-3 bg-charcoal border border-gray-600 rounded-lg text-white min-h-[100px]">
                    {profileData.bio || 'No bio added yet'}
                  </div>
                )}
                {isEditing && (
                  <p className="text-gray-500 text-sm mt-1">
                    {profileData.bio.length}/500 characters
                  </p>
                )}
                {errors.bio && <p className="text-red-400 text-sm mt-1">{errors.bio}</p>}
              </div>
            </div>

            {/* Account Actions */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/magic-tricks')}
                  className="flex-1 bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
