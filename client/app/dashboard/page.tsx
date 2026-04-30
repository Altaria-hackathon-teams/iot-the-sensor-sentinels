'use client';

import { Navbar } from '@/components/navbar';
import { DashboardAnimatedObjects } from '@/components/dashboard-animated-objects';
import { Footer } from '@/components/footer';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Droplets, Thermometer, Wind, AlertCircle, TrendingUp, Cloud, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const cropHealthData = [
  { day: 'Mon', health: 85 },
  { day: 'Tue', health: 87 },
  { day: 'Wed', health: 86 },
  { day: 'Thu', health: 89 },
  { day: 'Fri', health: 91 },
  { day: 'Sat', health: 90 },
  { day: 'Sun', health: 92 },
];

const weeklyData = [
  { week: 'Week 1', yield: 2200, optimal: 2500 },
  { week: 'Week 2', yield: 2400, optimal: 2500 },
  { week: 'Week 3', yield: 2600, optimal: 2500 },
  { week: 'Week 4', yield: 2800, optimal: 2500 },
];

const fieldData = [
  { name: 'Field A', value: 35 },
  { name: 'Field B', value: 30 },
  { name: 'Field C', value: 25 },
  { name: 'Field D', value: 10 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function Dashboard() {
  const [realTimeData, setRealTimeData] = useState({
    soil: 65,
    temp: 26,
    humidity: 72,
    distance: 20,
    flow: 2.5,
    pH: 7.2,
    phosphorus: 45,
    nitrogen: 65
  });

  const [trendData, setTrendData] = useState([
    { time: '00:00:00', moisture: 65, temp: 26 },
  ]);

  const realTimeDataRef = useRef(realTimeData);
  useEffect(() => {
    realTimeDataRef.current = realTimeData;
  }, [realTimeData]);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = new WebSocket('ws://localhost:5002/ws');
    let dummyInterval: NodeJS.Timeout;
    let graphInterval: NodeJS.Timeout;

    socket.onopen = () => {
      console.log('✅ Connected to AI Sensor Server');
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        // Handle both message structures
        const newData = payload.live_data || (payload.type === 'SENSOR_UPDATE' ? payload.data : null);
        
        if (newData) {
          setRealTimeData(prev => ({
            ...prev,
            soil: newData.Soil_Moisture ?? newData.soil ?? prev.soil,
            temp: newData.Soil_Temperature ?? newData.temp ?? prev.temp,
            humidity: newData.Humidity ?? newData.humidity ?? prev.humidity,
            pH: newData.pH ?? prev.pH,
            phosphorus: newData.phosphorus ?? prev.phosphorus,
            nitrogen: newData.nitrogen ?? prev.nitrogen
          }));
        }
      } catch (err) {
        console.error('❌ Error parsing WebSocket message:', err);
      }
    };

    socket.onerror = () => {
      console.warn('⚠️ WebSocket failed. Starting local dummy mode for demo...');
    };

    socket.onclose = () => {
      console.warn('⚠️ WebSocket closed. Starting local dummy mode...');
    };

    // Update realTimeData for simulated sensors (temp, pH, etc.)
    dummyInterval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        temp: Math.floor(Math.random() * (30 - 20) + 20),
        humidity: Math.floor(Math.random() * (90 - 30) + 30),
        pH: parseFloat((Math.random() * (8 - 6) + 6).toFixed(1)),
        phosphorus: Math.floor(Math.random() * (60 - 30) + 30),
        nitrogen: Math.floor(Math.random() * (70 - 40) + 40),
      }));
    }, 3000);

    // Update the graph smoothly every 2 seconds with the current state values
    graphInterval = setInterval(() => {
      setTrendData(prev => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        return [...prev.slice(-30), {
          time: timeStr,
          moisture: realTimeDataRef.current.soil,
          temp: realTimeDataRef.current.temp
        }];
      });
    }, 2000);

    return () => {
      socket.close();
      clearInterval(dummyInterval);
      clearInterval(graphInterval);
    };
  }, []);

  const sensors = [
    {
      label: 'Soil Moisture',
      value: `${realTimeData.soil}%`,
      icon: <Droplets className="w-6 h-6" />,
      status: realTimeData.soil < 30 ? 'Low' : 'Optimal',
      color: 'from-blue-400 to-blue-600',
    },
    {
      label: 'pH Level',
      value: realTimeData.pH,
      icon: <Wind className="w-6 h-6" />,
      status: realTimeData.pH < 6.5 ? 'Acidic' : realTimeData.pH > 7.5 ? 'Alkaline' : 'Normal',
      color: 'from-green-400 to-green-600',
    },
    {
      label: 'Temperature',
      value: `${realTimeData.temp}°C`,
      icon: <Thermometer className="w-6 h-6" />,
      status: 'Ideal',
      color: 'from-orange-400 to-orange-600',
    },
    {
      label: 'Phosphorus',
      value: `${realTimeData.phosphorus} ppm`,
      icon: <Zap className="w-6 h-6" />,
      status: 'Good',
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      label: 'Water Level',
      value: realTimeData.distance === -1 ? 'Error' : `${realTimeData.distance} cm`,
      icon: <Wind className="w-6 h-6" />,
      status: realTimeData.distance > 30 ? 'Low' : 'Good',
      color: 'from-indigo-400 to-indigo-600',
    },
  ];

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      <DashboardAnimatedObjects />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-foreground/70">Monitor your IoT sensors and crop health in real-time</p>
          </div>

          {/* Sensor Cards */}
          <div className="grid md:grid-cols-5 gap-6">
            {sensors.map((sensor, i) => (
              <div key={i} className="glass p-6 rounded-2xl space-y-4 hover:shadow-lg hover:shadow-accent/20 transition-all">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-br ${sensor.color} rounded-lg flex items-center justify-center text-white`}>
                    {sensor.icon}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${sensor.status === 'Low' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                    {sensor.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-foreground/70 mb-1">{sensor.label}</p>
                  <p className="text-2xl font-bold">{sensor.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sensor Readings Chart */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">Soil Moisture Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                  <XAxis dataKey="time" stroke="rgba(0, 0, 0, 0.5)" />
                  <YAxis stroke="rgba(0, 0, 0, 0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #10b981' }} />
                  <Area type="monotone" dataKey="moisture" stroke="#10b981" fill="url(#colorMoisture)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Crop Health Chart */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">Crop Health Index</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cropHealthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                  <XAxis dataKey="day" stroke="rgba(0, 0, 0, 0.5)" />
                  <YAxis stroke="rgba(0, 0, 0, 0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #10b981' }} />
                  <Bar dataKey="health" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Yield Comparison */}
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6">Weekly Yield Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="week" stroke="rgba(0, 0, 0, 0.5)" />
                <YAxis stroke="rgba(0, 0, 0, 0.5)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #10b981' }} />
                <Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="optimal" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Field Distribution */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">Field Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={fieldData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fieldData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Weather Summary */}
            <div className="space-y-4">
              <div className="glass p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <Cloud className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-foreground/70">Weather Forecast</p>
                    <p className="font-semibold">Partly Cloudy, 24°C</p>
                  </div>
                </div>
              </div>
              <div className="glass p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-sm text-foreground/70">Yield Growth</p>
                    <p className="font-semibold">+12% This Month</p>
                  </div>
                </div>
              </div>
              <div className="glass p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="text-sm text-foreground/70">Energy Usage</p>
                    <p className="font-semibold">152 kWh (Optimal)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="glass p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold">Alerts & Recommendations</h2>
            </div>
            <div className="space-y-3">
              {[
                { type: 'info', message: 'Water irrigation recommended in 2 hours' },
                { type: 'warning', message: 'Nitrogen levels lower than optimal' },
                { type: 'success', message: 'Crop health index at 92% - excellent!' },
              ].map((alert, i) => (
                <div key={i} className={`p-4 rounded-lg ${alert.type === 'success' ? 'bg-green-50 border border-green-200' : alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'}`}>
                  <p className={alert.type === 'success' ? 'text-green-800' : alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'}>
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Sensor Uptime', value: '99.8%', icon: '📡' },
              { label: 'Data Accuracy', value: '98.5%', icon: '✓' },
              { label: 'Alerts Generated', value: '24', icon: '🔔' },
            ].map((metric, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center space-y-3">
                <div className="text-3xl">{metric.icon}</div>
                <p className="text-sm text-foreground/70">{metric.label}</p>
                <p className="text-2xl font-bold text-accent">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
