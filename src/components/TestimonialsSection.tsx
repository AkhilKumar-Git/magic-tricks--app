import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    title: "Marketing Director",
    company: "TechFlow Solutions",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "ContentGen Pro has completely transformed my LinkedIn presence. I've gone from posting sporadically to consistent daily content that actually engages my audience. My connection requests have increased by 300%.",
    rating: 5,
    results: "300% more connection requests"
  },
  {
    name: "Marcus Thompson",
    title: "Sales Manager",
    company: "Growth Dynamics",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "I was spending 2-3 hours every week just thinking about what to post. Now I generate a week's worth of content in 15 minutes. The quality is outstanding and perfectly matches my voice.",
    rating: 5,
    results: "Saves 10+ hours weekly"
  },
  {
    name: "Dr. Emily Rodriguez",
    title: "Healthcare Consultant",
    company: "MedTech Advisors",
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "The AI understands my industry perfectly. Every post feels authentic to my expertise in healthcare. I've attracted 3 new clients directly from my LinkedIn content in the past month.",
    rating: 5,
    results: "3 new clients acquired"
  },
  {
    name: "Alex Park",
    title: "Startup Founder",
    company: "InnovateLab",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "As a busy founder, content creation was always on the back burner. ContentGen Pro makes it so easy that I actually enjoy posting now. My personal brand has never been stronger.",
    rating: 5,
    results: "10x more post engagement"
  },
  {
    name: "Jennifer Walsh",
    title: "Business Coach",
    company: "Success Strategies",
    image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "The content variety is incredible. From thought leadership to behind-the-scenes posts, it helps me show different sides of my expertise. My audience engagement has tripled.",
    rating: 5,
    results: "3x audience engagement"
  },
  {
    name: "David Kim",
    title: "Financial Advisor",
    company: "WealthPath Group",
    image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "Complex financial topics made simple and engaging. The AI helps me break down complicated concepts into digestible content that my clients actually want to read and share.",
    rating: 5,
    results: "50% more client referrals"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-dark-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bebas text-white mb-6">
            Success Stories From
            <span className="bg-gradient-to-r from-electric-blue to-magenta bg-clip-text text-transparent">
              {' '}Real Users
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who've accelerated their personal brand growth 
            and seen measurable business results with ContentGen Pro.
          </p>
          
          {/* Overall Stats */}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-electric-blue mb-1">4.9/5</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-1">10K+</div>
              <div className="text-sm text-gray-400">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">1M+</div>
              <div className="text-sm text-gray-400">Posts Generated</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-medium-gray rounded-2xl p-8 hover:bg-gradient-to-br hover:from-medium-gray hover:to-charcoal transition-all duration-300 hover:shadow-xl hover:shadow-electric-blue/10 animate-fade-in-up border border-gray-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-6">
                <Quote className="w-8 h-8 text-electric-blue opacity-50" />
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-300 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Results */}
              <div className="bg-charcoal rounded-lg p-3 mb-6">
                <div className="text-sm text-gray-400 mb-1">Key Result:</div>
                <div className="text-electric-blue font-semibold">{testimonial.results}</div>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.title}</div>
                  <div className="text-gray-500 text-xs">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center animate-fade-in-up">
          <div className="bg-medium-gray rounded-2xl p-8 inline-block">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">98%</div>
                <div className="text-sm text-gray-400">User Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">500%</div>
                <div className="text-sm text-gray-400">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">15min</div>
                <div className="text-sm text-gray-400">Weekly Time Investment</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">3x</div>
                <div className="text-sm text-gray-400">Engagement Increase</div>
              </div>
            </div>
          </div>
          
          <button className="mt-8 bg-gradient-to-r from-electric-blue to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300">
            Join These Success Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;