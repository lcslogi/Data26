/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from "react";
import { Copy, Trash2, ClipboardCheck, Terminal, Sparkles, Cpu, Check, ArrowRight, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Custom Toast Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full border backdrop-blur-xl shadow-2xl flex items-center gap-3 min-w-[300px] justify-between ${
      type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
      type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
      'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
    }`}
  >
    <span className="text-sm font-medium tracking-tight">{message}</span>
    <button onClick={onClose} className="hover:opacity-70 transition-opacity">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

export default function App() {
  const [inputText, setInputText] = useState("");
  const [extractedCodes, setExtractedCodes] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toasts, setToasts] = useState<{ id: number, message: string, type: 'success' | 'error' | 'info' }[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const extractCodes = useCallback(() => {
    if (!inputText.trim()) {
      addToast("Por favor, insira algum texto para processar.", "error");
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const regex = /BXQBRS[A-Z0-9]{10}/g;
      const matches = inputText.match(regex);

      if (matches) {
        const uniqueMatches = Array.from(new Set(matches));
        setExtractedCodes(uniqueMatches);
        addToast(`${uniqueMatches.length} código(s) extraído(s) com sucesso!`, "success");
      } else {
        setExtractedCodes([]);
        addToast("Nenhum código válido encontrado.", "error");
      }
      setIsProcessing(false);
    }, 800);
  }, [inputText]);

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
      addToast("Copiado!", "success");
    } catch (err) {
      addToast("Erro ao copiar.", "error");
    }
  };

  const copyAll = async () => {
    if (extractedCodes.length === 0) return;
    const allText = extractedCodes.join("\n");
    await copyToClipboard(allText);
  };

  const clearAll = () => {
    setInputText("");
    setExtractedCodes([]);
    addToast("Campos limpos.", "info");
  };

  return (
    <div className="min-h-screen bg-[#000] text-white font-sans selection:bg-white/30 selection:text-white overflow-x-hidden relative antialiased">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
          />
        ))}
      </AnimatePresence>
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-zinc-800 rounded-full blur-[160px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.2, 0.15],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-zinc-900 rounded-full blur-[200px]" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-500">System Core v1.0.4</span>
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-6xl md:text-7xl font-bold tracking-[-0.04em] leading-[0.95] text-white">
                Data <span className="text-zinc-600">Cleansing</span>
              </h1>
              <p className="text-zinc-500 text-xl md:text-2xl font-light tracking-tight max-w-lg leading-snug">
                Extração de alta precisão com processamento determinístico e design minimalista.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-5"
          >
            <button 
              onClick={clearAll}
              className="rounded-full h-12 px-8 text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all duration-500 font-medium tracking-tight flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2.5 opacity-50" />
              Limpar
            </button>
            <button 
              onClick={extractCodes}
              disabled={isProcessing}
              className="rounded-full h-12 px-10 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] font-semibold tracking-tight group relative overflow-hidden flex items-center"
            >
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div 
                    key="processing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center"
                  >
                    <Loader2 className="w-4 h-4 mr-2.5 animate-spin" />
                    Scanning...
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center"
                  >
                    <Sparkles className="w-4 h-4 mr-2.5 group-hover:rotate-12 transition-transform duration-500" />
                    Processar
                    <ArrowRight className="w-4 h-4 ml-2.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Input Area */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="relative group">
              <motion.div 
                animate={{ opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[32px] group-hover:opacity-40 transition-opacity duration-1000" 
              />
              
              <div className="relative bg-[#0a0a0a]/60 backdrop-blur-[40px] border border-white/[0.05] rounded-[32px] p-8 space-y-6 shadow-2xl shadow-black/50 overflow-hidden">
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div 
                      initial={{ top: "-10%" }}
                      animate={{ top: "110%" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
                      Input Stream
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-700 tracking-widest uppercase">
                    UTF-8 • Encrypted
                  </div>
                </div>
                
                <textarea
                  placeholder="Cole aqui o texto sujo para iniciar a extração..."
                  className="w-full min-h-[480px] bg-transparent border-none focus:outline-none text-zinc-200 font-mono text-base leading-relaxed resize-none p-0 placeholder:text-zinc-800 selection:bg-white/10"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-wrap items-center gap-8 px-6 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.25em]"
            >
              <span className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 shadow-[0_0_8px_rgba(255,255,255,0.05)]" />
                BXQBRS Prefix Required
              </span>
              <span className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 shadow-[0_0_8px_rgba(255,255,255,0.05)]" />
                16 Character Length
              </span>
              <span className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 shadow-[0_0_8px_rgba(255,255,255,0.05)]" />
                Alphanumeric Only
              </span>
            </motion.div>
          </motion.div>

          {/* Results Area */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="bg-white/[0.01] backdrop-blur-[50px] border border-white/[0.08] rounded-[32px] h-[620px] flex flex-col overflow-hidden shadow-2xl shadow-black/50">
              <div className="border-b border-white/[0.05] p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Resultados</h2>
                    <p className="text-zinc-600 text-sm font-light tracking-tight">
                      {extractedCodes.length} identificadores processados
                    </p>
                  </div>
                  <AnimatePresence>
                    {extractedCodes.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <button 
                          onClick={copyAll}
                          className="rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white h-10 px-5 transition-all duration-500 font-medium tracking-tight flex items-center"
                        >
                          <ClipboardCheck className="w-4 h-4 mr-2.5 opacity-60" />
                          Copiar Tudo
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex-1 p-0 overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {extractedCodes.length > 0 ? (
                      <div className="space-y-4">
                        {extractedCodes.map((code, index) => (
                          <motion.div
                            key={code}
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                            className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500"
                          >
                            <code className="text-zinc-400 font-mono text-sm tracking-[0.1em] group-hover:text-white transition-colors duration-500">
                              {code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(code, code)}
                              className="h-9 w-9 rounded-full text-zinc-700 group-hover:text-white group-hover:bg-white/10 transition-all duration-500 flex items-center justify-center"
                            >
                              <AnimatePresence mode="wait">
                                {copiedId === code ? (
                                  <motion.div
                                    key="check"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                  >
                                    <Check className="w-4 h-4 text-emerald-500" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="copy"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-800 space-y-6 py-24">
                        <motion.div 
                          animate={{ 
                            opacity: [0.1, 0.2, 0.1],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="p-6 rounded-full bg-white/[0.01] border border-white/[0.03] shadow-inner"
                        >
                          <Terminal className="w-10 h-10 opacity-10" />
                        </motion.div>
                        <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-30">Aguardando Stream</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer Info */}
        <footer className="pt-16 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] text-zinc-700 font-bold uppercase tracking-[0.35em]">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="flex flex-wrap justify-center items-center gap-10"
          >
            <span className="flex items-center gap-3">
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" 
              />
              Secure Validation
            </span>
            <span className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              Deterministic Extraction
            </span>
            <span className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              Real-time Processing
            </span>
          </motion.div>
          <div className="text-zinc-800 font-medium">
            Designed by Apple Style • Expert System v1.0.4
          </div>
        </footer>
      </div>
    </div>
  );
}
