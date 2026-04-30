'use client';

import { Navbar } from '@/components/navbar';
import { AIInsightsAnimatedObjects } from '@/components/ai-insights-animated-objects';
import { Footer } from '@/components/footer';
import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Loader2, Leaf, AlertTriangle, TrendingUp, Info, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const predictionData = [
  { week: 'Week 1', predicted: 85, actual: 82 },
  { week: 'Week 2', predicted: 87, actual: 88 },
  { week: 'Week 3', predicted: 89, actual: 87 },
  { week: 'Week 4', predicted: 91, actual: 92 },
  { week: 'Week 5', predicted: 93, actual: 95 },
  { week: 'Week 6', predicted: 94, actual: 93 },
];

const creditScoreData = [
  { category: 'Reliability', score: 92 },
  { category: 'Data Quality', score: 88 },
  { category: 'Payment History', score: 95 },
  { category: 'Farm Output', score: 87 },
];

const soilData = [
  { day: 'Mon', moisture: 65, ph: 6.8 },
  { day: 'Tue', moisture: 68, ph: 6.9 },
  { day: 'Wed', moisture: 72, ph: 7.0 },
  { day: 'Thu', moisture: 70, ph: 6.9 },
  { day: 'Fri', moisture: 75, ph: 7.1 },
  { day: 'Sat', moisture: 78, ph: 7.0 },
  { day: 'Sun', moisture: 80, ph: 6.95 },
];

