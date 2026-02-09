import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, Activity, Zap, Search, Bell, LayoutDashboard, Briefcase, Settings, Anchor, Newspaper, ArrowUpRight, Clock, Target, Globe, BarChart3, Crosshair, Menu, X, Lock } from 'lucide-react';

import LoginPage from './LoginPage';
import FocusSection from './FocusSection';

// --- DATA & CONFIG ---
const RISK_COLORS = {
  Low: '#10B981',      // Green
  Moderate: '#F59E0B', // Orange/Yellow
  Critical: '#EF4444'  // Red
};

const portfolioData = [
  { name: 'SBI', value: 45000, qty: 75, avg: 600, current: 635 },
  { name: 'L&T', value: 82000, qty: 30, avg: 2500, current: 2733 },
  { name: 'ITC', value: 35000, qty: 80, avg: 400, current: 437 },
  { name: 'Adani Ent', value: 20000, qty: 10, avg: 1900, current: 2000 },
  { name: 'Tata Motors', value: 55000, qty: 90, avg: 580, current: 611 },
];

const BASE_PORTFOLIO_VALUE = 237000;

// Market News
const newsGrid = {
  alpha: [
    { title: "L&T Secures Mega Order from Middle East", source: "Reuters", time: "12 mins ago" },
    { title: "Adani Ports Cargo Volume up 15% YoY", source: "Mint", time: "30 mins ago" },
    { title: "Reliance Retail plans IPO in Q3 2026", source: "ET", time: "45 mins ago" },
    { title: "HDFC Bank net profit jumps 18%", source: "BSE", time: "50 mins ago" }
  ],
  sectoral: [
    { title: "Auto Index hits record high on EV Policy", source: "CNBC-TV18", time: "1 hr ago" },
    { title: "Metal stocks slide as China demand weakens", source: "Bloomberg", time: "2 hrs ago" },
    { title: "IT Sector rally continues post-Fed comments", source: "TechCrunch", time: "2.5 hrs ago" },
    { title: "Pharma index gains on new FDA approvals", source: "MoneyControl", time: "3 hrs ago" }
  ],
  macro: [
    { title: "RBI keeps Repo Rate unchanged at 6.5%", source: "RBI Press", time: "3 hrs ago" },
    { title: "US Fed hints at 2 more rate cuts in 2024", source: "WSJ", time: "5 hrs ago" },
    { title: "India GDP growth projected at 7.2%", source: "IMF", time: "6 hrs ago" },
    { title: "Oil prices stable amid geopolitical tension", source: "Reuters", time: "7 hrs ago" }
  ]
};

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'risk-analysis', label: 'Risk Analysis', icon: Activity },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'market-news', label: 'Market News', icon: Newspaper }
];

// --- ANIMATION COMPONENT REMOVED (Replaced by FocusSection) ---

