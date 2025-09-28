import { useState } from 'react';
import { ArrowLeft, Download, Zap, ChevronLeft, ChevronRight, Grid3x3 as Grid3X3, Sparkles } from 'lucide-react';

interface CarouselPreviewPageProps {
  carouselId: string | null;
  onBackToDashboard: () => void;
  onBackToLanding: () => void;
  onProfileSettings: () => void;
}

interface CarouselSlide {
  id: number;
  title: string;
  content: string;
  backgroundColor: string;
  textColor: string;
}

// Mock carousel data - in real app this would come from props/API
const mockCarousels: Record<string, { title: string; slides: CarouselSlide[] }> = {
  '2': {
    title: '5 Content Creation Mistakes to Avoid',
    slides: [
      {
        id: 1,
        title: 'Stop Making These Content Mistakes',
        content: 'That Kill Engagement',
        backgroundColor: 'from-electric-blue to-magenta',
        textColor: 'text-white'
      },
      {
        id: 2,
        title: 'Mistake #1',
        content: 'Posting without a strategy\n\nRandom posts = Random results\n\nPlan your content pillars and stick to them.',
        backgroundColor: 'from-red-500 to-red-600',
        textColor: 'text-white'
      },
      {
        id: 3,
        title: 'Mistake #2',
        content: 'Ignoring your audience\'s pain points\n\nYour content should solve problems, not create them.\n\nAlways ask: "What\'s in it for them?"',
        backgroundColor: 'from-orange-500 to-orange-600',
        textColor: 'text-white'
      },
      {
        id: 4,
        title: 'Mistake #3',
        content: 'Being too salesy too often\n\nThe 80/20 rule:\n80% value, 20% promotion\n\nBuild trust before you sell.',
        backgroundColor: 'from-yellow-500 to-yellow-600',
        textColor: 'text-white'
      },
      {
        id: 5,
        title: 'Mistake #4',
        content: 'Inconsistent posting schedule\n\nConsistency beats perfection\n\nShow up regularly, even if it\'s not perfect.',
        backgroundColor: 'from-green-500 to-green-600',
        textColor: 'text-white'
      },
      {
        id: 6,
        title: 'Mistake #5',
        content: 'Not engaging with comments\n\nSocial media is SOCIAL\n\nRespond to comments within 24 hours.',
        backgroundColor: 'from-blue-500 to-blue-600',
        textColor: 'text-white'
      },
      {
        id: 7,
        title: 'Ready to Level Up?',
        content: 'Your content game starts now\n\nFollow for more tips\n💡 Save this for later\n🔄 Share with your network',
        backgroundColor: 'from-purple-500 to-purple-600',
        textColor: 'text-white'
      }
    ]
  },
  '6': {
    title: 'Content Pillars That Convert',
    slides: [
      {
        id: 1,
        title: 'The 5 Content Pillars',
        content: 'Every Personal Brand Needs',
        backgroundColor: 'from-electric-blue to-magenta',
        textColor: 'text-white'
      },
      {
        id: 2,
        title: 'Pillar 1: Educational',
        content: 'Teach your expertise\n\n• Share industry insights\n• Break down complex topics\n• Provide actionable tips',
        backgroundColor: 'from-indigo-500 to-indigo-600',
        textColor: 'text-white'
      },
      {
        id: 3,
        title: 'Pillar 2: Inspirational',
        content: 'Share your journey\n\n• Personal success stories\n• Lessons learned\n• Motivational insights',
        backgroundColor: 'from-pink-500 to-pink-600',
        textColor: 'text-white'
      },
      {
        id: 4,
        title: 'Pillar 3: Behind the Scenes',
        content: 'Show your process\n\n• Daily routines\n• Work environment\n• Team interactions',
        backgroundColor: 'from-teal-500 to-teal-600',
        textColor: 'text-white'
      },
      {
        id: 5,
        title: 'Pillar 4: Industry Insights',
        content: 'Share your perspective\n\n• Market trends\n• Industry predictions\n• Expert opinions',
        backgroundColor: 'from-amber-500 to-amber-600',
        textColor: 'text-white'
      },
      {
        id: 6,
        title: 'Pillar 5: Community',
        content: 'Engage your audience\n\n• Ask questions\n• Share user content\n• Start conversations',
        backgroundColor: 'from-emerald-500 to-emerald-600',
        textColor: 'text-white'
      },
      {
        id: 7,
        title: 'Which Pillar Resonates?',
        content: 'Most with your brand?\n\nComment below 👇\n\nFollow for more content tips\n💾 Save this carousel',
        backgroundColor: 'from-violet-500 to-violet-600',
        textColor: 'text-white'
      }
    ]
  }
};

