import { useState } from 'react';
import { ArrowLeft, Save, User, Settings, Bell, Shield, Trash2, Zap, Eye, EyeOff, Check } from 'lucide-react';

interface ProfileSettingsPageProps {
  onBackToDashboard: () => void;
  onBackToLanding: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  profession: string;
  customProfession: string;
  goals: string[];
  tone: string;
  contentPillars: string[];
  emailNotifications: {
    contentReady: boolean;
    weeklyDigest: boolean;
    productUpdates: boolean;
    tips: boolean;
  };
  password: string;
  confirmPassword: string;
}

const professions = [
  'Marketing Professional',
  'Sales Manager',
  'Business Coach',
  'Consultant',
  'Entrepreneur',
  'Real Estate Agent',
  'Financial Advisor',
  'Healthcare Professional',
  'Technology Professional',
  'Creative Professional',
  'Other (specify)'
];

const goals = [
  { id: 'reach', label: 'Increase Reach & Visibility' },
  { id: 'authority', label: 'Build Thought Leadership' },
  { id: 'clients', label: 'Generate Leads & Clients' },
  { id: 'network', label: 'Professional Networking' }
];

const tones = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Conversational' },
  { id: 'storytelling', label: 'Storytelling' },
  { id: 'educational', label: 'Educational' }
];

const contentPillars = [
  { id: 'thought-leadership', label: 'Thought Leadership' },
  { id: 'tips-advice', label: 'Tips & Advice' },
  { id: 'personal-story', label: 'Personal Stories' },
  { id: 'business-growth', label: 'Business Growth' },
  { id: 'behind-scenes', label: 'Behind the Scenes' },
  { id: 'industry-insights', label: 'Industry Insights' }
];

