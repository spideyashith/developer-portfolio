'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, XCircle, Loader2, Github, Linkedin, Mail, Phone } from 'lucide-react';

export default function CommsArray() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // ── Web3Forms — sends an email to ashithfernandes25@gmail.com ──
      // 1. Go to https://web3forms.com/ and enter ashithfernandes25@gmail.com
      // 2. Copy your Access Key and replace the placeholder below
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',  // ← replace with your real key
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `🚀 New Transmission from ${formData.name} — Commander Portfolio`,
          from_name: 'Commander Portfolio',
          to: 'ashithfernandes25@gmail.com',
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Web3Forms returned error');
      }
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="comms-array" className="py-24 px-6 md:px-20 relative min-h-[80vh] flex flex-col justify-between">
      
      <div className="max-w-4xl mx-auto w-full z-10">
        
        {/* Header */}
        <div className="mb-12 border-l-4 border-alert-amber pl-4 text-center md:text-left md:border-l-0 md:border-b-4 pb-4">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-alert-amber tracking-widest uppercase">
            Comms Array
          </h2>
          <div className="text-foreground/70 font-mono mt-2 text-sm uppercase">Section 06 // Encrypted Transmission</div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Email Card */}
          <motion.a
            href="mailto:ashithfernandes25@gmail.com"
            className="group flex items-center gap-4 p-4 rounded-lg border border-cyan/25 bg-obsidian-light/30 backdrop-blur-sm hover:border-cyan/60 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-11 h-11 rounded-full border border-cyan/40 flex items-center justify-center bg-cyan/5 group-hover:bg-cyan/15 transition-colors">
              <Mail className="w-5 h-5 text-cyan" />
            </div>
            <div className="font-mono">
              <div className="text-xs text-cyan/50 uppercase tracking-widest">Comms Link</div>
              <div className="text-foreground/80 text-sm">ashithfernandes25@gmail.com</div>
            </div>
          </motion.a>

          {/* Phone Card */}
          <motion.a
            href="tel:+916366053700"
            className="group flex items-center gap-4 p-4 rounded-lg border border-cyan/25 bg-obsidian-light/30 backdrop-blur-sm hover:border-cyan/60 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-11 h-11 rounded-full border border-cyan/40 flex items-center justify-center bg-cyan/5 group-hover:bg-cyan/15 transition-colors">
              <Phone className="w-5 h-5 text-cyan" />
            </div>
            <div className="font-mono">
              <div className="text-xs text-cyan/50 uppercase tracking-widest">Direct Frequency</div>
              <div className="text-foreground/80 text-sm">+91 6366053700</div>
            </div>
          </motion.a>
        </div>

        {/* Encrypted Terminal Form */}
        <motion.div 
            className="bg-obsidian-light/40 border border-alert-amber/30 rounded-lg p-6 md:p-10 backdrop-blur-md relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {/* Terminal Top Bar */}
            <div className="flex items-center gap-2 mb-8 border-b border-alert-amber/20 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 font-mono text-xs text-alert-amber/70 uppercase tracking-widest">Secure Link Established</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 font-mono">
                
                <div className="space-y-2">
                    <label htmlFor="name" className="text-cyan text-sm">{`> IDENTIFIER (Name)`}</label>
                    <input 
                        type="text" 
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-obsidian border border-cyan/30 text-white p-3 rounded-sm focus:outline-none focus:border-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                        placeholder="Enter your designation..."
                        disabled={status === 'sending'}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-cyan text-sm">{`> COMMS LINK (Email)`}</label>
                    <input 
                        type="email" 
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-obsidian border border-cyan/30 text-white p-3 rounded-sm focus:outline-none focus:border-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                        placeholder="Establish return vector..."
                        disabled={status === 'sending'}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-cyan text-sm">{`> TRANSMISSION DATA (Message)`}</label>
                    <textarea 
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-obsidian border border-cyan/30 text-white p-3 rounded-sm focus:outline-none focus:border-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all resize-none"
                        placeholder="Input encrypted message array..."
                        disabled={status === 'sending'}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full md:w-auto px-8 py-3 bg-alert-amber/10 border border-alert-amber text-alert-amber hover:bg-alert-amber hover:text-obsidian transition-colors flex items-center justify-center gap-3 font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {status === 'idle' && <><Send className="w-4 h-4" /> Transmit Data</>}
                    {status === 'sending' && <><Loader2 className="w-4 h-4 animate-spin" /> Encrypting...</>}
                    {status === 'success' && <><CheckCircle className="w-4 h-4" /> Sent</>}
                    {status === 'error' && <><XCircle className="w-4 h-4" /> Failed</>}
                </button>

            </form>

            {/* Toast Notification Overlay */}
            <AnimatePresence>
                {(status === 'success' || status === 'error') && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`absolute top-4 right-4 p-4 rounded-sm border backdrop-blur-md flex items-center gap-3 font-mono text-sm tracking-wide ${
                            status === 'success' 
                                ? 'bg-cyan/10 border-cyan text-cyan' 
                                : 'bg-red-500/10 border-red-500 text-red-400'
                        }`}
                    >
                        {status === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        {status === 'success' ? 'TRANSMISSION SUCCESSFUL. DATA RECEIVED.' : 'TRANSMISSION FAILED. RETRY COMMS LINK.'}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-cyan/20 pt-8 flex flex-col items-center justify-center gap-6 z-10 relative">
          <div className="flex items-center gap-8">
              <a href="https://github.com/spideyashith" target="_blank" rel="noopener noreferrer" className="text-cyan/60 hover:text-cyan hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] transition-all transform hover:scale-110">
                  <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/ashith-fernandes-22a0252b3/" target="_blank" rel="noopener noreferrer" className="text-cyan/60 hover:text-cyan hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] transition-all transform hover:scale-110">
                  <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:ashithfernandes25@gmail.com" className="text-cyan/60 hover:text-cyan hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] transition-all transform hover:scale-110">
                  <Mail className="w-6 h-6" />
              </a>
              <a href="tel:+916366053700" className="text-cyan/60 hover:text-cyan hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] transition-all transform hover:scale-110">
                  <Phone className="w-6 h-6" />
              </a>
          </div>
          <div className="font-mono text-xs text-foreground/40 text-center">
              © 2026 Commander Ashith Fernandes. All systems operational.
          </div>
      </footer>

    </section>
  );
}
