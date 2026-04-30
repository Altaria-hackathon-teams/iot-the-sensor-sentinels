'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 dark:bg-secondary/20 py-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold glow-green">
                S
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Sakhi-Agri
              </span>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Empowering farmers through technology, data, and digital finance.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {[
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Sensors', href: '/sensors' },
                { name: 'AI Insights', href: '/ai-insights' },
                { name: 'Marketplace', href: '/marketplace' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-foreground/60 hover:text-accent text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { name: 'About', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'Contact', href: '#' },
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-foreground/60 hover:text-accent text-sm transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                { name: 'Farmers Hub', href: '/farmers-hub' },
                { name: 'Resources', href: '/resources' },
                { name: 'Documentation', href: '#' },
                { name: 'FAQ', href: '#' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-foreground/60 hover:text-accent text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms of Service', href: '#' },
                { name: 'Security', href: '#' },
                { name: 'Compliance', href: '#' },
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-foreground/60 hover:text-accent text-sm transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-border pt-8 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-foreground/60 text-sm">
              © 2025 Sakhi-Agri. All rights reserved.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Mail, href: '#' },
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    className="w-9 h-9 rounded-lg bg-secondary dark:bg-secondary/50 flex items-center justify-center text-foreground/60 hover:text-accent hover:bg-accent/10 transition-all"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
