'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Droplets, Thermometer, Wind, Zap, Activity, AlertTriangle, Settings, Power } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sensors() {
  const [realTimeData, setRealTimeData] = useState({
    soil: 65,
    temp: 26,
    pH: 7.2,
    humidity: 72,
    nitrogen: 65,
    phosphorus: 45,
    distance: 20,
    flow: 2.5
  });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');
    let dummyInterval: NodeJS.Timeout;

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'SENSOR_UPDATE') {
          setRealTimeData(prev => ({
            ...prev,
            soil: payload.data.soil ?? prev.soil,
            temp: payload.data.temp ?? prev.temp,
            pH: payload.data.pH ?? prev.pH,
            humidity: payload.data.humidity ?? prev.humidity,
            phosphorus: payload.data.phosphorus ?? prev.phosphorus,
            nitrogen: payload.data.nitrogen ?? prev.nitrogen,
            distance: payload.data.distance ?? prev.distance,
            flow: payload.data.flow ?? prev.flow,
          }));
        }
      } catch (err) {
        console.error('❌ WS Error:', err);
      }
    };

    socket.onerror = () => {
      console.warn('⚠️ WebSocket failed to connect.');
    };

    // We ALWAYS run dummy mode for temp, pH, humidity, etc., because Arduino doesn't have these sensors!
    // BUT we NEVER randomize distance (Water Level) or soil, those are STRICTLY hardware.
    dummyInterval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        temp: Math.floor(Math.random() * (30 - 20) + 20),
        pH: parseFloat((Math.random() * (8 - 6) + 6).toFixed(1)),
        humidity: Math.floor(Math.random() * (90 - 30) + 30),
        nitrogen: Math.floor(Math.random() * (70 - 40) + 40),
        phosphorus: Math.floor(Math.random() * (60 - 30) + 30),
      }));
    }, 3000);

    return () => { socket.close(); clearInterval(dummyInterval); };
  }, []);

  const sensors = [
    {
      name: 'Soil Moisture Sensor',
      field: 'Field A - North',
      reading: `${realTimeData.soil}%`,
      icon: <Droplets className="w-8 h-8" />,
      color: 'from-blue-400 to-blue-600',
      status: 'Active',
      battery: '87%',
      signal: 'Strong',
    },
    {
      name: 'Temperature Sensor',
      field: 'Field A - North',
      reading: `${realTimeData.temp}°C`,
      icon: <Thermometer className="w-8 h-8" />,
      color: 'from-orange-400 to-orange-600',
      status: 'Active',
      battery: '92%',
      signal: 'Strong',
    },
    {
      name: 'pH Sensor',
      field: 'Field B - South',
      reading: realTimeData.pH,
      icon: <Wind className="w-8 h-8" />,
      color: 'from-green-400 to-green-600',
      status: 'Active',
      battery: '78%',
      signal: 'Strong',
    },
    {
      name: 'Humidity Sensor',
      field: 'Field B - South',
      reading: `${realTimeData.humidity}%`,
      icon: <Zap className="w-8 h-8" />,
      color: 'from-cyan-400 to-cyan-600',
      status: 'Active',
      battery: '85%',
      signal: 'Strong',
    },
    {
      name: 'Nitrogen Level Sensor',
      field: 'Field A - North',
      reading: `${realTimeData.nitrogen} ppm`,
      icon: <Activity className="w-8 h-8" />,
      color: 'from-purple-400 to-purple-600',
      status: 'Active',
      battery: '81%',
      signal: 'Strong',
    },
    {
      name: 'Phosphorus Sensor',
      field: 'Field B - South',
      reading: `${realTimeData.phosphorus} ppm`,
      icon: <Zap className="w-8 h-8" />,
      color: 'from-indigo-400 to-indigo-600',
      status: 'Active',
      battery: '88%',
      signal: 'Strong',
    },
    {
      name: 'Ultrasonic Sensor (Distance)',
      field: 'Main Water Tank',
      reading: realTimeData.distance === -1 ? 'Error' : `${realTimeData.distance} cm`,
      icon: <Wind className="w-8 h-8" />,
      color: 'from-slate-400 to-slate-600',
      status: 'Active',
      battery: '95%',
      signal: 'Strong',
    },
  ];

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              IoT Sensors
            </h1>
            <p className="text-foreground/70">Monitor all your connected sensors and field data</p>
          </div>

          {/* Sensor Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {sensors.map((sensor, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover:shadow-lg hover:shadow-accent/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${sensor.color} rounded-lg flex items-center justify-center text-white`}>
                    {sensor.icon}
                  </div>
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {sensor.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{sensor.name}</h3>
                <p className="text-sm text-foreground/70 mb-4">{sensor.field}</p>
                <div className="text-3xl font-bold text-accent mb-6">{sensor.reading}</div>
                
                {/* Sensor Details */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60 flex items-center gap-2">
                      <Power className="w-4 h-4" />
                      Battery
                    </span>
                    <span className="font-semibold">{sensor.battery}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Signal
                    </span>
                    <span className="font-semibold">{sensor.signal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sensor Status Overview */}
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6">System Status</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: 'Total Sensors', value: '6', icon: '📡' },
                { label: 'Active Sensors', value: '6', icon: '✓' },
                { label: 'Battery Average', value: '85.2%', icon: '🔋' },
                { label: 'Last Sync', value: '2 min ago', icon: '🔄' },
              ].map((status, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-2xl">{status.icon}</div>
                  <p className="text-sm text-foreground/70">{status.label}</p>
                  <p className="text-xl font-bold text-accent">{status.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance & Settings */}
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Sensor Maintenance
            </h2>
            <div className="space-y-4">
              {[
                { task: 'Replace batteries', sensors: 'pH Sensor (Field B)', dueDate: 'In 2 weeks', status: 'info' },
                { task: 'Calibrate sensors', sensors: 'All moisture sensors', dueDate: 'In 1 month', status: 'info' },
                { task: 'Check signal strength', sensors: 'All sensors', dueDate: 'Monthly', status: 'success' },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-lg border-l-4 ${
                  item.status === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{item.task}</p>
                      <p className="text-sm text-foreground/70">{item.sensors}</p>
                    </div>
                    <span className="text-sm font-semibold">{item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              Common Issues & Solutions
            </h2>
            <div className="space-y-4">
              {[
                { issue: 'Sensor not connecting', solution: 'Check WiFi signal and restart sensor' },
                { issue: 'Battery draining quickly', solution: 'Adjust update frequency in settings' },
                { issue: 'Inaccurate readings', solution: 'Calibrate sensor or check placement' },
              ].map((item, i) => (
                <div key={i} className="p-4 border border-border rounded-lg">
                  <p className="font-semibold mb-2">{item.issue}</p>
                  <p className="text-sm text-foreground/70">→ {item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
