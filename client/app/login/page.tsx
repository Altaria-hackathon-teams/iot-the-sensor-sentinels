'use client';

import { Navbar } from '@/components/navbar';
import { LanguageSelector } from '@/components/language-selector';
import { AnimatedTree3D } from '@/components/animated-tree-3d';
import { MiddleSectionObjects } from '@/components/middle-section-objects';
import { useLanguage } from '@/contexts/language-context';
import { translations } from '@/lib/translations';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const { language } = useLanguage();
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-20 relative overflow-hidden">
      <Navbar />
      <MiddleSectionObjects />
      
      <div className="max-w-md mx-auto px-4 py-12 relative z-10">
        <div className="mb-6 flex justify-center">
          <LanguageSelector />
        </div>

        <div className="glass p-8 rounded-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{t.welcome_back}</h1>
            <p className="text-foreground/70">{t.login_desc}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">{t.email}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.password}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : t.login_button}
            </button>
          </form>

          <div className="text-center text-sm">
            <p className="text-foreground/70">
              {t.no_account}{' '}
              <Link href="/signup" className="text-accent font-semibold hover:underline">
                {t.signup_link}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AnimatedTree3D />
    </main>
  );
}
