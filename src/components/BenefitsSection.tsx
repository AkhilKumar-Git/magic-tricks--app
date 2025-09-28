import { Clock, Target, TrendingUp, Zap, Users, Shield } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: "Save 10+ Hours Weekly",
    description: "Stop spending endless hours brainstorming content. Our AI generates high-quality posts in seconds, freeing up your time for what matters most.",
    color: "text-electric-blue"
  },
  {
    icon: Target,
    title: "Laser-Focused Content",
    description: "Create content that resonates with your target audience. Our AI understands your niche and generates posts that drive engagement and conversions.",
    color: "text-magenta"
  },
  {
    icon: TrendingUp,
    title: "3x Engagement Growth",
    description: "See measurable results with content proven to increase likes, comments, and shares. Our users report 3x higher engagement rates on average.",
    color: "text-yellow-400"
  },
  {
    icon: Zap,
    title: "Instant Content Creation",
    description: "Generate months of content in minutes. From captions to carousel posts, get everything you need to maintain a consistent posting schedule.",
    color: "text-electric-blue"
  },
  {
    icon: Users,
    title: "Build Authentic Authority",
    description: "Establish yourself as a thought leader in your industry. Our content templates help you share valuable insights that position you as an expert.",
    color: "text-magenta"
  },
  {
    icon: Shield,
    title: "Brand-Consistent Voice",
    description: "Maintain your unique voice across all platforms. Our AI learns your style and tone to ensure every post sounds authentically you.",
    color: "text-green-400"
  }
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-20 bg-dark-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bebas text-white mb-6">
            Why Professionals Choose
            <span className="bg-gradient-to-r from-electric-blue to-magenta bg-clip-text text-transparent">
              {' '}ContentGen Pro
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your personal brand with AI-powered content that drives results. 
            Join thousands of professionals who've accelerated their growth with our platform.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index} 
                className="group bg-medium-gray rounded-2xl p-8 hover:bg-gradient-to-br hover:from-medium-gray hover:to-charcoal transition-all duration-300 hover:shadow-xl hover:shadow-electric-blue/10 animate-fade-in-up border border-gray-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-charcoal group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-electric-blue transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up">
          <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300">
            Start Your Free Trial
          </button>
          <p className="text-gray-400 mt-4">Join 10,000+ professionals already growing their brands</p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;