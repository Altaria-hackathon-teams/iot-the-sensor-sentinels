'use client';

import { Navbar } from '@/components/navbar';
import { MarketplaceAnimatedObjects } from '@/components/marketplace-animated-objects';
import { Footer } from '@/components/footer';
import { ShoppingCart, Star, Filter, Search, Plus, MapPin, Clock, Truck, Shield, User, Mail, Phone, Check, Store, Users, TrendingUp, Package } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

// To-Buy Products Data (Equipment, Supplies, Seeds, etc.)
const buyProducts = [
  { id: 1, name: 'Premium Soil Sensor Kit', price: 149, category: 'Equipment', rating: 4.8, reviews: 245, image: '📡', stock: 50 },
  { id: 2, name: 'Organic Fertilizer (25kg)', price: 45, category: 'Supplies', rating: 4.6, reviews: 180, image: '🌱', stock: 100 },
  { id: 3, name: 'High-Yield Tomato Seeds', price: 8, category: 'Seeds', rating: 4.9, reviews: 320, image: '🌾', stock: 200 },
  { id: 4, name: 'Irrigation Drip System', price: 199, category: 'Equipment', rating: 4.7, reviews: 156, image: '💧', stock: 25 },
  { id: 5, name: 'Pest Control Spray', price: 25, category: 'Supplies', rating: 4.5, reviews: 92, image: '🧪', stock: 150 },
  { id: 6, name: 'Wheat Seeds (Premium)', price: 12, category: 'Seeds', rating: 4.8, reviews: 201, image: '🌾', stock: 300 },
  { id: 7, name: 'NPK Fertilizer Blend', price: 35, category: 'Supplies', rating: 4.7, reviews: 145, image: '🧫', stock: 80 },
  { id: 8, name: 'Temperature Sensor', price: 79, category: 'Equipment', rating: 4.9, reviews: 98, image: '🌡️', stock: 60 },
  { id: 9, name: 'Smart Greenhouse Controller', price: 299, category: 'Equipment', rating: 4.8, reviews: 167, image: '🏠', stock: 30 },
  { id: 10, name: 'Automated Watering System', price: 189, category: 'Equipment', rating: 4.6, reviews: 134, image: '🚿', stock: 40 },
  { id: 11, name: 'Soil pH Meter Pro', price: 89, category: 'Equipment', rating: 4.7, reviews: 278, image: '⚗️', stock: 75 },
  { id: 12, name: 'Crop Monitoring Drone', price: 1299, category: 'Equipment', rating: 4.9, reviews: 89, image: '🚁', stock: 15 },
];

// To-Sell Products Data (Vegetables, Fruits from Farmers)
const sellProducts = [
  {
    id: 101, name: 'Organic Tomatoes', price: 45, unit: 'kg', category: 'Vegetables', quality: 'Organic',
    farmer: 'Green Valley Farms', location: 'Nashik, Maharashtra', rating: 4.9, reviews: 234, image: '🍅',
    stock: 150, harvestDate: '2024-01-15', delivery: true, certification: ['Organic', 'FSSAI']
  },
  {
    id: 102, name: 'Fresh Cauliflower', price: 30, unit: 'kg', category: 'Vegetables', quality: 'Grade A',
    farmer: 'Singh Farms', location: 'Punjab', rating: 4.7, reviews: 167, image: '🥦',
    stock: 200, harvestDate: '2024-01-14', delivery: true, certification: ['FSSAI']
  },
  {
    id: 103, name: 'Premium Potatoes', price: 25, unit: 'kg', category: 'Vegetables', quality: 'Premium',
    farmer: 'Himalayan Growers', location: 'Himachal Pradesh', rating: 4.8, reviews: 289, image: '🥔',
    stock: 500, harvestDate: '2024-01-12', delivery: true, certification: ['FSSAI', 'Quality Certified']
  },
  {
    id: 104, name: 'Organic Spinach', price: 40, unit: 'kg', category: 'Vegetables', quality: 'Organic',
    farmer: 'Organic Harvest', location: 'Bengaluru, Karnataka', rating: 4.9, reviews: 178, image: '🍃',
    stock: 80, harvestDate: '2024-01-15', delivery: true, certification: ['Organic', 'FSSAI', 'No Pesticides']
  },
  {
    id: 201, name: 'Alphonso Mangoes', price: 120, unit: 'kg', category: 'Fruits', quality: 'Premium',
    farmer: 'Konkan Mango Farms', location: 'Ratnagiri, Maharashtra', rating: 4.9, reviews: 456, image: '🥭',
    stock: 100, harvestDate: '2024-01-10', delivery: true, certification: ['GI Tag', 'Premium Quality']
  },
  {
    id: 202, name: 'Nagpur Oranges', price: 60, unit: 'kg', category: 'Fruits', quality: 'Grade A',
    farmer: 'Citrus Valley', location: 'Nagpur, Maharashtra', rating: 4.7, reviews: 289, image: '🍊',
    stock: 300, harvestDate: '2024-01-13', delivery: true, certification: ['GI Tag', 'FSSAI']
  },
  {
    id: 203, name: 'Fresh Bananas', price: 35, unit: 'dozen', category: 'Fruits', quality: 'Regular',
    farmer: 'Tropical Fruits Co.', location: 'Kerala', rating: 4.6, reviews: 167, image: '🍌',
    stock: 150, harvestDate: '2024-01-14', delivery: true, certification: ['FSSAI']
  },
  {
    id: 204, name: 'Organic Apples', price: 180, unit: 'kg', category: 'Fruits', quality: 'Organic',
    farmer: 'Himalayan Orchards', location: 'Kashmir', rating: 4.8, reviews: 234, image: '🍎',
    stock: 120, harvestDate: '2024-01-11', delivery: true, certification: ['Organic', 'FSSAI', 'No Chemicals']
  },
  {
    id: 105, name: 'Fresh Carrots', price: 35, unit: 'kg', category: 'Vegetables', quality: 'Grade A',
    farmer: 'Roots & Shoots', location: 'Gujarat', rating: 4.7, reviews: 156, image: '🥕',
    stock: 180, harvestDate: '2024-01-13', delivery: true, certification: ['FSSAI']
  },
  {
    id: 106, name: 'Organic Beetroot', price: 50, unit: 'kg', category: 'Vegetables', quality: 'Organic',
    farmer: 'Earth Roots Organic', location: 'Maharashtra', rating: 4.8, reviews: 134, image: '🍠',
    stock: 90, harvestDate: '2024-01-14', delivery: true, certification: ['Organic', 'FSSAI']
  },
  {
    id: 205, name: 'Fresh Grapes', price: 80, unit: 'kg', category: 'Fruits', quality: 'Premium',
    farmer: 'Vineyard Estates', location: 'Nashik, Maharashtra', rating: 4.7, reviews: 189, image: '🍇',
    stock: 200, harvestDate: '2024-01-12', delivery: true, certification: ['FSSAI', 'Export Quality']
  },
  {
    id: 206, name: 'Pomegranates', price: 90, unit: 'kg', category: 'Fruits', quality: 'Grade A',
    farmer: 'Ruby Fruits', location: 'Maharashtra', rating: 4.8, reviews: 167, image: '🍐',
    stock: 150, harvestDate: '2024-01-13', delivery: true, certification: ['FSSAI']
  },
];

const buyCategories = ['All', 'Equipment', 'Supplies', 'Seeds', 'Tools', 'Irrigation'];
const sellCategories = ['All', 'Vegetables', 'Fruits', 'Organic', 'Premium'];

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedBuyCategory, setSelectedBuyCategory] = useState('All');
  const [selectedSellCategory, setSelectedSellCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [farmerFormData, setFarmerFormData] = useState({
    name: '', farmName: '', location: '', phone: '', email: '',
    products: '', experience: '', certification: ''
  });

  const filteredBuyProducts = selectedBuyCategory === 'All'
    ? buyProducts
    : buyProducts.filter(p => p.category === selectedBuyCategory);

  const filteredSellProducts = selectedSellCategory === 'All'
    ? sellProducts
    : sellProducts.filter(item => {
      if (selectedSellCategory === 'Organic') return item.quality === 'Organic';
      if (selectedSellCategory === 'Premium') return item.quality === 'Premium';
      return item.category === selectedSellCategory;
    });

  const addToCart = (product: any) => {
    setCartCount(cartCount + 1);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: cartCount + 1 } }));
  };

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Farmer registration:', farmerFormData);
    alert('Registration submitted successfully! We will contact you soon.');
    setFarmerFormData({
      name: '', farmName: '', location: '', phone: '', email: '',
      products: '', experience: '', certification: ''
    });
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />
      <MarketplaceAnimatedObjects />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Agricultural Marketplace
            </h1>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Your one-stop platform for all farming needs. Buy equipment and supplies, or sell your fresh produce directly to customers.
            </p>

            {/* Main Tabs */}
            <div className="flex justify-center">
              <div className="glass p-2 rounded-2xl flex gap-2">
                <button
                  onClick={() => setActiveTab('buy')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-3 ${activeTab === 'buy'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/40'
                      : 'hover:bg-secondary'
                    }`}
                >
                  <ShoppingCart size={24} />
                  Buy Equipment & Supplies
                </button>
                <button
                  onClick={() => setActiveTab('sell')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-3 ${activeTab === 'sell'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/40'
                      : 'hover:bg-secondary'
                    }`}
                >
                  <Store size={24} />
                  Sell Fresh Produce
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Package, label: 'Products Available', value: '5000+', color: 'text-blue-500' },
              { icon: Users, label: 'Active Farmers', value: '250+', color: 'text-green-500' },
              { icon: TrendingUp, label: 'Daily Orders', value: '1200+', color: 'text-orange-500' },
              { icon: Shield, label: 'Verified Sellers', value: '98%', color: 'text-purple-500' },
            ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center space-y-3">
                <stat.icon className={`mx-auto ${stat.color}`} size={32} />
                <div className="text-2xl font-bold text-accent">{stat.value}</div>
                <div className="text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* TO-BUY SECTION */}
          {activeTab === 'buy' && (
            <div className="space-y-12">
              {/* Buy Section Header */}
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                  Buy Farming Equipment & Supplies
                </h2>
                <p className="text-foreground/70 text-lg">
                  Everything you need for modern farming - from seeds to smart technology
                </p>
              </div>

              {/* Search and Filter */}
              <div className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-2 px-4 bg-secondary/30 rounded-lg">
                  <Search className="text-foreground/50" size={20} />
                  <input type="text" placeholder="Search equipment, supplies, seeds..." className="flex-1 py-2 bg-transparent outline-none" />
                </div>
                <button className="flex items-center gap-2 px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-all">
                  <Filter size={20} />
                  Filters
                </button>
              </div>

              {/* Buy Categories */}
              <div className="flex flex-wrap gap-2 justify-center">
                {buyCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedBuyCategory(cat)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedBuyCategory === cat
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/40'
                        : 'glass hover:bg-secondary hover:shadow-lg'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Buy Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBuyProducts.map(product => (
                  <div key={product.id} className="glass p-6 rounded-2xl hover:shadow-xl hover:shadow-green-500/20 transition-all group border border-border/50">
                    <div className="h-32 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/20 rounded-lg mb-4 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                      {product.image}
                    </div>

                    <h3 className="font-semibold mb-2 line-clamp-2 text-lg">{product.name}</h3>
                    <p className="text-xs text-foreground/60 mb-3 uppercase tracking-wide font-semibold">{product.category}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-foreground/30'}
                        />
                      ))}
                      <span className="text-xs text-foreground/60 ml-1">({product.reviews})</span>
                    </div>

                    {/* Stock Info */}
                    <div className="flex items-center gap-2 text-sm text-foreground/70 mb-4">
                      <div className={`flex items-center gap-1 ${product.stock < 30 ? 'text-red-500' : 'text-green-500'}`}>
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-2xl font-bold text-accent">${product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:scale-110 hover:shadow-lg hover:shadow-green-500/40 transition-all duration-300"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buy Section Features */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Truck, title: 'Free Shipping', desc: 'On orders above $200' },
                  { icon: Shield, title: 'Quality Guarantee', desc: '30-day return policy' },
                  { icon: Clock, title: 'Fast Delivery', desc: '2-3 business days' },
                ].map((feature, i) => (
                  <div key={i} className="glass p-6 rounded-2xl text-center space-y-3">
                    <feature.icon className="mx-auto text-green-500" size={32} />
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-foreground/70">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TO-SELL SECTION */}
          {activeTab === 'sell' && (
            <div className="space-y-12">
              {/* Sell Section Header */}
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                  Sell Your Fresh Produce
                </h2>
                <p className="text-foreground/70 text-lg">
                  Connect directly with customers and get the best prices for your farm-fresh vegetables and fruits
                </p>
              </div>

              {/* Sell Categories */}
              <div className="flex flex-wrap gap-2 justify-center">
                {sellCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedSellCategory(cat)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedSellCategory === cat
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/40'
                        : 'glass hover:bg-secondary hover:shadow-lg'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sell Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSellProducts.map(item => (
                  <div key={item.id} className="glass p-6 rounded-2xl hover:shadow-xl hover:shadow-orange-500/20 transition-all group border border-border/50">
                    <div className="h-32 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg mb-4 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                      {item.image}
                    </div>

                    {/* Quality Badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 ${item.quality === 'Organic' ? 'bg-green-100 text-green-700' :
                        item.quality === 'Premium' ? 'bg-yellow-100 text-yellow-700' :
                          item.quality === 'Grade A' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                      }`}>
                      {item.quality}
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>

                    {/* Farmer & Location */}
                    <div className="flex items-center gap-2 text-sm text-foreground/70 mb-3">
                      <MapPin size={14} />
                      <span>{item.farmer}</span>
                      <span>•</span>
                      <span>{item.location}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-foreground/30'}
                        />
                      ))}
                      <span className="text-xs text-foreground/60 ml-1">({item.reviews})</span>
                    </div>

                    {/* Harvest Info */}
                    <div className="flex items-center gap-4 text-xs text-foreground/70 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Harvested: {new Date(item.harvestDate).toLocaleDateString()}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${item.stock < 50 ? 'text-red-500' : 'text-green-500'}`}>
                        <span>Stock: {item.stock} {item.unit}</span>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.certification.map((cert, i) => (
                        <span key={i} className="px-2 py-1 bg-secondary text-xs rounded-md">
                          {cert}
                        </span>
                      ))}
                      {item.delivery && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md flex items-center gap-1">
                          <Truck size={10} />
                          Delivery
                        </span>
                      )}
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div>
                        <span className="text-2xl font-bold text-accent">₹{item.price}</span>
                        <span className="text-foreground/70 text-sm ml-1">/{item.unit}</span>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:scale-110 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Farmer Registration Section */}
              <div className="glass p-8 rounded-2xl space-y-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">Want to Sell Your Produce?</h3>
                  <p className="text-foreground/70">Join our platform as a farmer and reach thousands of customers</p>
                </div>

                <form onSubmit={handleFarmerSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Full Name</label>
                      <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg">
                        <User size={20} className="text-foreground/50" />
                        <input
                          type="text"
                          placeholder="Enter your name"
                          className="flex-1 bg-transparent outline-none"
                          value={farmerFormData.name}
                          onChange={(e) => setFarmerFormData({ ...farmerFormData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Farm Name</label>
                      <input
                        type="text"
                        placeholder="Enter farm name"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-transparent outline-none"
                        value={farmerFormData.farmName}
                        onChange={(e) => setFarmerFormData({ ...farmerFormData, farmName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Location</label>
                    <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg">
                      <MapPin size={20} className="text-foreground/50" />
                      <input
                        type="text"
                        placeholder="Enter your location"
                        className="flex-1 bg-transparent outline-none"
                        value={farmerFormData.location}
                        onChange={(e) => setFarmerFormData({ ...farmerFormData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Phone Number</label>
                      <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg">
                        <Phone size={20} className="text-foreground/50" />
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          className="flex-1 bg-transparent outline-none"
                          value={farmerFormData.phone}
                          onChange={(e) => setFarmerFormData({ ...farmerFormData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Email</label>
                      <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg">
                        <Mail size={20} className="text-foreground/50" />
                        <input
                          type="email"
                          placeholder="Enter email address"
                          className="flex-1 bg-transparent outline-none"
                          value={farmerFormData.email}
                          onChange={(e) => setFarmerFormData({ ...farmerFormData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Products You Grow</label>
                    <textarea
                      placeholder="List the vegetables and fruits you grow..."
                      className="w-full px-3 py-2 border border-border rounded-lg bg-transparent outline-none min-h-[80px]"
                      value={farmerFormData.products}
                      onChange={(e) => setFarmerFormData({ ...farmerFormData, products: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Farming Experience</label>
                      <select
                        className="w-full px-3 py-2 border border-border rounded-lg bg-transparent outline-none"
                        value={farmerFormData.experience}
                        onChange={(e) => setFarmerFormData({ ...farmerFormData, experience: e.target.value })}
                        required
                      >
                        <option value="">Select experience</option>
                        <option value="0-2">0-2 years</option>
                        <option value="2-5">2-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Certifications</label>
                      <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg">
                        <Shield size={20} className="text-foreground/50" />
                        <input
                          type="text"
                          placeholder="Organic, FSSAI, etc."
                          className="flex-1 bg-transparent outline-none"
                          value={farmerFormData.certification}
                          onChange={(e) => setFarmerFormData({ ...farmerFormData, certification: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Register as Farmer
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Final Call to Action */}
          <div className="text-center space-y-6 py-12">
            <h2 className="text-4xl font-bold">Ready to Transform Your Farming Business?</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Join thousands of successful farmers and buyers who trust our marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/cart" className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-green-500/40 transition-all text-lg">
                View Cart ({cartCount} items)
              </Link>
              <button className="px-8 py-4 glass border border-border rounded-full font-semibold hover:shadow-2xl transition-all text-lg">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}