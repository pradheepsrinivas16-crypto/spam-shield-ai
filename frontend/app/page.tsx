"use client";
import { useState, useEffect } from 'react'; // Added useEffect to load history
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Send } from 'lucide-react';

export default function Home() {
  const [text, setText] = useState(""); 
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<{text: string, result: string, date: string}[]>([]);
  const [loading, setLoading] = useState(false);

  // Load history from local storage when the page first opens
  useEffect(() => {
    const saved = localStorage.getItem("spam_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleScan = async () => {
    if (!text) return; 
    setLoading(true);
    setResult(null);

    try {
      console.log("Sending request to Render...");
      const response = await fetch('https://spam-shield-backend.onrender.com/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text }), 
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setResult(data);

      // Save to history state and local storage
      const newEntry = { text, result: data.result, date: new Date().toLocaleTimeString() };
      const updatedHistory = [newEntry, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem("spam_history", JSON.stringify(updatedHistory));
      
    } catch (error) {
      console.error("Error:", error);
      alert("Render is waking up! Please wait 1 minute and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white p-4 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-xl space-y-8 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            AI Spam Shield
          </h1>
          <p className="text-slate-400">Enterprise Grade Message Analysis</p>
        </div>

        {/* Input Area */}
        <div className="w-full bg-slate-900/50 border border-slate-800 p-1 rounded-2xl shadow-2xl backdrop-blur-xl">
          <textarea 
            className="w-full bg-transparent p-6 text-lg outline-none resize-none h-40 placeholder:text-slate-600"
            placeholder="Enter message to scan..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="p-4 border-t border-slate-800 flex justify-end">
            <button 
              onClick={handleScan}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              {loading ? "Scanning..." : <><Send size={18}/> Scan Message</>}
            </button>
          </div>
        </div>

        {/* Result Area */}
        <div className="w-full min-h-[120px]">
          <AnimatePresence mode="wait">
            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 rounded-2xl border-2 shadow-2xl w-full ${
                  result.result === 'SPAM' ? 'bg-red-500/10 border-red-500/50' : 'bg-emerald-500/10 border-emerald-500/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${result.result === 'SPAM' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                    {result.result === 'SPAM' ? <ShieldAlert /> : <ShieldCheck />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic tracking-widest">{result.result}</h2>
                    <p className="text-slate-300 font-medium">{result.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- HISTORY SECTION --- */}
        {history.length > 0 && (
          <div className="mt-8 w-full max-w-md">
            <h3 className="text-white/70 text-sm font-semibold mb-3 uppercase tracking-wider">Recent Scans</h3>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="bg-white/5 border border-white/10 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-white/80 truncate mr-4">{item.text}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${item.result === 'SPAM' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {item.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}