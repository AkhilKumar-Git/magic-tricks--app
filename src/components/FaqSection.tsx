import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How does the AI understand my industry and voice?",
    answer: "Our AI uses advanced natural language processing trained on millions of high-performing social media posts across industries. During setup, you provide information about your industry, target audience, and content goals. The AI then analyzes successful content patterns in your niche and adapts to your preferred tone and style based on examples you provide."
  },
  {
    question: "Can I customize the generated content?",
    answer: "Absolutely! Every piece of generated content serves as a starting point. You can edit, modify, or completely rewrite any content to match your exact needs. The AI learns from your edits to improve future generations. You also have full control over content length, tone, hashtags, and call-to-actions."
  },
  {
    question: "What types of content can I create?",
    answer: "ContentGen Pro supports a wide variety of content types including LinkedIn posts, Instagram captions, Twitter threads, carousel slides, video scripts, newsletter content, blog post outlines, case studies, thought leadership articles, and more. Each type is optimized for its specific platform and audience behavior."
  },
  {
    question: "How much time will this actually save me?",
    answer: "Our users report saving 10-15 hours per week on average. Instead of spending hours brainstorming, researching topics, and writing content, you can generate weeks of content in under 30 minutes. The time saved allows you to focus on engaging with your audience and growing your business."
  },
  {
    question: "Is there a limit to how much content I can generate?",
    answer: "Our plans offer generous content generation limits. The Starter plan includes 100 posts per month, Professional includes 500 posts, and Enterprise offers unlimited generation. Most users find these limits more than sufficient for their content needs. You can always upgrade if you need more."
  },
  {
    question: "What if the content doesn't match my style?",
    answer: "The AI learns and improves with use. If initial content doesn't match your style perfectly, you can provide feedback, examples of your preferred content, and make edits. The system learns from these inputs to better match your voice in future generations. Most users see significant improvement after the first week of use."
  },
  {
    question: "Can I schedule posts directly from the platform?",
    answer: "Yes! ContentGen Pro integrates with major social media platforms including LinkedIn, Instagram, Twitter, Facebook, and more. You can schedule posts directly from our dashboard, manage your content calendar, and track performance metrics all in one place."
  },
  {
    question: "Do you offer team collaboration features?",
    answer: "Yes, our Professional and Enterprise plans include team collaboration features. You can add team members, assign roles and permissions, share content templates, maintain brand consistency across team members, and review content before publishing."
  },
  {
    question: "Is my data secure and private?",
    answer: "Data security is our top priority. We use enterprise-grade encryption, never share your content with third parties, and comply with GDPR and other privacy regulations. Your content ideas, generated posts, and business information remain completely private and secure."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We offer comprehensive support including live chat, email support, video tutorials, webinars, and a detailed knowledge base. Professional and Enterprise plans include priority support with dedicated account managers and one-on-one onboarding sessions."
  }
];

const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-charcoal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bebas text-white mb-6">
            Frequently Asked
            <span className="bg-gradient-to-r from-electric-blue to-magenta bg-clip-text text-transparent">
              {' '}Questions
            </span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Get answers to common questions about ContentGen Pro and how it can transform your content strategy.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-medium-gray rounded-xl border border-gray-700 overflow-hidden hover:border-electric-blue/50 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-dark-gray/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openFaq === index ? (
                    <Minus className="w-5 h-5 text-electric-blue" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openFaq === index && (
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-700 pt-6">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="bg-gradient-to-r from-dark-gray to-medium-gray rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bebas text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Our support team is here to help you succeed with ContentGen Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300">
                Start Free Trial
              </button>
              <button className="border border-gray-600 text-gray-300 px-6 py-3 rounded-full font-semibold hover:border-electric-blue hover:text-electric-blue transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;