import { Zap, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-gray border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-electric-blue to-magenta p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bebas text-white">
                ContentGen Pro
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Transform your personal brand with AI-powered content that drives real business results.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Product</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Features
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Pricing
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Templates
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Integrations
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                API
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Company</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                About Us
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Blog
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Careers
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Press
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Partners
              </a>
            </div>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Support</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Contact Us
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Community
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Status
              </a>
              <a href="#" className="block text-gray-400 hover:text-electric-blue transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>

        {/* Pre-Footer CTA */}
        <div className="py-12 border-t border-gray-700">
          <div className="bg-gradient-to-r from-dark-gray to-medium-gray rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bebas text-white mb-4">
              Ready to Transform Your Content Strategy?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who've accelerated their personal brand growth with AI-powered content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300">
                Start Free Trial
              </button>
              <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-electric-blue hover:text-electric-blue transition-colors">
                Schedule Demo
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              ✓ No Credit Card Required  ✓ 7-Day Free Trial  ✓ Cancel Anytime
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 ContentGen Pro. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-electric-blue text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-electric-blue text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-electric-blue text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;