const CarouselPreviewPage: React.FC<CarouselPreviewPageProps> = ({ 
  carouselId, 
  onBackToDashboard, 
  onBackToLanding,
  onProfileSettings
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [customization, setCustomization] = useState({
    backgroundColor: 'default',
    textStyle: 'default'
  });

  // Get carousel data
  const carousel = carouselId ? mockCarousels[carouselId] : null;
  
  if (!carousel) {
    return (
      <div className="min-h-screen bg-charcoal text-white font-manrope flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bebas text-white mb-4">Carousel Not Found</h1>
          <button
            onClick={onBackToDashboard}
            className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const slides = carousel.slides;
  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setShowThumbnails(false);
  };

  const handleDownload = (format: 'png' | 'pdf') => {
    // Placeholder for download functionality
    console.log(`Downloading carousel as ${format.toUpperCase()}`);
    // In real app, this would trigger file generation and download
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
                  onClick={onProfileSettings}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Profile
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
            <h1 className="text-4xl sm:text-5xl font-bebas text-white mb-4">
              Carousel Preview
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              {carousel.title}
            </p>
            <p className="text-gray-400">
              {totalSlides} slides • Ready to download and share
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Preview Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Carousel Display */}
              <div className="relative bg-medium-gray rounded-2xl p-8 border border-gray-700 animate-fade-in-up">
                {/* Slide Counter */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-400">
                    Slide {currentSlide + 1} of {totalSlides}
                  </div>
                  <button
                    onClick={() => setShowThumbnails(!showThumbnails)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-electric-blue transition-colors"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span>Thumbnails</span>
                  </button>
                </div>

                {/* Main Slide */}
                <div className="relative">
                  <div className={`aspect-square bg-gradient-to-br ${slides[currentSlide].backgroundColor} rounded-xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden`}>
                    {/* Slide Content */}
                    <div className="z-10 space-y-4">
                      <h2 className="text-2xl sm:text-3xl font-bebas text-white leading-tight">
                        {slides[currentSlide].title}
                      </h2>
                      <div className="text-lg text-white/90 leading-relaxed whitespace-pre-line">
                        {slides[currentSlide].content}
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Slide Indicators */}
                <div className="flex justify-center space-x-2 mt-6">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-electric-blue scale-125'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail View */}
              {showThumbnails && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 animate-fade-in-up">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(index)}
                      className={`aspect-square bg-gradient-to-br ${slide.backgroundColor} rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 ${
                        index === currentSlide ? 'ring-2 ring-electric-blue' : ''
                      }`}
                    >
                      <div className="text-xs text-white font-semibold mb-1">
                        {slide.title}
                      </div>
                      <div className="text-xs text-white/80 line-clamp-2">
                        {slide.content.split('\n')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Download Options */}
              <div className="bg-medium-gray rounded-2xl p-6 border border-gray-700 animate-fade-in-up">
                <h3 className="text-xl font-bebas text-white mb-4">Download Options</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => handleDownload('png')}
                    className="w-full flex items-center justify-center space-x-2 bg-electric-blue hover:bg-electric-blue/80 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PNG Files</span>
                  </button>
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="w-full flex items-center justify-center space-x-2 bg-magenta hover:bg-magenta/80 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  High-resolution files optimized for social media platforms
                </p>
              </div>

              {/* Customization Options */}
              <div className="bg-medium-gray rounded-2xl p-6 border border-gray-700 animate-fade-in-up">
                <h3 className="text-xl font-bebas text-white mb-4">Quick Customization</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Background Style</label>
                    <select
                      value={customization.backgroundColor}
                      onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-full bg-charcoal border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    >
                      <option value="default">Default Gradients</option>
                      <option value="solid">Solid Colors</option>
                      <option value="minimal">Minimal White</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Text Style</label>
                    <select
                      value={customization.textStyle}
                      onChange={(e) => setCustomization(prev => ({ ...prev, textStyle: e.target.value }))}
                      className="w-full bg-charcoal border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    >
                      <option value="default">Bold & Modern</option>
                      <option value="elegant">Elegant & Clean</option>
                      <option value="playful">Playful & Fun</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Changes will be applied to downloaded files
                </p>
              </div>

              {/* Stats */}
              <div className="bg-medium-gray rounded-2xl p-6 border border-gray-700 animate-fade-in-up">
                <h3 className="text-xl font-bebas text-white mb-4">Content Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Slides</span>
                    <span className="text-white font-semibold">{totalSlides}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Estimated Views</span>
                    <span className="text-electric-blue font-semibold">2.5K+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Engagement Rate</span>
                    <span className="text-magenta font-semibold">8.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Best Platform</span>
                    <span className="text-white font-semibold">LinkedIn</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 animate-fade-in-up">
                <button className="w-full bg-gradient-to-r from-electric-blue to-magenta text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Another Carousel</span>
                </button>
                <button
                  onClick={onBackToDashboard}
                  className="w-full border border-gray-600 text-gray-300 py-3 px-4 rounded-lg font-semibold hover:border-electric-blue hover:text-electric-blue transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselPreviewPage;