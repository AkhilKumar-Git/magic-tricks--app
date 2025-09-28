import { useState } from 'react';
import { 
  Zap, 
  Copy, 
  Download, 
  Heart, 
  Search, 
  Plus, 
  ArrowLeft,
  Calendar,
  TrendingUp,
  Users,
  Eye,
  MoreHorizontal,
  Sparkles,
  Target,
  MessageCircle
} from 'lucide-react';

interface DashboardPageProps {
  onBackToLanding: () => void;
  onCarouselPreview: (carouselId: string) => void;
  onProfileSettings: () => void;
}

interface ContentCard {
  id: string;
  type: 'post' | 'carousel' | 'thread';
  title: string;
  content: string;
  tone: string;
  pillar: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  createdAt: string;
  isFavorited: boolean;
  platform: string[];
}

const mockContent: ContentCard[] = [
  {
    id: '1',
    type: 'post',
    title: 'The Power of Authentic Leadership',
    content: 'Authentic leadership isn\'t about being perfect—it\'s about being real. Here\'s what I\'ve learned after 10 years in management:\n\n✅ Vulnerability builds trust\n✅ Admitting mistakes shows strength\n✅ Listening creates connection\n\nYour team doesn\'t need a superhero. They need a human who cares about their growth and success.\n\nWhat\'s one leadership lesson that changed your perspective?',
    tone: 'Professional',
    pillar: 'Thought Leadership',
    engagement: { likes: 247, comments: 32, shares: 18 },
    createdAt: '2024-01-15',
    isFavorited: true,
    platform: ['LinkedIn', 'Twitter']
  },
  {
    id: '2',
    type: 'carousel',
    title: '5 Content Creation Mistakes to Avoid',
    content: 'Slide 1: Stop making these content mistakes that kill engagement\n\nSlide 2: Mistake #1 - Posting without a strategy\nSlide 3: Mistake #2 - Ignoring your audience\'s pain points\nSlide 4: Mistake #3 - Being too salesy too often\nSlide 5: Mistake #4 - Inconsistent posting schedule\nSlide 6: Mistake #5 - Not engaging with comments\n\nSlide 7: Ready to level up your content game?',
    tone: 'Educational',
    pillar: 'Tips & Advice',
    engagement: { likes: 189, comments: 24, shares: 31 },
    createdAt: '2024-01-14',
    isFavorited: false,
    platform: ['Instagram', 'LinkedIn']
  },
  {
    id: '3',
    type: 'thread',
    title: 'My Journey from Employee to Entrepreneur',
    content: '🧵 Thread: How I went from corporate employee to successful entrepreneur in 18 months\n\n1/ It started with a simple realization: I was trading time for money, but I wanted to build something that could scale beyond my hours.\n\n2/ The first step wasn\'t quitting my job—it was developing a skill that people would pay for outside of my 9-5.\n\n3/ I spent 6 months learning digital marketing in the evenings and weekends. Every free moment was invested in my future self.',
    tone: 'Storytelling',
    pillar: 'Personal Story',
    engagement: { likes: 156, comments: 19, shares: 12 },
    createdAt: '2024-01-13',
    isFavorited: true,
    platform: ['Twitter', 'LinkedIn']
  },
  {
    id: '4',
    type: 'post',
    title: 'The ROI of Personal Branding',
    content: 'Personal branding isn\'t vanity—it\'s strategy. Here\'s the ROI I\'ve seen from building my brand:\n\n📈 3x more inbound leads\n💰 40% higher consulting rates\n🤝 Access to exclusive opportunities\n🎯 Clearer ideal client attraction\n\nYour expertise is valuable. Your personal brand makes it visible.\n\nWhat\'s holding you back from sharing your knowledge?',
    tone: 'Professional',
    pillar: 'Business Growth',
    engagement: { likes: 203, comments: 28, shares: 15 },
    createdAt: '2024-01-12',
    isFavorited: false,
    platform: ['LinkedIn']
  },
  {
    id: '5',
    type: 'post',
    title: 'Behind the Scenes: My Morning Routine',
    content: 'You asked about my morning routine, so here it is (the real, unfiltered version):\n\n5:30 AM - Wake up (sometimes 5:45 if I\'m honest)\n6:00 AM - Coffee + journal for 10 minutes\n6:15 AM - Quick workout or walk\n7:00 AM - Review priorities for the day\n7:30 AM - Deep work block (no emails/social)\n\nThe secret? It\'s not perfect, but it\'s consistent 80% of the time.\n\nWhat\'s one morning habit that changed your life?',
    tone: 'Casual',
    pillar: 'Behind the Scenes',
    engagement: { likes: 134, comments: 41, shares: 8 },
    createdAt: '2024-01-11',
    isFavorited: true,
    platform: ['Instagram', 'LinkedIn']
  },
  {
    id: '6',
    type: 'carousel',
    title: 'Content Pillars That Convert',
    content: 'Slide 1: The 5 content pillars every personal brand needs\n\nSlide 2: Pillar 1 - Educational (Teach your expertise)\nSlide 3: Pillar 2 - Inspirational (Share your journey)\nSlide 4: Pillar 3 - Behind the Scenes (Show your process)\nSlide 5: Pillar 4 - Industry Insights (Share your perspective)\nSlide 6: Pillar 5 - Community (Engage your audience)\n\nSlide 7: Which pillar resonates most with your brand?',
    tone: 'Educational',
    pillar: 'Tips & Advice',
    engagement: { likes: 278, comments: 35, shares: 22 },
    createdAt: '2024-01-10',
    isFavorited: false,
    platform: ['Instagram', 'LinkedIn']
  }
];