const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ onBackToDashboard, onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'account'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock user data - in real app this would come from API/context
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    profession: 'Marketing Professional',
    customProfession: '',
    goals: ['reach', 'authority'],
    tone: 'professional',
    contentPillars: ['thought-leadership', 'tips-advice', 'business-growth'],
    emailNotifications: {
      contentReady: true,
      weeklyDigest: true,
      productUpdates: false,
      tips: true
    },
    password: '',
    confirmPassword: ''
  });

  const handleSave = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!profile.name.trim()) newErrors.name = 'Name is required';
    if (!profile.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profile.email)) newErrors.email = 'Please enter a valid email';
    
    if (profile.password && profile.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (profile.password && profile.password !== profile.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleGoalToggle = (goalId: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handlePillarToggle = (pillarId: string) => {
    setProfile(prev => ({
      ...prev,
      contentPillars: prev.contentPillars.includes(pillarId)
        ? prev.contentPillars.filter(p => p !== pillarId)
        : [...prev.contentPillars, pillarId]
    }));
  };

  const handleNotificationToggle = (key: keyof typeof profile.emailNotifications) => {
    setProfile(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: !prev.emailNotifications[key]
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'preferences', label: 'Content Preferences', icon: Settings },
    { id: 'account', label: 'Account Settings', icon: Shield }
  ];

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
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bebas text-white">
                  ContentGen Pro
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBackToDashboard}
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bebas text-white mb-4">
              Profile & Settings
            </h1>
            <p className="text-xl text-gray-300">
              Manage your account and customize your content generation preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-medium-gray rounded-2xl p-6 border border-gray-700 animate-fade-in-up">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'profile' | 'preferences' | 'account')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-electric-blue to-magenta text-white'
                            : 'text-gray-400 hover:text-white hover:bg-charcoal'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-medium-gray rounded-2xl p-8 border border-gray-700 animate-fade-in-up">
                {/* Profile Info Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bebas text-white mb-6">Profile Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                            errors.name ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                            errors.email ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                          }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Profession / Industry
                      </label>
                      <select
                        value={profile.profession}
                        onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
                        className="w-full px-4 py-3 bg-charcoal border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors"
                      >
                        {professions.map((profession) => (
                          <option key={profession} value={profession}>
                            {profession}
                          </option>
                        ))}
                      </select>
                    </div>

                    {profile.profession === 'Other (specify)' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Specify Your Profession
                        </label>
                        <input
                          type="text"
                          value={profile.customProfession}
                          onChange={(e) => setProfile(prev => ({ ...prev, customProfession: e.target.value }))}
                          className="w-full px-4 py-3 bg-charcoal border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors"
                          placeholder="Enter your profession"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Content Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bebas text-white mb-6">Content Preferences</h2>
                    
                    {/* Content Goals */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Content Goals (Select all that apply)
                      </label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {goals.map((goal) => (
                          <button
                            key={goal.id}
                            onClick={() => handleGoalToggle(goal.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                              profile.goals.includes(goal.id)
                                ? 'border-electric-blue bg-electric-blue/10'
                                : 'border-gray-600 bg-charcoal hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                profile.goals.includes(goal.id)
                                  ? 'border-electric-blue bg-electric-blue'
                                  : 'border-gray-500'
                              }`}>
                                {profile.goals.includes(goal.id) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className="font-semibold text-white">{goal.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content Tone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Preferred Content Tone
                      </label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {tones.map((tone) => (
                          <button
                            key={tone.id}
                            onClick={() => setProfile(prev => ({ ...prev, tone: tone.id }))}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                              profile.tone === tone.id
                                ? 'border-magenta bg-magenta/10'
                                : 'border-gray-600 bg-charcoal hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                profile.tone === tone.id
                                  ? 'border-magenta bg-magenta'
                                  : 'border-gray-500'
                              }`}>
                                {profile.tone === tone.id && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="font-semibold text-white">{tone.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content Pillars */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Preferred Content Pillars (Select your favorites)
                      </label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contentPillars.map((pillar) => (
                          <button
                            key={pillar.id}
                            onClick={() => handlePillarToggle(pillar.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                              profile.contentPillars.includes(pillar.id)
                                ? 'border-electric-blue bg-electric-blue/10'
                                : 'border-gray-600 bg-charcoal hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                profile.contentPillars.includes(pillar.id)
                                  ? 'border-electric-blue bg-electric-blue'
                                  : 'border-gray-500'
                              }`}>
                                {profile.contentPillars.includes(pillar.id) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className="font-medium text-white text-sm">{pillar.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Settings Tab */}
                {activeTab === 'account' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bebas text-white mb-6">Account Settings</h2>
                    
                    {/* Change Password */}
                    <div className="bg-charcoal rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={profile.password}
                              onChange={(e) => setProfile(prev => ({ ...prev, password: e.target.value }))}
                              className={`w-full px-4 py-3 bg-medium-gray border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors pr-12 ${
                                errors.password ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                              }`}
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={profile.confirmPassword}
                              onChange={(e) => setProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className={`w-full px-4 py-3 bg-medium-gray border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors pr-12 ${
                                errors.confirmPassword ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                              }`}
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Email Notifications */}
                    <div className="bg-charcoal rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Bell className="w-5 h-5" />
                        <span>Email Notifications</span>
                      </h3>
                      <div className="space-y-4">
                        {[
                          { key: 'contentReady', label: 'Content Ready Notifications', description: 'Get notified when new content is generated' },
                          { key: 'weeklyDigest', label: 'Weekly Content Digest', description: 'Weekly summary of your content performance' },
                          { key: 'productUpdates', label: 'Product Updates', description: 'New features and platform improvements' },
                          { key: 'tips', label: 'Content Tips & Best Practices', description: 'Expert advice to improve your content strategy' }
                        ].map((notification) => (
                          <div key={notification.key} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                            <div>
                              <div className="text-white font-medium">{notification.label}</div>
                              <div className="text-gray-400 text-sm">{notification.description}</div>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle(notification.key as keyof typeof profile.emailNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                profile.emailNotifications[notification.key as keyof typeof profile.emailNotifications]
                                  ? 'bg-electric-blue'
                                  : 'bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  profile.emailNotifications[notification.key as keyof typeof profile.emailNotifications]
                                    ? 'translate-x-6'
                                    : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center space-x-2">
                        <Trash2 className="w-5 h-5" />
                        <span>Danger Zone</span>
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-8 border-t border-gray-700 mt-8">
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className={`flex items-center space-x-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                      saveStatus === 'saved'
                        ? 'bg-green-600 text-white'
                        : saveStatus === 'error'
                        ? 'bg-red-600 text-white'
                        : 'bg-gradient-to-r from-electric-blue to-magenta text-white hover:shadow-lg hover:shadow-electric-blue/25'
                    }`}
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;