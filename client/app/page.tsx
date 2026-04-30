'use client';

import { Navbar } from '@/components/navbar';
import { HeroAnimatedObjects } from '@/components/hero-animated-objects';
import { Footer } from '@/components/footer';
import { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Smartphone, BarChart3, Zap, Users, TrendingUp, Check } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const yieldData = [
  { month: 'Jan', yield: 2400, target: 2210 },
  { month: 'Feb', yield: 1398, target: 2290 },
  { month: 'Mar', yield: 9800, target: 2000 },
  { month: 'Apr', yield: 3908, target: 2108 },
  { month: 'May', yield: 4800, target: 2280 },
  { month: 'Jun', yield: 3800, target: 2500 },
];

const regionData = [
  { region: 'North', value: 4000 },
  { region: 'South', value: 3000 },
  { region: 'East', value: 2000 },
  { region: 'West', value: 2780 },
];

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(scrollPercent);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-background dark:bg-background transition-colors">
      <Navbar />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-green-400 to-green-600 z-40" style={{ width: `${scrollProgress * 100}%` }} />

      {/* SECTION 1: Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute inset-0 opacity-30 dark:opacity-20">
            {mounted && [...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <HeroAnimatedObjects />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 fade-up">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-emerald-400 bg-clip-text text-transparent leading-tight text-balance">
            Empowering Farmers
          </h1>
          
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto text-balance leading-relaxed">
            Using IoT sensors, machine learning, and digital finance to revolutionize agricultural practices and provide microloans to underserved farming communities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 flex items-center gap-2 group"
            >
              Join Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 border-2 border-accent text-accent font-semibold rounded-full hover:bg-accent/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Problem Statement */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-balance">
            The Challenge We Address
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Limited Access to Microloans',
                description: 'Women farmers struggle to access financial support due to lack of credit history and collateral.',
                icon: '💰',
              },
              {
                title: 'Inadequate Data Collection',
                description: 'Without real-time data, farmers cannot make informed decisions about crop health and soil conditions.',
                icon: '📊',
              },
              {
                title: 'Low Agricultural Productivity',
                description: 'Without modern tech guidance, yields remain low and farmers face significant losses.',
                icon: '🌾',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="glass dark:glass-dark p-8 rounded-2xl hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">{item.title}</h3>
                <p className="text-foreground/70 text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: How It Works Timeline */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-balance">
            How Sakhi-Agri Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'IoT Sensors', desc: 'Real-time data collection from soil and environment', icon: '📡' },
              { step: 2, title: 'ML Analysis', desc: 'Advanced algorithms analyze crop health patterns', icon: '🧠' },
              { step: 3, title: 'AI Guidance', desc: 'Personalized recommendations for farmers', icon: '💡' },
              { step: 4, title: 'Credit Score', desc: 'Blockchain-tracked credit for microloans', icon: '🔐' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="glass dark:glass-dark p-8 rounded-2xl text-center space-y-4 h-full transform hover:-translate-y-2 transition-all">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold mx-auto glow-green">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/3 -right-4 text-4xl text-accent animate-pulse">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Key Features */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-balance">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="w-10 h-10" />,
                title: 'Real-time Dashboard',
                description: 'Monitor soil moisture, pH, temperature, and humidity from your phone.',
              },
              {
                icon: <BarChart3 className="w-10 h-10" />,
                title: 'Crop Analytics',
                description: 'AI-powered predictions for crop health and yield optimization.',
              },
              {
                icon: <Zap className="w-10 h-10" />,
                title: 'Smart Alerts',
                description: 'Instant notifications for critical soil and weather conditions.',
              },
              {
                icon: <Users className="w-10 h-10" />,
                title: 'Community Hub',
                description: 'Connect with other farmers and share best practices.',
              },
              {
                icon: <TrendingUp className="w-10 h-10" />,
                title: 'Credit Scoring',
                description: 'Build credit history through data and transaction history.',
              },
              {
                icon: <Leaf className="w-10 h-10" />,
                title: 'Sustainability',
                description: 'Optimize resources and reduce environmental impact.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass dark:glass-dark p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-lg flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Yield Analytics */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-balance">
            Crop Yield Performance
          </h2>

          <div className="glass dark:glass-dark p-12 rounded-3xl">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="month" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #10b981', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="yield" stroke="#10b981" fillOpacity={1} fill="url(#colorYield)" />
                <Area type="monotone" dataKey="target" stroke="#60a5fa" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SECTION 6: Regional Distribution */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-balance">
            Community Reach by Region
          </h2>

          <div className="glass dark:glass-dark p-12 rounded-3xl">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="region" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #10b981', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#10b981" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SECTION 7: Tech Stack */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-balance">
            Built with Enterprise Tech
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {['IoT Sensors', 'TensorFlow', 'Blockchain', 'React', 'Next.js', 'PostgreSQL', 'AWS', 'ML Pipeline', 'Edge Computing', 'Kubernetes', 'Apache Kafka', 'GraphQL'].map((tech, i) => (
              <div
                key={i}
                className="glass dark:glass-dark p-8 rounded-lg text-center hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1"
              >
                <p className="font-semibold text-foreground/80 group-hover:text-accent transition-colors">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: Impact Statistics */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-500/10 via-green-600/10 to-emerald-500/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-balance">
            Our Impact
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Farmers Impacted', value: '5,000+', icon: '👩‍🌾', change: '+32% YoY' },
              { label: 'Microloans Issued', value: '$2M+', icon: '💳', change: '+45% YoY' },
              { label: 'Avg Yield Increase', value: '35%', icon: '📈', change: '+8% this quarter' },
              { label: 'Communities', value: '50+', icon: '🌍', change: '+12 new regions' },
            ].map((stat, i) => (
              <div key={i} className="glass dark:glass-dark p-8 rounded-2xl text-center space-y-4 hover:-translate-y-2 transition-all">
                <div className="text-5xl">{stat.icon}</div>
                <div className="text-4xl font-bold text-accent">{stat.value}</div>
                <p className="text-foreground/70 font-semibold">{stat.label}</p>
                <p className="text-green-500 text-sm">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: Success Stories */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-balance">
            Success Stories
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'Organic Farmer',
                story: 'Using Sakhi-Agri, I increased my tomato yield by 45% and finally qualified for a microloan!',
                avatar: '👩',
              },
              {
                name: 'Anita Patel',
                role: 'Rice Farmer',
                story: 'The real-time alerts saved my rice crop from disease. Sakhi-Agri is a game-changer.',
                avatar: '👩',
              },
              {
                name: 'Maya Singh',
                role: 'Vegetable Farmer',
                story: 'Connected with buyers through the marketplace. My income doubled in just 6 months!',
                avatar: '👩',
              },
            ].map((story, i) => (
              <div key={i} className="glass dark:glass-dark p-8 rounded-2xl space-y-4 hover:-translate-y-2 transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{story.avatar}</div>
                  <div>
                    <p className="font-bold text-lg">{story.name}</p>
                    <p className="text-accent text-sm">{story.role}</p>
                  </div>
                </div>
                <p className="text-foreground/70 italic leading-relaxed">"{story.story}"</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: Benefits List */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-balance">
            Why Choose Sakhi-Agri
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Proven Track Record', desc: 'Trusted by thousands of farmers across 50+ communities' },
              { title: '24/7 Support', desc: 'Dedicated support team available round the clock' },
              { title: 'Easy to Use', desc: 'No technical background needed. Simple, intuitive interface' },
              { title: 'Secure & Private', desc: 'Your data is encrypted and protected with military-grade security' },
              { title: 'Affordable', desc: 'Subscription plans starting at just ₹99/month' },
              { title: 'Growing Marketplace', desc: 'Connect directly with buyers and increase your income' },
            ].map((benefit, i) => (
              <div key={i} className="glass dark:glass-dark p-8 rounded-2xl flex gap-4 hover:-translate-y-2 transition-all">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-foreground/70">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* SECTION 12: Call to Action */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-500/10 via-green-600/10 to-emerald-500/10">
        <div className="max-w-4xl mx-auto glass dark:glass-dark p-16 rounded-3xl text-center space-y-8">
          <h2 className="text-5xl font-bold text-balance">Ready to Transform Your Farming?</h2>
          <p className="text-xl text-foreground/70 leading-relaxed">
            Join thousands of women farmers already using Sakhi-Agri to improve yields, access credit, and build prosperous futures. Start your free trial today with no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/signup"
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 flex items-center gap-2 justify-center"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="px-10 py-4 border-2 border-accent text-accent font-semibold rounded-full hover:bg-accent/10 transition-all duration-300"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
