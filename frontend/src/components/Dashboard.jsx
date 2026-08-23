import React, { useState, useEffect } from 'react';
import { Loader2, Trash2, LayoutDashboard, History as HistoryIcon, Settings, FileCode2, User, ChevronDown, Download, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../App.css'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Analyze');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/analyze`, { text: text.trim() });
      const newResult = response.data;
      
      setResult(newResult);
      setHistory([newResult, ...history].slice(0, 50));
      setText('');
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete(`${API_URL}/history`);
      setHistory([]);
      setResult(null);
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'Positive') return 'text-brandGreen';
    if (sentiment === 'Negative') return 'text-brandRed';
    return 'text-mutedText';
  };
  
  const getSentimentBg = (sentiment) => {
    if (sentiment === 'Positive') return 'bg-brandGreen/10 text-brandGreen border border-brandGreen/20';
    if (sentiment === 'Negative') return 'bg-brandRed/10 text-brandRed border border-brandRed/20';
    return 'bg-mutedText/10 text-mutedText border border-mutedText/20';
  };
  
  const getSentimentBarBg = (sentiment) => {
    if (sentiment === 'Positive') return 'bg-brandGreen';
    if (sentiment === 'Negative') return 'bg-brandRed';
    return 'bg-mutedText';
  };

  const getKeywords = (resultObj) => {
    if (resultObj.keywords && resultObj.keywords.length > 0) return resultObj.keywords;
    return ["data", "insights", "model"];
  };

  return (
    <div className="flex h-[100dvh] w-full bg-pageBg text-primaryText font-sans overflow-hidden selection:bg-brandGreen/30 selection:text-white relative">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[260px] bg-sidebarBg border-r border-borderBorder flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-borderBorder shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-brandGreen flex items-center justify-center text-pageBg font-bold text-sm">
              SI
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Sentiment<span className="text-brandGreen">AI</span></h1>
          </div>
          <button className="md:hidden text-mutedText hover:text-white p-1" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Analyze" 
            isActive={activeTab === 'Analyze'} 
            onClick={() => { setActiveTab('Analyze'); setIsMobileMenuOpen(false); }}
          />
          <NavItem 
            icon={<HistoryIcon size={18} />} 
            label="History" 
            isActive={activeTab === 'History'} 
            onClick={() => { setActiveTab('History'); setIsMobileMenuOpen(false); }}
          />
          <NavItem 
            icon={<Settings size={18} />} 
            label="Settings" 
            isActive={activeTab === 'Settings'} 
            onClick={() => { setActiveTab('Settings'); setIsMobileMenuOpen(false); }}
          />
          <NavItem 
            icon={<FileCode2 size={18} />} 
            label="API Docs" 
            isActive={activeTab === 'API Docs'} 
            onClick={() => { setActiveTab('API Docs'); setIsMobileMenuOpen(false); }}
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-pageBg min-w-0">
        
        {/* Top Header */}
        <header className="h-16 flex justify-between items-center px-4 md:px-8 border-b border-borderBorder bg-pageBg/80 backdrop-blur z-10 shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden text-mutedText hover:text-white p-1 -ml-1 shrink-0" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-[16px] font-semibold text-white truncate">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-cardBg border border-borderBorder rounded-[4px] px-3 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandGreen opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brandGreen"></span>
              </span>
              <span className="text-primaryText text-[12px] font-medium tracking-wide">GPT-5.4</span>
              <ChevronDown size={14} className="text-mutedText ml-1" />
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[4px] bg-cardBg border border-borderBorder flex items-center justify-center shrink-0">
                  <User size={16} className="text-mutedText" />
                </div>
                <span className="hidden sm:block text-[13px] font-medium text-primaryText truncate max-w-[100px]">{currentUser?.name || 'User'}</span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-1.5 text-mutedText hover:text-brandRed transition-colors text-[13px] font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-brandRed rounded p-1.5 md:px-1"
                title="Log out"
              >
                <LogOut size={18} className="md:w-4 md:h-4" />
                <span className="hidden md:inline">Log Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {activeTab === 'Analyze' && (
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6 md:gap-8">
              
              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Analyze Text Card (Left, takes more space) */}
                <section className="lg:col-span-3 bg-cardSurface border border-borderBorder rounded-[4px] p-4 md:p-5 shadow-md flex flex-col min-h-[300px] md:min-h-[380px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white text-[14px] font-semibold">Analyze Text</h3>
                  </div>
                  <form onSubmit={handleAnalyze} className="flex flex-col gap-4 flex-1 h-full">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste datasets or reviews here..."
                      className="w-full bg-inputBg border border-borderBorder rounded-[4px] p-4 text-[14px] text-primaryText placeholder:text-mutedText focus:outline-none focus:border-brandGreen focus:ring-1 focus:ring-brandGreen transition-colors resize-none disabled:opacity-50 flex-1 min-h-[150px]"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !text.trim()}
                      className="w-full bg-brandGreen text-[#051424] font-bold rounded-[4px] py-3 md:py-4 text-[14px] flex items-center justify-center gap-2 transition-all hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-pageBg focus-visible:ring-brandGreen"
                    >
                      {isLoading ? (
                        <><Loader2 className="animate-spin" size={18} /> Processing Signal...</>
                      ) : (
                        'Analyze Signal'
                      )}
                    </button>
                  </form>
                </section>

                {/* Real-time Analysis Result Card (Right) */}
                <section 
                  className="lg:col-span-2 bg-cardSurface border border-borderBorder rounded-[4px] p-4 md:p-5 shadow-md flex flex-col min-h-[300px] lg:min-h-[380px]"
                  aria-live="polite"
                >
                  <h3 className="text-white text-[14px] font-semibold mb-4">Real-time Analysis</h3>
                  
                  {!result ? (
                    <div className="flex-1 border border-dashed border-borderBorder rounded-[4px] flex items-center justify-center text-mutedText text-[13px] bg-pageBg/30 min-h-[200px]">
                      Awaiting input signal...
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col gap-4 md:gap-6 animate-in fade-in duration-300">
                      
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-cardBg border border-borderBorder rounded-[4px] p-3 md:p-4">
                          <div className="text-mutedText text-[10px] md:text-[11px] uppercase tracking-wide font-semibold mb-1">Sentiment</div>
                          <div className={`text-[20px] md:text-[24px] font-bold ${getSentimentColor(result.sentiment)}`}>
                            {result.sentiment}
                          </div>
                        </div>
                        <div className="bg-cardBg border border-borderBorder rounded-[4px] p-3 md:p-4">
                          <div className="text-mutedText text-[10px] md:text-[11px] uppercase tracking-wide font-semibold mb-1">Confidence</div>
                          <div className="text-[20px] md:text-[24px] font-bold text-white">
                            {Math.round(result.confidence * 100)}%
                          </div>
                        </div>
                      </div>

                      <div className="bg-cardBg border border-borderBorder rounded-[4px] p-4 flex-1 flex flex-col">
                         <div className="flex justify-between items-center mb-3">
                            <span className="text-mutedText text-[10px] md:text-[11px] uppercase tracking-wide font-semibold">Confidence Interval</span>
                            <span className="text-mutedText text-[11px]">80% - 99%</span>
                          </div>
                          <div 
                            className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden mb-5"
                            role="progressbar" 
                          >
                            <div 
                              className={`h-full transition-all duration-700 ease-out ${getSentimentBarBg(result.sentiment)}`} 
                              style={{ width: `${Math.round(result.confidence * 100)}%` }}
                            />
                          </div>

                          <div className="text-mutedText text-[10px] md:text-[11px] uppercase tracking-wide font-semibold mb-2 mt-auto">Keywords Extracted</div>
                          <div className="flex flex-wrap gap-2">
                            {getKeywords(result).map((kw, i) => (
                               <span key={i} className="text-[11px] md:text-[12px] bg-inputBg border border-borderBorder text-primaryText px-2 py-1 rounded-[4px] truncate max-w-[120px]">
                                 {kw.toLowerCase()}
                               </span>
                            ))}
                          </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* History View */}
              <section className="bg-cardSurface border border-borderBorder rounded-[4px] shadow-md flex flex-col">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 md:p-5 border-b border-borderBorder gap-3">
                  <h3 className="text-white text-[14px] font-semibold">History View</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {}}
                      disabled={history.length === 0}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 border border-borderBorder rounded-[4px] text-[12px] font-medium text-primaryText hover:bg-cardBg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Download size={14} />
                      Export
                    </button>
                    <button
                      onClick={handleClearHistory}
                      disabled={history.length === 0}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 border border-borderBorder rounded-[4px] text-[12px] font-medium text-mutedText hover:text-brandRed hover:border-brandRed transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={14} />
                      Clear
                    </button>
                  </div>
                </div>

                {history.length === 0 ? (
                  <div className="py-12 text-center text-mutedText text-[13px]">
                    No historical records available.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-cardBg/50 border-b border-borderBorder">
                          <th scope="col" className="py-3 px-4 md:px-5 text-mutedText text-[10px] md:text-[11px] uppercase tracking-wide font-semibold w-[100px] md:w-[140px]">Sentiment</th>
                          <th scope="col" className="py-3 px-4 md:px-5 text-mutedText text-[10px] md:text-[11px] uppercase tracking-wide font-semibold w-[80px] md:w-[120px]">Score</th>
                          <th scope="col" className="py-3 px-4 md:px-5 text-mutedText text-[10px] md:text-[11px] uppercase tracking-wide font-semibold">Source Text</th>
                          <th scope="col" className="py-3 px-4 md:px-5 text-mutedText text-[10px] md:text-[11px] uppercase tracking-wide font-semibold w-[120px] md:w-[140px]">Processed</th>
                        </tr>
                      </thead>
                      <tbody className="text-[12px] md:text-[13px]">
                        {history.map((item, index) => (
                          <tr 
                            key={item.id} 
                            className={`group hover:bg-cardBg/80 transition-colors ${index !== history.length - 1 ? 'border-b border-borderBorder/50' : ''}`}
                          >
                            <td className="py-3 px-4 md:px-5">
                              <span className={`inline-flex items-center justify-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-[4px] text-[10px] md:text-[11px] font-bold uppercase tracking-wider ${getSentimentBg(item.sentiment)}`}>
                                {item.sentiment}
                              </span>
                            </td>
                            <td className="py-3 px-4 md:px-5 text-white font-medium">
                              {Math.round(item.confidence * 100)}%
                            </td>
                            <td className="py-3 px-4 md:px-5 text-primaryText truncate max-w-[200px] md:max-w-[400px]" title={item.text}>
                              {item.text}
                            </td>
                            <td className="py-3 px-4 md:px-5 text-mutedText">
                              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'History' && (
             <div className="max-w-[1400px] mx-auto">
               <h3 className="text-white text-[18px] md:text-[20px] font-semibold mb-2 md:mb-6">Full History View</h3>
               <p className="text-mutedText mb-6 md:mb-8 text-sm">Access and export your entire analysis timeline.</p>
               <div className="bg-cardSurface border border-dashed border-borderBorder rounded-[4px] h-[300px] md:h-[400px] flex items-center justify-center text-mutedText text-sm">
                 History Data Grid Placeholder
               </div>
             </div>
          )}

          {activeTab === 'Settings' && (
             <div className="max-w-[1400px] mx-auto">
               <h3 className="text-white text-[18px] md:text-[20px] font-semibold mb-4 md:mb-6">Settings & Configuration</h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                  <div className="bg-cardSurface border border-borderBorder rounded-[4px] p-5 md:p-6 h-[250px] md:h-[400px]">
                    <h4 className="text-white font-medium mb-2 md:mb-4">Model & Engine Configuration</h4>
                    <p className="text-mutedText text-[13px] md:text-sm">Select active inference models and parameters.</p>
                  </div>
                  <div className="bg-cardSurface border border-borderBorder rounded-[4px] p-5 md:p-6 h-[250px] md:h-[400px]">
                    <h4 className="text-white font-medium mb-2 md:mb-4">Account & Billing</h4>
                    <p className="text-mutedText text-[13px] md:text-sm">Manage API keys and usage limits.</p>
                  </div>
               </div>
             </div>
          )}

          {activeTab === 'API Docs' && (
             <div className="max-w-[1400px] mx-auto">
               <h3 className="text-white text-[18px] md:text-[20px] font-semibold mb-4 md:mb-6">API Documentation</h3>
               <div className="bg-cardSurface border border-borderBorder rounded-[4px] p-8 h-[400px] md:h-[600px] flex items-center justify-center text-center">
                 <p className="text-mutedText text-sm">Swagger/OpenAPI documentation will be rendered here.</p>
               </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-[4px] transition-colors text-[14px] font-medium ${
        isActive 
          ? 'bg-brandGreen/10 text-brandGreen' 
          : 'text-mutedText hover:bg-cardBg hover:text-primaryText'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
