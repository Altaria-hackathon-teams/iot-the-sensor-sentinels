'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { FileText, Download, ExternalLink, BookOpen, Video, Code, Zap, Share2 } from 'lucide-react';

export default function Resources() {
  const resources = [
    { title: 'IoT Sensor Setup Guide', type: 'PDF', size: '2.4 MB', category: 'Setup', downloads: 1250 },
    { title: 'Microloan Application Process', type: 'PDF', size: '1.8 MB', category: 'Finance', downloads: 980 },
    { title: 'Sustainable Farming Practices', type: 'PDF', size: '3.2 MB', category: 'Farming', downloads: 1540 },
    { title: 'Weather API Documentation', type: 'Documentation', size: '-', category: 'API', downloads: 450 },
    { title: 'Crop Database Reference', type: 'Database', size: '-', category: 'Data', downloads: 320 },
    { title: 'Community Forum', type: 'Link', size: '-', category: 'Community', downloads: 2100 },
  ];

  const videoTutorials = [
    { title: 'Getting Started with Dashboard', duration: '12:45', views: 5200 },
    { title: 'Installing IoT Sensors in Your Farm', duration: '18:30', views: 4100 },
    { title: 'Reading and Interpreting Soil Data', duration: '15:20', views: 3800 },
    { title: 'Applying for Microloans via Sakhi-Agri', duration: '10:15', views: 2900 },
  ];

  const categories = ['All', 'PDF Guides', 'Video Tutorials', 'API Documentation', 'Tools & Templates', 'Community'];

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Resources
            </h1>
            <p className="text-foreground/70">Articles, guides, documentation, and tools for farmers</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  i === 0
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'glass hover:bg-white/20 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Main Resources List */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold mt-8 mb-6">Document Library</h2>
            {resources.map((resource, i) => (
              <div key={i} className="glass p-6 rounded-xl flex items-center justify-between hover:shadow-lg hover:shadow-accent/20 transition-all group">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-lg flex items-center justify-center text-accent text-lg">
                    {resource.type === 'PDF' ? '📄' : resource.type === 'Documentation' ? '📖' : resource.type === 'Database' ? '🗄️' : '🔗'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-accent transition-colors">{resource.title}</h3>
                    <div className="flex gap-4 text-sm text-foreground/60">
                      <span>{resource.type}</span>
                      {resource.size !== '-' && <span>{resource.size}</span>}
                      <span>📥 {resource.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-accent/10 rounded-lg transition-colors group-hover:scale-110">
                    {resource.type === 'Link' ? (
                      <ExternalLink size={20} className="text-accent" />
                    ) : (
                      <Download size={20} className="text-accent" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
                    <Share2 size={20} className="text-accent" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Video Tutorials Section */}
          <div className="space-y-6 mt-12">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Video className="w-6 h-6" />
              Video Tutorials
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {videoTutorials.map((video, i) => (
                <div key={i} className="glass p-6 rounded-2xl space-y-4 hover:-translate-y-2 transition-all cursor-pointer group">
                  <div className="w-full h-32 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-lg flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                    ▶️
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-accent transition-colors">{video.title}</h3>
                    <div className="flex justify-between text-sm text-foreground/60 mt-2">
                      <span>⏱️ {video.duration}</span>
                      <span>👁️ {video.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-6 mt-12">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Quick Links
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'API Reference', icon: '🔧', desc: 'Complete API documentation for developers' },
                { title: 'FAQ', icon: '❓', desc: 'Frequently asked questions and answers' },
                { title: 'Troubleshooting', icon: '🛠️', desc: 'Common issues and solutions' },
              ].map((link, i) => (
                <div key={i} className="glass p-6 rounded-2xl space-y-3 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="text-3xl group-hover:scale-125 transition-transform">{link.icon}</div>
                  <h3 className="font-semibold group-hover:text-accent transition-colors">{link.title}</h3>
                  <p className="text-sm text-foreground/70">{link.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Download Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Total Resources', value: '120+', icon: '📚' },
              { label: 'Total Downloads', value: '45K+', icon: '📥' },
              { label: 'Video Hours', value: '150+', icon: '🎬' },
              { label: 'Active Contributors', value: '50+', icon: '✍️' },
            ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center space-y-3">
                <div className="text-3xl">{stat.icon}</div>
                <p className="text-sm text-foreground/70">{stat.label}</p>
                <p className="text-2xl font-bold text-accent">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Contribute Section */}
          <div className="glass p-12 rounded-2xl text-center space-y-6 mt-12">
            <h2 className="text-3xl font-bold">Share Your Knowledge</h2>
            <p className="text-lg text-foreground/70">Have valuable content or guides to share? Contribute to our resource library and help other farmers learn.</p>
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/40 transition-all">
              Contribute Now
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
