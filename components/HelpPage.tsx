import React, { useState } from 'react';
import { HelpCircle, MessageSquare, BookOpen, FileText, ChevronDown, Search } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: 1,
      question: 'How do I create a new invoice?',
      answer:
        'Go to the Invoices tab, click "New Invoice", select a client, add items with their technical details, and save. You can then generate a PDF or send it directly to the client.',
    },
    {
      id: 2,
      question: 'Can I customize the invoice template?',
      answer:
        'Yes! Go to Settings and you can customize your company logo, bank details, terms and conditions, and other invoice details that will appear on all future invoices.',
    },
    {
      id: 3,
      question: 'How do I export invoices?',
      answer:
        'Each invoice can be exported as PDF. Click the PDF button on any invoice. You can also bulk export from the Reports section.',
    },
    {
      id: 4,
      question: 'How do I manage my team members?',
      answer:
        'Go to Team Management (admin only) to add, remove, or update team member roles. You can assign SUPER_ADMIN, ADMIN, or STAFF roles with different permissions.',
    },
    {
      id: 5,
      question: 'What are the subscription plans?',
      answer:
        'We offer BASIC (up to 50 invoices/month), PRO (unlimited invoices + advanced reports), and ENTERPRISE (with API access and custom integrations).',
    },
    {
      id: 6,
      question: 'How secure is my data?',
      answer:
        'All data is encrypted in transit and at rest. We use enterprise-grade security with 99.9% uptime SLA and automatic daily backups.',
    },
  ];

  const documentation = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of setting up your Metalex SaaS account',
      icon: '🚀',
    },
    {
      title: 'Invoice Management',
      description: 'Complete guide to creating, editing, and managing invoices',
      icon: '📄',
    },
    {
      title: 'Client Management',
      description: 'How to add clients and manage their information',
      icon: '👥',
    },
    {
      title: 'Reports & Analytics',
      description: 'Understanding your business metrics and generating reports',
      icon: '📊',
    },
    {
      title: 'PDF Generation',
      description: 'Tips for generating professional PDFs and customizing them',
      icon: '📋',
    },
    {
      title: 'API Documentation',
      description: 'For developers: Integrate Metalex with your systems',
      icon: '⚙️',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full px-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-8 rounded-lg">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <HelpCircle className="w-8 h-8" />
          Help & Support
        </h1>
        <p className="text-orange-100">Get answers to your questions and learn how to use Metalex</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <a href="#" className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-lg transition text-center">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Documentation</h3>
          <p className="text-sm text-slate-600">Read our guides and tutorials</p>
        </a>
        <a href="#" className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-lg transition text-center">
          <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Contact Support</h3>
          <p className="text-sm text-slate-600">Reach our support team</p>
        </a>
        <a href="#" className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-lg transition text-center">
          <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Video Tutorials</h3>
          <p className="text-sm text-slate-600">Watch how-to videos</p>
        </a>
        <a href="#" className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-lg transition text-center">
          <HelpCircle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Status Page</h3>
          <p className="text-sm text-slate-600">Check system status</p>
        </a>
      </div>

      {/* Documentation */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-6">Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentation.map((doc, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-lg hover:border-orange-300 transition cursor-pointer"
            >
              <div className="text-4xl mb-3">{doc.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{doc.title}</h3>
              <p className="text-sm text-slate-600">{doc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <h3 className="font-bold text-slate-900 text-left">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-600 transition-transform ${
                      expandedFaq === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">No FAQs found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-lg">
        <h2 className="text-2xl font-black mb-4">Still need help?</h2>
        <p className="mb-6 text-slate-300">
          Our support team is available 24/7 to help you. Get a response within 2 hours.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="mailto:support@metalex.com" className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition">
            Email Support
          </a>
          <a href="#" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition">
            Live Chat
          </a>
          <a href="#" className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition">
            Schedule Call
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