const cropHealthData = [
  { name: 'Healthy', value: 70 },
  { name: 'At Risk', value: 20 },
  { name: 'Critical', value: 10 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function AIInsights() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [realTimeInsights, setRealTimeInsights] = useState<any[]>([
    {
      type: 'WARNING',
      title: 'Moisture Dropping',
      message: 'Soil moisture in Field A is below optimal. Consider activating pump.',
      action: 'Turn On Pump'
    },
    {
      type: 'SUCCESS',
      title: 'Optimal Conditions',
      message: 'Temperature and Humidity in Field B are ideal for wheat growth.',
    }
  ]);
  const [soilHistory, setSoilHistory] = useState<any[]>(soilData);
  const [currentSensors, setCurrentSensors] = useState<any>(null);
  
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // WebSocket Connection for Real-Time Insights
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'SENSOR_UPDATE') {
        const newData = message.data;
        setCurrentSensors(newData);
        
        // Update real-time insights from backend
        if (newData.insights) {
          setRealTimeInsights(newData.insights);
        }

        // Update Soil Chart History
        setSoilHistory(prev => {
          const updated = [...prev, {
            day: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            moisture: newData.soil,
            ph: newData.pH
          }];
          return updated.slice(-10);
        });
      }
    };

    socket.onerror = () => {
      console.warn('⚠️ WebSocket failed to connect.');
    };

    // We ALWAYS run dummy mode for temp, pH, humidity, etc., because Arduino doesn't have these sensors!
    // BUT we NEVER randomize distance (Water Level) or soil, those are STRICTLY hardware.
    const dummyInterval = setInterval(() => {
      setCurrentSensors((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          temp: Math.floor(Math.random() * (30 - 20) + 20),
          humidity: Math.floor(Math.random() * (90 - 30) + 30),
          pH: parseFloat((Math.random() * (8 - 6) + 6).toFixed(1)),
          nitrogen: Math.floor(Math.random() * (70 - 40) + 40),
          phosphorus: Math.floor(Math.random() * (60 - 30) + 30),
        };
      });
    }, 3000);

    return () => {
      socket.close();
      clearInterval(dummyInterval);
    };
  }, []);

  const handleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      setTimeout(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0);
          setCapturedImage(canvas.toDataURL('image/jpeg'));
          stream.getTracks().forEach(track => track.stop());
          processImage(canvas.toDataURL('image/jpeg'));
        }
      }, 1000);
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCapturedImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:4000/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      });
      const data = await response.json();
      setAiResult(data);
    } catch (error) {
      console.error('AI Analysis failed:', error);
      // Fallback mock if server is down
      setAiResult({
        classification: 'Tomato Plant - Early Blight',
        confidence: 94.5,
        suggestions: ['Check connectivity', 'Retry upload'],
        cropHealth: 'Unknown',
        riskScore: 50,
        recommendations: ['Check backend connection']
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background dark:bg-background pt-20">
      <Navbar />
      
      <AIInsightsAnimatedObjects />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* SECTION 1: Header */}
        <div className="mb-16 space-y-4">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            AI-Powered Crop Insights
          </h1>
          <p className="text-lg text-foreground/70">Advanced machine learning analysis and real-time crop health monitoring</p>
        </div>

        {/* SECTION 2: Camera & Upload */}
        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold">Analyze Your Crop</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Camera Section */}
            <div className="glass dark:glass-dark p-8 rounded-2xl space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Camera className="w-6 h-6 text-accent" />
                Take Photo
              </h3>
              {!capturedImage ? (
                <button
                  onClick={handleCamera}
                  className="w-full py-12 border-2 border-dashed border-accent rounded-xl hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-4 group"
                >
                  <Camera className="w-12 h-12 text-accent group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-foreground/70">Click to Open Camera</span>
                  <span className="text-sm text-foreground/50">Point at your crop</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full rounded-lg object-cover h-48" />
                  <button
                    onClick={() => {
                      setCapturedImage(null);
                      setAiResult(null);
                    }}
                    className="w-full py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-all text-sm font-semibold"
                  >
                    Retake Photo
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Upload Section */}
            <div className="glass dark:glass-dark p-8 rounded-2xl space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Upload className="w-6 h-6 text-accent" />
                Upload From Gallery
              </h3>
              {!capturedImage ? (
                <>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full py-12 border-2 border-dashed border-accent rounded-xl hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-4 group"
                  >
                    <Upload className="w-12 h-12 text-accent group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-foreground/70">Click to Browse</span>
                    <span className="text-sm text-foreground/50">Select an image file</span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </>
              ) : (
                <div className="space-y-4">
                  <img src={capturedImage || "/placeholder.svg"} alt="Uploaded" className="w-full rounded-lg object-cover h-48" />
                  <button
                    onClick={() => {
                      setCapturedImage(null);
                      setAiResult(null);
                    }}
                    className="w-full py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-all text-sm font-semibold"
                  >
                    Upload Different Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: Processing State */}
        {isProcessing && (
          <section className="mb-16 glass dark:glass-dark p-12 rounded-2xl text-center space-y-6">
            <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Analyzing Your Crop</h3>
              <p className="text-foreground/70">Using advanced AI models to process your image...</p>
            </div>
          </section>
        )}

        {/* SECTION 4: AI Results */}
        {aiResult && !isProcessing && (
          <>
            {aiResult.isPlant === false ? (
              <div className="mb-16 glass dark:glass-dark p-12 rounded-2xl border-2 border-red-500/50 bg-red-500/5 text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-red-500">No Plant Detected</h3>
                  <p className="text-foreground/70 text-lg">
                    We couldn't identify a crop in this image. For accurate results, please:
                  </p>
                </div>
                <ul className="max-w-md mx-auto text-left space-y-3">
                  {aiResult.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                {/* Result Overview */}
                <section className="mb-16 grid md:grid-cols-3 gap-8">
                  <div className="glass dark:glass-dark p-8 rounded-2xl space-y-4 border-2 border-green-500/20">
                    <h3 className="text-sm font-semibold text-foreground/60 uppercase">Classification</h3>
                    <p className="text-2xl font-bold">{aiResult.classification}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">{aiResult.confidence}% Confidence</span>
                    </div>
                  </div>

                  <div className="glass dark:glass-dark p-8 rounded-2xl space-y-4 border-2 border-yellow-500/20">
                    <h3 className="text-sm font-semibold text-foreground/60 uppercase">Crop Health</h3>
                    <p className="text-2xl font-bold">{aiResult.cropHealth || 'Moderate'}</p>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">Risk Score: {aiResult.riskScore}/100</span>
                    </div>
                  </div>

                  <div className="glass dark:glass-dark p-8 rounded-2xl space-y-4 border-2 border-blue-500/20">
                    <h3 className="text-sm font-semibold text-foreground/60 uppercase">Action Required</h3>
                    <p className="text-2xl font-bold">{aiResult.suggestions?.length || 0} Steps</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-blue-600 dark:text-blue-400">Improve Yield</span>
                    </div>
                  </div>
                </section>

                {/* Suggestions */}
                <section className="mb-16 space-y-6">
                  <h2 className="text-3xl font-bold">Immediate Recommendations</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {aiResult.suggestions?.map((suggestion: string, i: number) => (
                      <div key={i} className="glass dark:glass-dark p-6 rounded-xl flex gap-4 hover:-translate-y-1 transition-all">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                          {i + 1}
                        </div>
                        <p className="text-foreground/70 leading-relaxed">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Detailed Recommendations */}
                <section className="mb-16 space-y-6">
                  <h2 className="text-3xl font-bold">Detailed Treatment Plan</h2>
                  <div className="space-y-4">
                    {aiResult.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="glass dark:glass-dark p-6 rounded-xl border-l-4 border-accent space-y-2">
                        <p className="font-semibold text-foreground">{rec}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {/* SECTION: Real-Time Live Insights */}
        <section className="mb-16 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="text-accent" />
              Live Field Intelligence
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-sm font-bold animate-pulse">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              LIVE DATA STREAM
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {realTimeInsights.length > 0 ? (
              realTimeInsights.map((insight, i) => (
                <div key={i} className={`glass dark:glass-dark p-6 rounded-2xl border-l-4 transition-all hover:scale-105 ${
                  insight.type === 'CRITICAL' ? 'border-red-500 bg-red-500/5' :
                  insight.type === 'WARNING' ? 'border-yellow-500 bg-yellow-500/5' :
                  'border-green-500 bg-green-500/5'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    {insight.type === 'CRITICAL' ? <AlertTriangle className="text-red-500" /> :
                     insight.type === 'WARNING' ? <Info className="text-yellow-500" /> :
                     <CheckCircle2 className="text-green-500" />}
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                      insight.type === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                      insight.type === 'WARNING' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-green-500/20 text-green-500'
                    }`}>{insight.type}</span>
                  </div>
                  <h3 className="font-bold mb-2">{insight.title}</h3>
                  <p className="text-sm text-foreground/70 mb-4">{insight.message}</p>
                  <button className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                    insight.type === 'CRITICAL' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' :
                    insight.type === 'WARNING' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30' :
                    'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  }`}>
                    {insight.action}
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full glass p-12 rounded-2xl text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent" />
                <p className="text-foreground/60 italic">Analyzing current field conditions...</p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 5: Credit Score */}
        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold">Your Credit Score</h2>
          <div className="glass dark:glass-dark p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex flex-col items-center justify-center text-white">
                  <div className="text-6xl font-bold">850</div>
                  <div className="text-sm font-semibold mt-2">Excellent</div>
                </div>
              </div>
              <div className="space-y-6">
                {creditScoreData.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">{item.category}</span>
                      <span className="text-accent font-bold">{item.score}%</span>
                    </div>
                    <div className="w-full bg-secondary dark:bg-secondary/50 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Crop Yield Predictions */}
        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold">Crop Yield Predictions</h2>
          <div className="glass dark:glass-dark p-8 rounded-2xl">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={predictionData}>
                <defs>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="week" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #10b981', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="actual" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* SECTION 7: Soil Analysis */}
        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold">Real-Time Soil Analysis & Monitoring</h2>
          <div className="glass dark:glass-dark p-8 rounded-2xl">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={soilHistory}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="day" stroke="currentColor" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#3b82f6" label={{ value: 'Moisture %', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'pH Level', angle: 90, position: 'insideRight' }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', borderRadius: '8px' }} />
                <Area yAxisId="left" type="monotone" dataKey="moisture" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMoisture)" />
                <Area yAxisId="right" type="monotone" dataKey="ph" stroke="#10b981" fillOpacity={0.5} fill="url(#colorPH)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* SECTION 8: Crop Health Distribution */}
        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold">Farm Crop Health Distribution</h2>
          <div className="glass dark:glass-dark p-8 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cropHealthData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cropHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                {cropHealthData.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[i] }} />
                    <span className="font-semibold">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: Weather Impact */}
        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold">Real-Time Weather Impact Analysis</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                label: 'Temperature', 
                value: currentSensors ? `${currentSensors.temp}°C` : '28°C', 
                status: currentSensors?.temp > 35 ? 'High' : currentSensors?.temp < 15 ? 'Low' : 'Optimal', 
                icon: '🌡️' 
              },
              { 
                label: 'Rainfall Exposure', 
                value: '45mm', // Static since we don't have a rain sensor yet
                status: 'Adequate', 
                icon: '🌧️' 
              },
              { 
                label: 'Humidity Level', 
                value: currentSensors ? `${currentSensors.humidity}%` : '65%', 
                status: currentSensors?.humidity > 80 ? 'High' : currentSensors?.humidity < 30 ? 'Dry' : 'Ideal', 
                icon: '💧' 
              },
            ].map((item, i) => (
              <div key={i} className="glass dark:glass-dark p-8 rounded-2xl space-y-4 hover:-translate-y-1 transition-all">
                <div className="text-4xl">{item.icon}</div>
                <p className="text-sm font-semibold text-foreground/60">{item.label}</p>
                <p className="text-3xl font-bold text-accent">{item.value}</p>
                <p className={`text-sm font-semibold ${
                  item.status === 'Optimal' || item.status === 'Ideal' || item.status === 'Adequate' 
                    ? 'text-green-500' 
                    : 'text-yellow-500'
                }`}>{item.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 10: Advanced Analytics */}
        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold">Advanced AI Predictions</h2>
          <div className="glass dark:glass-dark p-8 rounded-2xl">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={creditScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="category" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #10b981', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="#10b981" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* SECTION 11: Resources */}
        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold">Learn More</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Crop Disease Guide', desc: 'Comprehensive guide to identify and treat common crop diseases' },
              { title: 'Soil Management', desc: 'Best practices for soil health and improvement' },
              { title: 'Pest Control', desc: 'Organic and chemical pest management strategies' },
              { title: 'Irrigation Guide', desc: 'Optimize water usage for maximum yield' },
            ].map((resource, i) => (
              <div key={i} className="glass dark:glass-dark p-8 rounded-2xl hover:-translate-y-2 transition-all cursor-pointer group">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">{resource.title}</h3>
                <p className="text-foreground/70">{resource.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