export default function RiskDashboard() {
  // AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [volatilityData, setVolatilityData] = useState([]);

  const activeIndex = NAV_ITEMS.findIndex(item => item.id === activeSection);

  // USAGE & STUDENT LOGIC
  const [usageCount, setUsageCount] = useState(0);
  const [isStudent, setIsStudent] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // REFS FOR SCROLL SYNC
  const leftSidebarRef = useRef(null);
  const rightSidebarRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(true); // Desktop Collapse State

  // Live Market Stats
  const [marketStats, setMarketStats] = useState({
    portfolioValue: BASE_PORTFOLIO_VALUE,
    dayPnL: 8450,
    riskScore: 38
  });

  // --- MARKET HEARTBEAT (Lightweight Interval) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketStats(prev => {
        const valueChange = (Math.random() - 0.5) * 500;
        const newValue = Math.round(BASE_PORTFOLIO_VALUE + valueChange + (Math.random() * 2000));
        const newPnL = Math.round(8450 + (valueChange * 0.8));
        const riskChange = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        let newRisk = prev.riskScore + riskChange;
        if (newRisk < 35) newRisk = 35;
        if (newRisk > 42) newRisk = 42;

        return {
          portfolioValue: newValue,
          dayPnL: newPnL,
          riskScore: newRisk
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Generate Volatility Data
  useEffect(() => {
    const times = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'];
    let currentValue = BASE_PORTFOLIO_VALUE;
    const data = times.map(time => {
      const changePercent = (Math.random() * 3 - 1.5) / 100;
      currentValue = currentValue * (1 + changePercent);
      return {
        time,
        value: Math.round(currentValue),
        trend: changePercent >= 0 ? 'up' : 'down'
      };
    });
    setVolatilityData(data);
  }, []);

  // Scroll Spy & Sticky Logic
  // Scroll Spy & Sticky Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Find the entry with the highest intersection ratio
      const visibleSection = entries.reduce((max, entry) => {
        return entry.intersectionRatio > max.intersectionRatio ? entry : max;
      }, entries[0]);

      if (visibleSection && visibleSection.isIntersecting) {
        setActiveSection(visibleSection.target.id);
      }
    }, { threshold: [0.2, 0.5, 0.8], rootMargin: "-40% 0px -40% 0px" }); // Active when crossing center sweet spot

    const sections = ['overview', 'risk-analysis', 'portfolio', 'market-news'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
    setIsSidebarOpen(false); // Close on mobile only
  };

  const handleAnalysis = async () => {
    if (!userInput) return alert("System requires asset data for computation.");
    setIsAnalyzing(true);
    setErrorMsg("");
    setRiskData(null);
    try {
      const response = await fetch('http://localhost:5001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userInput,
          usage_count: usageCount,
          is_student: isStudent
        })
      });
      const data = await response.json();

      setUsageCount(prev => prev + 1);

      if (data.analysis && !data.analysis.startsWith('{')) {
        if (data.analysis.includes("Daily limit reached")) {
          setShowUpgradeModal(true);
        } else if (data.analysis.includes("Student limit reached")) {
          setShowUpgradeModal(true);
        } else {
          setErrorMsg(data.analysis);
        }
        return;
      }

      try {
        const parsed = JSON.parse(data.analysis);
        setRiskData(parsed);
      } catch (parseError) {
        console.error("JSON Parse Failed:", parseError);
        setErrorMsg("Raw Data Error: System received non-JSON format.");
      }
    } catch (error) {
      setErrorMsg("Backend Offline: Neural link severed. Ensure Port 5001 is active.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activateStudentMode = () => {
    setIsStudent(true);
    setShowStudentModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const getMeterData = (score) => [
    { name: 'Risk', value: score },
    { name: 'Safety', value: 10 - score }
  ];

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30 relative">
      <div className="fixed inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0 opacity-[0.03]"></div>

      {/* SUCCESS TOAST */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50 animate-in fade-in slide-in-from-right duration-500">
          <div className="bg-[#0f172a] border border-green-500/30 rounded-xl p-4 shadow-2xl flex items-center gap-4 max-w-sm">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
              <Shield size={20} className="text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Identity Verified! 🎓</h4>
              <p className="text-xs text-slate-400 mt-1">Student Tier active. 10 Premium Neural Scans granted. Defy gravity!</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-slate-500 hover:text-white"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* MODAL: UPGRADE */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-blue-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Unlock Unlimited Neural Insights 🚀</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                You've reached your limit of 2 free deep-factor scans. Upgrade to <span className="text-blue-400 font-bold">Sentinel Pro</span> for unlimited risk analysis.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 mb-4">
                Get Sentinel Pro
              </button>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 underline cursor-pointer">Already a subscriber? Log in</span>
                <span className="text-slate-600">*2 free searches for guests.</span>
              </div>
              {!isStudent && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-slate-500 text-sm mb-2">Are you a Student?</p>
                  <button onClick={() => { setShowUpgradeModal(false); setShowStudentModal(true); }} className="text-yellow-400 hover:text-yellow-300 text-sm font-bold flex items-center justify-center gap-2 w-full">
                    Verify for Free Access <ArrowUpRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: STUDENT VERIFICATION */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            <button onClick={() => setShowStudentModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard size={32} className="text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Empowering the Next Generation 🎓</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Verify your status to get <span className="text-yellow-400 font-bold">10 FREE Neural Scans</span> per month.
              </p>
              <div className="text-left bg-slate-800/50 p-4 rounded-xl mb-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-slate-300">Upload Student ID (Front & Back).</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">2</div>
                  <p className="text-sm text-slate-300">Or use university email for instant access.</p>
                </div>
              </div>
              <button onClick={activateStudentMode} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-yellow-600/20">
                Verify & Get 10 Free Scans
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR (Gemini Style) */}
      {/* SIDEBAR (Gemini Style - Persistent & Glassmorphism) */}
      <aside
        className={`z-40 transition-[width] duration-300 ease-in-out flex flex-col shrink-0 border-r border-slate-800/50
        fixed inset-y-0 left-0 lg:static lg:h-full lg:overflow-visible
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
        lg:translate-x-0
        ${isExpanded ? 'lg:w-[280px]' : 'lg:w-[72px]'}
        bg-slate-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-900/60`}
      >
        <div className={`p-4 flex items-center text-blue-400 shrink-0 sticky top-0 bg-slate-900/95 backdrop-blur z-40 border-b border-transparent ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            {/* Desktop Toggle (Hamburger) */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden lg:flex p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/50 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Mobile / Expanded Logo */}
            <div className={`flex items-center gap-2 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'lg:opacity-0 lg:hidden'}`}>
              <Shield size={24} className="shrink-0" />
              <span className="font-bold tracking-tight uppercase text-lg">Sentinel</span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto no-scrollbar relative group">
          {activeIndex !== -1 && (
            <div
              className={`absolute left-3 w-[calc(100%-24px)] bg-blue-600 bg-opacity-8 backdrop-blur-sm rounded-xl z-0 pointer-events-none
                transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                ${isExpanded ? 'opacity-100' : 'opacity-0'} 
              `}
              style={{
                height: '48px', // Match item height
                top: `${16 + activeIndex * 52}px`, // Calculate top position based on index
              }}
            />
          )}

          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative z-10 flex items-center gap-4 px-3 py-3 cursor-pointer transition-all duration-200 rounded-full overflow-hidden
                 ${activeSection === item.id
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
                 ${isExpanded ? '' : 'justify-center'}
              `}
              title={!isExpanded ? item.label : ''}
            >
              <item.icon size={24} className="shrink-0 transition-transform duration-300 relative z-10" />
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 origin-left relative z-10 ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0 w-0 hidden'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 shrink-0 mt-auto sticky bottom-0 bg-slate-900 z-40">
          <div className={`flex items-center gap-4 px-3 py-3 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full transition-colors ${isExpanded ? '' : 'justify-center'}`}>
            <Settings size={24} className="shrink-0" />
            <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Settings</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      {/* MAIN CONTENT WRAPPER (Independent Scroll) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 relative">
        {/* HEADER */}
        <header className="sticky top-0 z-20 h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white lg:hidden">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 w-full max-w-sm">
              <Search size={16} className="text-slate-500" />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none text-slate-300 w-full placeholder:text-slate-600" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-slate-400" />
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div onClick={() => setShowStudentModal(true)} className="text-right hidden md:block cursor-pointer select-none group">
                <p className="text-sm font-bold text-white">Anurag Panda</p>
                <p className={`text-[10px] uppercase tracking-wider group-hover:underline ${isStudent ? 'text-yellow-400' : 'text-blue-400'}`}>
                  {isStudent ? 'Student Plan' : 'Admin • Pro Plan'}
                </p>
                <p className="text-[9px] text-slate-500">Usage: {usageCount}</p>
              </div>
              <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white">AP</div>
            </div>
          </div>
        </header>

        {/* FEED */}
        {/* SCROLLABLE DASHBOARD FEED */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-6 lg:p-10 space-y-24 pb-32">

          {/* OVERVIEW SECTION (Unchanged) */}
          {/* OVERVIEW SECTION */}
          <FocusSection id="overview" className="scroll-mt-24">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h2>
                <p className="text-slate-500 mt-1">Real-time market intelligence.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] uppercase font-bold text-green-500">System Online</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Portfolio Value" value={`₹${marketStats.portfolioValue.toLocaleString()}`} sub="Live Aggregation" change="+4.5%" icon={<Shield size={20} className="text-blue-400" />} />
              <StatCard title="Risk Score" value={`${marketStats.riskScore}/100`} sub="Neural Monitor" change="-0.5%" icon={<AlertTriangle size={20} className="text-blue-400" />} />
              <StatCard title="Day's P&L" value={`+₹${marketStats.dayPnL.toLocaleString()}`} sub="Target: ₹9k" change="+12.4%" icon={<TrendingUp size={20} className="text-blue-400" />} />
              <StatCard title="AI Prediction" value="Bullish" sub="Infra Sector" change="+0.0%" icon={<Zap size={20} className="text-blue-400" />} />
            </div>
          </FocusSection>

          {/* NEURAL RISK ANALYSIS (UPDATED LAYOUT) */}
          <FocusSection id="risk-analysis" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
              <Activity className="text-yellow-500" /> Neural Risk Analysis
            </h2>

            <div className="mb-6">
              <div className="flex gap-4">
                <input
                  className="flex-1 bg-slate-900/80 border border-slate-700 px-6 py-4 rounded-xl text-white outline-none focus:border-blue-500 transition-colors font-mono placeholder:text-slate-600"
                  placeholder="ENTER ASSET TICKER (e.g., RELIANCE)..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
                />
                <button
                  onClick={handleAnalysis}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-500 px-8 rounded-xl font-bold uppercase tracking-wide text-sm transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {isAnalyzing ? "Processing..." : "Analyze"}
                </button>
              </div>
            </div>
            {errorMsg && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 text-red-400">
                <AlertTriangle size={20} />
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            {/* 3-COLUMN STICKY LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative items-start">

              {/* LEFT SIDEBAR: RISK GAUGE */}
              <div
                ref={leftSidebarRef}
                className="lg:col-span-3 bg-[#0b1221] border border-blue-900/30 rounded-2xl p-6 shadow-xl sticky top-24 transition-transform duration-500 ease-out will-change-transform"
              >
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Risk Gauge</h4>
                {riskData ? (
                  <>
                    <div className="h-40 w-full mt-2 flex items-end justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={getMeterData(riskData.riskScore)} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value" stroke="none">
                            <Cell fill={riskData.riskScore > 7 ? RISK_COLORS.Critical : riskData.riskScore > 3 ? RISK_COLORS.Moderate : RISK_COLORS.Low} />
                            <Cell fill="#1e293b" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-[-30px] relative z-10">
                      <span className={`text-4xl font-black font-mono tracking-tighter ${riskData.riskScore <= 4 ? 'text-green-400' : 'text-white'}`}>
                        {riskData.riskScore}<span className="text-lg text-slate-500">/10</span>
                      </span>
                      <p className={`text-sm font-bold uppercase mt-1 ${riskData.riskLevel === 'Critical' ? 'text-red-500' : riskData.riskLevel === 'Moderate' ? 'text-yellow-500' : 'text-green-500'}`}>
                        {riskData.riskLevel}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-600 text-sm">Waiting for Data...</div>
                )}
              </div>

              {/* CENTER: ANALYSIS CONTENT */}
              <div className="lg:col-span-6 space-y-6">
                {riskData ? (
                  <>
                    <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Activity size={14} /> Neural Analysis</h4>
                      <p className="text-slate-300 leading-relaxed font-light text-lg">"{riskData.analysisSummary}"</p>
                    </div>
                    {/* Market Intel Integration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 p-5 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-blue-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg text-white">SENTINEL PICK</div>
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={14} /> Momentum Alpha</h4>

                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">JIOFIN</h3>
                            <p className="text-[10px] text-slate-400">Jio Financial Services</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded border border-green-500/30">HIGH CONVICTION</div>
                          </div>
                        </div>

                        <div className="space-y-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Catalyst</span>
                            <span className="text-white font-bold">BlackRock Asset JV Launch</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Entry / Target</span>
                            <span className="text-blue-300 font-mono">₹385 <span className="text-slate-600">{'->'}</span> ₹450</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-800/40 border border-green-500/20 p-5 rounded-xl">
                        <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Green Zone</h4>
                        <ul className="space-y-2">
                          <StockImpactItem ticker="L&T" impact="+15%" reason="Order Book" isBullish={true} />
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-64 bg-slate-900/20 border border-slate-800 rounded-2xl flex items-center justify-center border-dashed">
                    <p className="text-slate-500">Enter a ticker to generate Neural Analysis</p>
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR: STRATEGY */}
              <div
                ref={rightSidebarRef}
                className="lg:col-span-3 space-y-4 sticky top-24 transition-transform duration-500 ease-out will-change-transform"
              >
                {riskData ? (
                  <>
                    <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-xl">
                      <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Black Swan Risks</h4>
                      <ul className="space-y-2">
                        {riskData.blackSwanRisks.map((r, i) => (
                          <li key={i} className="flex gap-2 text-xs text-slate-400"><span className="text-red-500">•</span> {r}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/10 p-5 rounded-xl">
                      <h4 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-4">Hedge Strategy</h4>
                      <ul className="space-y-2">
                        {riskData.hedgingStrategies.map((h, i) => (
                          <li key={i} className="flex gap-2 text-xs text-slate-400"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 shrink-0"></div> {h}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl h-48 flex items-center justify-center">
                    <p className="text-slate-600 text-xs">Strategy Module Idle</p>
                  </div>
                )}
              </div>

            </div>
          </FocusSection>

          {/* PORTFOLIO & NEWS (Remaining Sections) */}
          <FocusSection id="portfolio" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
              <Briefcase className="text-blue-500" /> Portfolio Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">Allocation</h3>
                <AssetAllocationChart data={portfolioData} colors={COLORS} />
              </div>
              <div className="lg:col-span-8 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold">Volatility Simulation</h3>
                </div>
                <VolatilityChart data={volatilityData} />
              </div>
            </div>
            <HoldingsTable data={portfolioData} colors={COLORS} />
          </FocusSection>

          <FocusSection id="market-news" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
              <Newspaper className="text-purple-500" /> Market Intelligence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NewsGroup title="Breaking Alpha" newsList={newsGrid.alpha} color="text-yellow-400" icon={<Zap size={14} />} />
              <NewsGroup title="Sectoral Shifts" newsList={newsGrid.sectoral} color="text-blue-400" icon={<BarChart3 size={14} />} />
              <NewsGroup title="Macro-Economic" newsList={newsGrid.macro} color="text-green-400" icon={<Globe size={14} />} />
            </div>
          </FocusSection>

        </main>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function NavItem({ icon, label, isActive, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors rounded-lg ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
      {icon} <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function StatCard({ title, value, sub, change, icon }) {
  const isPos = change.startsWith('+');
  return (
    <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl transition-all duration-500 ease-in-out hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:scale-95 hover:border-blue-400 cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-900 rounded-lg text-slate-400 border border-slate-800">{icon}</div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full font-mono ${isPos ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{change}</span>
      </div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-2xl font-black text-white font-mono tracking-tighter">{value}</p>
      <p className="text-[10px] text-slate-500 mt-2">{sub}</p>
    </div>
  );
}

function StockImpactItem({ ticker, impact, reason, isBullish }) {
  return (
    <li className="flex justify-between items-center p-3 bg-slate-900/40 rounded-lg border border-slate-800 hover:bg-slate-800/60 transition-colors">
      <div>
        <span className="text-white font-bold block">{ticker}</span>
        <span className="text-[10px] text-slate-500 uppercase">{reason}</span>
      </div>
      <div className={`text-sm font-bold font-mono ${isBullish ? 'text-green-400' : 'text-red-400'}`}>{impact}</div>
    </li>
  );
}

const AlphaScoutItem = ({ ticker, signal, reason }) => (
  <div className="flex items-start justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer group">
    <div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-white group-hover:text-cyan-400">{ticker}</span>
        <span className="text-[10px] bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">{signal}</span>
      </div>
      <p className="text-[10px] text-slate-400 mt-1">{reason}</p>
    </div>
    <ArrowUpRight size={16} className="text-slate-600 group-hover:text-blue-400" />
  </div>
);

const NewsGroup = ({ title, newsList, color, icon }) => (
  <div className="space-y-4">
    <h3 className={`text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2`}>
      <span className={color}>{icon}</span> {title}
    </h3>
    {newsList.map((news, i) => (
      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 transition-all duration-500 ease-in-out cursor-pointer hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:scale-95 hover:border-blue-400">
        <div className="flex justify-between items-start mb-3">
          <Clock className="text-slate-600" size={14} />
        </div>
        <h4 className="text-sm font-bold text-slate-200 leading-snug mb-2">{news.title}</h4>
        <div className="text-[10px] text-slate-500 uppercase flex items-center gap-2">
          <span>{news.source}</span> • <span className="font-mono">{news.time}</span>
        </div>
      </div>
    ))}
  </div>
);

const AssetAllocationChart = React.memo(({ data, colors }) => (
  <div className="h-64">
    <ResponsiveContainer>
      <PieChart>
        <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} isAnimationActive={false} className="font-mono text-xs">
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} itemStyle={{ color: '#e2e8f0' }} />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  </div>
));

const VolatilityChart = React.memo(({ data }) => (
  <div className="h-64">
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
        <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tick={{ fontFamily: 'monospace' }} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} tick={{ fontFamily: 'monospace' }} />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }} formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']} itemStyle={{ fontFamily: 'monospace' }} />
        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
));

const HoldingsTable = React.memo(({ data, colors }) => (
  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
    <div className="max-h-[400px] overflow-y-auto">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="bg-slate-900/90 text-slate-200 uppercase text-xs font-bold sticky top-0 backdrop-blur-md z-10">
          <tr>
            <th className="px-6 py-4">Ticker</th>
            <th className="px-6 py-4">Qty</th>
            <th className="px-6 py-4">Avg Price</th>
            <th className="px-6 py-4">LTP</th>
            <th className="px-6 py-4">Value</th>
            <th className="px-6 py-4 text-right">Allocation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.map((stock, i) => (
            <tr key={i} className="group hover:bg-blue-500/5 transition-colors">
              <td className="px-6 py-4 font-bold text-white flex items-center gap-2 group-hover:text-cyan-400">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }}></div> {stock.name}
              </td>
              <td className="px-6 py-4 font-mono">{stock.qty}</td>
              <td className="px-6 py-4 font-mono">₹{stock.avg}</td>
              <td className="px-6 py-4 text-white font-mono">₹{stock.current}</td>
              <td className="px-6 py-4 font-bold text-white font-mono">₹{(stock.current * stock.qty).toLocaleString()}</td>
              <td className="px-6 py-4 text-right font-mono">{((stock.value / 237000) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));