const contentPillars = [
  'All Pillars',
  'Thought Leadership',
  'Tips & Advice',
  'Personal Story',
  'Business Growth',
  'Behind the Scenes'
];

const toneFilters = [
  'All Tones',
  'Professional',
  'Casual',
  'Educational',
  'Storytelling'
];

const DashboardPage: React.FC<DashboardPageProps> = ({ onBackToLanding, onCarouselPreview, onProfileSettings }) => {
  const [content, setContent] = useState<ContentCard[]>(mockContent);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('All Pillars');
  const [selectedTone, setSelectedTone] = useState('All Tones');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPillar = selectedPillar === 'All Pillars' || item.pillar === selectedPillar;
    const matchesTone = selectedTone === 'All Tones' || item.tone === selectedTone;
    
    return matchesSearch && matchesPillar && matchesTone;
  });

  const handleCopyContent = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFavorite = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorited: !item.isFavorited } : item
    ));
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'carousel': return '🎠';
      case 'thread': return '🧵';
      default: return '📝';
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'carousel': return 'Carousel';
      case 'thread': return 'Thread';
      default: return 'Post';
    }
  };

  const totalEngagement = content.reduce((sum, item) => 
    sum + item.engagement.likes + item.engagement.comments + item.engagement.shares, 0
  );

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
                  onClick={onProfileSettings}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={onBackToLanding}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Home</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bebas text-white mb-4">
              Welcome Back, Sarah! 👋
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Your AI-generated content is ready. Choose what resonates with your brand and start building your authority.
            </p>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-medium-gray rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-electric-blue/20 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-electric-blue" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{content.length}</div>
                    <div className="text-sm text-gray-400">Content Ideas</div>
                  </div>
                </div>
              </div>
              <div className="bg-medium-gray rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-magenta/20 p-2 rounded-lg">
                    <Heart className="w-5 h-5 text-magenta" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {content.filter(item => item.isFavorited).length}
                    </div>
                    <div className="text-sm text-gray-400">Favorites</div>
                  </div>
                </div>
              </div>
              <div className="bg-medium-gray rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-400/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{totalEngagement}</div>
                    <div className="text-sm text-gray-400">Total Engagement</div>
                  </div>
                </div>
              </div>
              <div className="bg-medium-gray rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-400/20 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">92%</div>
                    <div className="text-sm text-gray-400">Match Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-medium-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedPillar}
                  onChange={(e) => setSelectedPillar(e.target.value)}
                  className="px-4 py-3 bg-medium-gray border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors"
                >
                  {contentPillars.map(pillar => (
                    <option key={pillar} value={pillar}>{pillar}</option>
                  ))}
                </select>

                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="px-4 py-3 bg-medium-gray border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors"
                >
                  {toneFilters.map(tone => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>

                <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300 flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Generate More</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {filteredContent.map((item, index) => (
              <div 
                key={item.id}
                className="bg-medium-gray rounded-2xl p-6 border border-gray-700 hover:border-electric-blue/50 transition-all duration-300 hover:shadow-xl hover:shadow-electric-blue/10 group"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getContentTypeIcon(item.type)}</span>
                    <div>
                      <div className="text-sm text-gray-400">{getContentTypeLabel(item.type)}</div>
                      <div className="text-xs text-gray-500">{item.pillar}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleFavorite(item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.isFavorited 
                          ? 'bg-magenta/20 text-magenta' 
                          : 'bg-charcoal text-gray-400 hover:text-magenta'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${item.isFavorited ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-lg bg-charcoal text-gray-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Title */}
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-electric-blue transition-colors">
                  {item.title}
                </h3>

                {/* Content Preview */}
                <div className="bg-charcoal rounded-lg p-4 mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                    {item.content.substring(0, 150)}...
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{item.engagement.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{item.engagement.comments}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Platform Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.platform.map(platform => (
                    <span 
                      key={platform}
                      className="px-2 py-1 bg-electric-blue/20 text-electric-blue text-xs rounded-full"
                    >
                      {platform}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                    {item.tone}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyContent(item.id, item.content)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                      copiedId === item.id
                        ? 'bg-green-500 text-white'
                        : 'bg-charcoal text-gray-300 hover:bg-electric-blue hover:text-white'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedId === item.id ? 'Copied!' : 'Copy'}</span>
                  </button>
                  
                  {item.type === 'carousel' && (
                    <button 
                      onClick={() => onCarouselPreview(item.id)}
                      className="flex items-center justify-center space-x-2 py-2 px-3 bg-magenta hover:bg-magenta/80 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredContent.length === 0 && (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="bg-medium-gray rounded-2xl p-12 border border-gray-700 max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or filters to find more content ideas.
                </p>
                <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300">
                  Generate New Content
                </button>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <div className="bg-gradient-to-r from-dark-gray to-medium-gray rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bebas text-white mb-4">
                Ready for More Content Ideas?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Generate fresh content ideas tailored to your brand and audience. 
                Our AI learns from your preferences to create even better suggestions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate More Ideas</span>
                </button>
                <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-electric-blue hover:text-electric-blue transition-colors flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download All Content</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;