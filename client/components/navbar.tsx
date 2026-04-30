'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, ShoppingCart } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/auth-context';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleCartUpdate = (e: Event) => {
      const event = e as CustomEvent;
      setCartCount(event.detail?.count || 0);
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sensors', href: '/sensors' },
    { label: 'AI Insights', href: '/ai-insights' },
    { label: 'Farmers Hub', href: '/farmers-hub' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Resources', href: '/resources' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass dark:glass-dark border-b border-accent/20 dark:border-accent/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold glow-green">
              S
            </div>
            <span className="font-bold text-lg hidden sm:inline bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Sakhi-Agri
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-green-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex gap-3 items-center">
            <Link
              href="/cart"
              className="p-2 rounded-lg hover:bg-secondary dark:hover:bg-secondary/80 transition-colors duration-300 relative"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary dark:hover:bg-secondary/80 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {mounted && (
                theme === 'dark' ? (
                  <Sun size={20} className="text-yellow-500" />
                ) : (
                  <Moon size={20} className="text-slate-600" />
                )
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition-all duration-300 uppercase"
                  title={user?.name}
                >
                  {user?.name?.charAt(0)}
                </div>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-foreground/70 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:shadow-lg hover:shadow-green-500/40 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-secondary dark:hover:bg-secondary/80 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2 animate-in fade-in duration-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary dark:hover:bg-secondary/80 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 space-y-2 border-t border-border">
              <Link
                href="/cart"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary dark:hover:bg-secondary/80 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart size={16} />
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <button
                onClick={toggleTheme}
                className="w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary dark:hover:bg-secondary/80 rounded-lg transition-colors flex items-center gap-2"
              >
                {mounted && (
                  theme === 'dark' ? (
                    <>
                      <Sun size={16} className="text-yellow-500" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon size={16} className="text-slate-600" />
                      Dark Mode
                    </>
                  )
                )}
              </button>
              {isAuthenticated ? (
                <div className="px-4 py-2 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold uppercase">
                      {user?.name?.charAt(0)}
                    </div>
                    <span className="font-medium text-foreground">{user?.name}</span>
                  </div>
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-left py-2 text-sm font-medium text-red-500 hover:bg-secondary dark:hover:bg-secondary/80 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary dark:hover:bg-secondary/80 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
