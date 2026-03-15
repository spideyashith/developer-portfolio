'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minimize2 } from 'lucide-react';

type Message = {
  id: number;
  from: 'alien' | 'user';
  text: string;
};

const RESPONSES: Record<string, string> = {
  default: "Greetings, Commander. I am XENITH — your AI liaison. Ask me about the pilot's skills, projects, or mission availability.",
  hello: "Greetings, Commander! XENITH online. How may I assist your mission briefing today?",
  hi: "Greetings, Commander! XENITH online. How may I assist your mission briefing today?",
  "who are you": "I am XENITH, an alien intelligence assigned to brief visitors on Commander's capabilities. What intel do you seek?",
  "who is the commander": "The Commander is an MSc Software Technology student and AI/ML Research Intern — a full-stack engineer specializing in intelligent, scalable systems. Currently deployed in medical tech AI research.",
  "about": "Commander profile: MSc Software Technology | AI/ML Research Intern | MERN Stack | Python | OpenCV. Currently researching non-invasive predictive models for medical diagnostics.",
  "skills": "Commander's arsenal includes: NLP (T5, BART), Hugging Face, Python, OpenCV, Next.js, MERN Stack, TypeScript, C#, .NET. Formidable across all quadrants.",
  "projects": "Three missions on record: s4holidays (MERN travel platform), Stress Management Tool (law enforcement hackathon), and Sclera Extraction (computer vision pipeline). Select one in the Mission Archives for deeper intel.",
  "freelance": "Commander is available for freelance engagements. Specialties: full-stack web apps, AI/ML pipelines, computer vision, and data-driven applications. Transmit your request via the Comms Array!",
  "available": "Affirmative — Commander is accepting new missions. Use the Comms Array terminal at the bottom of this vessel to transmit your project brief. A response will be dispatched within 48 standard hours.",
  "hire": "To deploy Commander on your project, navigate to the Comms Array section below and transmit your mission brief! Full-stack dev, AI/ML, and research roles welcome.",
  "contact": "Use the Comms Array section at the bottom of this ship! Input your designation, comms link, and transmission data. Commander will respond swiftly.",
  "experience": "Commander's flight path: BCA (Padua College, 2021–2024) → MSc Software Technology (St. Aloysius University, 2024–Present) → AI/ML Research Intern (St. Aloysius University, 2026–Present).",
  "education": "Trajectory: BCA at Padua College (2021–2024), then MSc Software Technology at St. Aloysius Deemed University (2024–Present). Currently also serving as AI/ML Research Intern.",
  "research": "Commander's active research: Developing non-invasive predictive models for Adult Jaundice detection using ML. Deployed at St. Aloysius (Deemed to be University), 2026–Present.",
};

const SUGGESTIONS = [
  "Who is the Commander?",
  "What are the skills?",
  "Available for freelance?",
  "How to hire?",
  "Tell me about the projects",
];

function findResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const key of Object.keys(RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) {
      return RESPONSES[key];
    }
  }
  return "Interesting query, Commander. My databanks suggest you consult the relevant section of this vessel — or ask about: skills, projects, freelance, experience, or contact.";
}

let msgCounter = 0;

export default function AlienChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: ++msgCounter, from: 'alien', text: RESPONSES.default },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: ++msgCounter, from: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply = findResponse(trimmed);
      setMessages(prev => [...prev, { id: ++msgCounter, from: 'alien', text: reply }]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-80 md:w-96 h-[480px] flex flex-col bg-obsidian border border-cyan/40 rounded-lg shadow-[0_0_30px_rgba(0,243,255,0.2)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-obsidian-light border-b border-cyan/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-cyan/20 border border-cyan flex items-center justify-center text-base">
                    👾
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border border-obsidian" />
                </div>
                <div>
                  <div className="font-sans font-bold text-cyan text-sm tracking-wider">XENITH</div>
                  <div className="font-mono text-xs text-cyan/50">Alien AI Liaison • Online</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-cyan/50 hover:text-cyan transition-colors">
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 leading-relaxed ${
                      msg.from === 'alien'
                        ? 'bg-obsidian-light border border-cyan/30 text-foreground/90'
                        : 'bg-plasma-blue/20 border border-plasma-blue/50 text-white'
                    }`}
                  >
                    {msg.from === 'alien' && (
                      <span className="text-cyan text-xs block mb-1">XENITH:</span>
                    )}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
              {SUGGESTIONS.slice(0, 3).map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="flex-shrink-0 text-xs font-mono px-2 py-1 border border-plasma-blue/40 text-plasma-blue hover:bg-plasma-blue/20 rounded-sm transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 pb-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Transmit query..."
                className="flex-1 bg-obsidian-light border border-cyan/30 text-white font-mono text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-cyan focus:shadow-[0_0_8px_rgba(0,243,255,0.2)] transition-all"
              />
              <button
                onClick={() => sendMessage(input)}
                className="w-9 h-9 bg-cyan/20 border border-cyan hover:bg-cyan/40 flex items-center justify-center text-cyan rounded-sm transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button - Alien Avatar */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        className="relative w-16 h-16 rounded-full bg-obsidian border-2 border-cyan flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.7)] transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: ['0 0 15px rgba(0,243,255,0.3)', '0 0 30px rgba(0,243,255,0.6)', '0 0 15px rgba(0,243,255,0.3)'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isOpen ? <X className="w-6 h-6 text-cyan" /> : '👾'}
        {/* Pulse ring */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan"
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {/* Notification dot */}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-alert-amber border-2 border-obsidian flex items-center justify-center">
            <span className="text-[8px] font-bold text-obsidian">!</span>
          </div>
        )}
      </motion.button>

    </div>
  );
}
