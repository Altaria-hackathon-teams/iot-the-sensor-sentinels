'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BookOpen, Play, Award, Users, MessageSquare, TrendingUp, Star, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const communityGrowthData = [
  { month: 'Jan', members: 1200, active: 800 },
  { month: 'Feb', members: 1450, active: 950 },
  { month: 'Mar', members: 1800, active: 1200 },
  { month: 'Apr', members: 2100, active: 1450 },
  { month: 'May', members: 2500, active: 1800 },
  { month: 'Jun', members: 3100, active: 2200 },
];

export default function FarmersHub() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Farmers Hub
            </h1>
            <p className="text-foreground/70">Training, guides, and resources for women farmers</p>
          </div>

          {/* Main Three Sections */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: 'Learning Guides',
                description: 'Comprehensive guides on soil health, crop rotation, and sustainable farming practices.',
                items: ['Soil Management', 'Crop Selection', 'Water Conservation', 'Pest Management'],
              },
              {
                icon: <Play className="w-8 h-8" />,
                title: 'Video Tutorials',
                description: 'Step-by-step video tutorials from expert farmers and agronomists.',
                items: ['Setting Up Sensors', 'Using Dashboard', 'Reading Analytics', 'Getting Loans'],
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Certifications',
                description: 'Earn recognized certificates to boost your credibility and market value.',
                items: ['Basic Farming', 'Advanced IoT', 'Business Skills', 'Sustainability'],
              },
            ].map((section, i) => (
              <div key={i} className="glass p-8 rounded-2xl space-y-4 hover:shadow-lg hover:shadow-accent/20 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white">
                  {section.icon}
                </div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-sm text-foreground/70">{section.description}</p>
                <ul className="space-y-2 pt-4 border-t border-border">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-sm text-foreground/70 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Community Growth Section */}
          <div className="space-y-8 pt-8">
            <h2 className="text-3xl font-bold">Community Growth & Engagement</h2>
            <div className="glass p-8 rounded-2xl">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={communityGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                  <XAxis dataKey="month" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #10b981', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="members" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                  <Line type="monotone" dataKey="active" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Featured Expert Trainers */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Meet Our Expert Trainers</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Dr. Rajesh Patel', expertise: 'Soil Science & Nutrition', experience: '15+ years', rating: 4.9 },
                { name: 'Ramaben Singh', expertise: 'Organic Farming Methods', experience: '20+ years', rating: 4.8 },
                { name: 'Deepa Verma', expertise: 'IoT & Smart Farming', experience: '12+ years', rating: 4.95 },
              ].map((trainer, i) => (
                <div key={i} className="glass p-8 rounded-2xl space-y-4 hover:-translate-y-2 transition-all">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                    {trainer.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{trainer.name}</h3>
                    <p className="text-sm text-accent font-semibold">{trainer.expertise}</p>
                  </div>
                  <p className="text-sm text-foreground/70">{trainer.experience}</p>
                  <div className="flex items-center gap-1 pt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm font-semibold ml-2">{trainer.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workshops & Events */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Upcoming Workshops & Events</h2>
            <div className="space-y-4">
              {[
                { title: 'Advanced Soil Testing & Analysis', date: 'Next Week', location: 'Online', seats: '45 available', instructor: 'Dr. Rajesh Patel' },
                { title: 'IoT Sensors: Setup & Maintenance', date: 'In 2 weeks', location: 'Mumbai Region', seats: '30 available', instructor: 'Deepa Verma' },
                { title: 'Organic Pest Management', date: 'In 3 weeks', location: 'Online', seats: '60 available', instructor: 'Ramaben Singh' },
              ].map((workshop, i) => (
                <div key={i} className="glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-lg transition-all">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{workshop.title}</h3>
                    <p className="text-sm text-foreground/70">by {workshop.instructor}</p>
                    <div className="flex gap-4 text-sm text-foreground/60">
                      <span>📅 {workshop.date}</span>
                      <span>📍 {workshop.location}</span>
                      <span>👥 {workshop.seats}</span>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion Forum Highlights */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Community Discussion</h2>
            <div className="glass p-8 rounded-2xl">
              <div className="space-y-4">
                {[
                  { topic: 'Best practices for monsoon farming', replies: 45, views: 1200, helpful: 89 },
                  { topic: 'Managing pest attacks naturally', replies: 38, views: 980, helpful: 76 },
                  { topic: 'Maximizing yield with limited water', replies: 52, views: 1450, helpful: 94 },
                ].map((thread, i) => (
                  <div key={i} className="p-4 border border-border rounded-lg hover:bg-secondary/30 transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground hover:text-accent transition-colors">{thread.topic}</h4>
                        <div className="flex gap-4 text-sm text-foreground/60 mt-2">
                          <span>💬 {thread.replies} replies</span>
                          <span>👁️ {thread.views} views</span>
                          <span>👍 {thread.helpful}% helpful</span>
                        </div>
                      </div>
                      <MessageSquare className="w-5 h-5 text-accent flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Success Stats */}
          <div className="grid md:grid-cols-4 gap-6 pt-8">
            {[
              { label: 'Active Members', value: '3,100+', icon: '👩‍🌾' },
              { label: 'Courses Completed', value: '8,500+', icon: '📚' },
              { label: 'Avg Rating', value: '4.8/5', icon: '⭐' },
              { label: 'Jobs Placed', value: '1,200+', icon: '💼' },
            ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center space-y-3">
                <div className="text-3xl">{stat.icon}</div>
                <p className="text-sm text-foreground/70">{stat.label}</p>
                <p className="text-2xl font-bold text-accent">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="glass p-12 rounded-2xl text-center space-y-6 mt-12">
            <h2 className="text-3xl font-bold">Join Our Growing Community Today</h2>
            <p className="text-lg text-foreground/70">Get access to expert training, connect with thousands of farmers, and grow your skills and income.</p>
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/40 transition-all">
              Become a Member
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
