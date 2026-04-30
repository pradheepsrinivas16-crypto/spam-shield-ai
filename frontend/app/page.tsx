"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Send } from 'lucide-react';

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text) return;
    setLoading(true);
    try {
const handleScan = async () => {
  if (!message) return;
  setLoading(true);

  try {
    // PASTE YOUR NEW CODE HERE 👇
    const response = await fetch('https://spam-shield-backend.onrender.com/analyze', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message }),
    });
    // PASTE ENDS HERE 👆

    const data = await response.json();
    setResult(data);
  } catch (error) {
    console.error("Analysis failed", error);
    alert("Backend not responding. It might be 'waking up'—wait 30 seconds and try again!");
  } finally {
    setLoading(false);
  }
};
    } catch (err) {
      alert("Backend not running! Make sure to start your Python terminal.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white p-4 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-xl space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            AI Spam Shield
          </h1>
          <p className="text-slate-400">Enterprise Grade Message Analysis</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-1 rounded-2xl shadow-2xl backdrop-blur-xl">
          <textarea 
            className="w-full bg-transparent p-6 text-lg outline-none resize-none h-40 placeholder:text-slate-600"
            placeholder="Enter message to scan..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="p-4 border-t border-slate-800 flex justify-end">
            <button 
              onClick={analyze}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              {loading ? "Scanning..." : <><Send size={18}/> Scan Message</>}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-6 rounded-2xl border-2 shadow-2xl ${
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
    </main>
  );
}