import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Globe, Mic, MicOff, CheckCircle2 } from 'lucide-react';

/* ─── Conversation Data ─── */
type ConversationLine = {
  speaker: 'ai' | 'student';
  text: string;
  slots?: { key: string; value: string }[];
  thinking?: boolean;
};

type ConversationScenario = {
  id: string;
  language: string;
  flag: string;
  label: string;
  lines: ConversationLine[];
};

const scenarios: ConversationScenario[] = [
  {
    id: 'hinglish',
    language: 'Hinglish',
    flag: '🇮🇳',
    label: 'Hindi-English Mix',
    lines: [
      { speaker: 'ai', text: 'Namaste! Main AdmitIQ se bol raha hoon, Delhi Technical University ki taraf se. Aapne recently B.Tech ke liye inquiry ki thi, right?' },
      { speaker: 'student', text: 'Haan ji, maine Computer Science mein interest dikhaya tha.' },
      { speaker: 'ai', text: 'Great! CSE ek excellent choice hai. Kya aapke paas JEE Mains ka score hai?', thinking: true },
      { speaker: 'student', text: 'Ji haan, mera 89 percentile aaya hai is saal.' },
      { speaker: 'ai', text: 'Bahut achha! 89 percentile ke saath aap merit-based admission ke liye eligible hain. Aapka preferred campus konsa hai — East Delhi ya South?', slots: [{ key: 'JEE Score', value: '89 %ile' }, { key: 'Course', value: 'B.Tech CSE' }] },
      { speaker: 'student', text: 'South campus prefer karunga, hostel facility chahiye.' },
      { speaker: 'ai', text: 'Perfect, South campus mein hostel available hai. Aapko ek senior counsellor se connect karte hain jo admission process aur fees detail mein samjhayenge. Kya aapke liye aaj 3 PM ka slot theek rahega?', slots: [{ key: 'Campus', value: 'South Delhi' }, { key: 'Hostel', value: 'Required' }] },
    ],
  },
  {
    id: 'english',
    language: 'English',
    flag: '🇬🇧',
    label: 'Professional English',
    lines: [
      { speaker: 'ai', text: 'Good afternoon! This is AdmitIQ calling on behalf of IMS Business School. You recently expressed interest in our MBA program — is this a good time to chat?' },
      { speaker: 'student', text: 'Yes, I wanted to know about the PGDM program actually.' },
      { speaker: 'ai', text: 'Of course! We offer a 2-year PGDM with specializations in Finance, Marketing, and Analytics. Do you have prior work experience?', thinking: true },
      { speaker: 'student', text: 'I have 3 years in consulting at Deloitte.' },
      { speaker: 'ai', text: 'Excellent background! With 3 years at Deloitte, you\'d be a strong candidate for our Executive PGDM track. Have you taken the CAT or GMAT?', slots: [{ key: 'Experience', value: '3 yrs - Deloitte' }, { key: 'Program', value: 'Executive PGDM' }] },
      { speaker: 'student', text: 'I scored 92 percentile in CAT last year.' },
      { speaker: 'ai', text: 'That\'s a competitive score. I\'ll connect you with our admissions director who can walk you through scholarships and the application timeline. Would tomorrow morning work?', slots: [{ key: 'CAT Score', value: '92 %ile' }, { key: 'Intent Level', value: 'High' }] },
    ],
  },
  {
    id: 'hindi',
    language: 'Hindi',
    flag: '🇮🇳',
    label: 'शुद्ध हिन्दी',
    lines: [
      { speaker: 'ai', text: 'नमस्ते! मैं AdmitIQ से बोल रहा हूँ, राजस्थान विश्वविद्यालय की ओर से। आपने हाल ही में B.Sc. कार्यक्रम के लिए जानकारी माँगी थी।' },
      { speaker: 'student', text: 'हाँ जी, मुझे B.Sc. Chemistry में प्रवेश लेना है।' },
      { speaker: 'ai', text: 'बहुत अच्छा! क्या आपने इस वर्ष बारहवीं कक्षा की परीक्षा दी है? आपके अंक कितने आए?', thinking: true },
      { speaker: 'student', text: 'जी हाँ, मेरे 78 प्रतिशत अंक आए हैं विज्ञान विषय में।' },
      { speaker: 'ai', text: '78 प्रतिशत बहुत अच्छे हैं! आप सामान्य प्रवेश के लिए पात्र हैं। क्या आप छात्रवृत्ति के बारे में भी जानना चाहेंगे?', slots: [{ key: 'विषय', value: 'B.Sc. Chemistry' }, { key: 'अंक', value: '78%' }] },
      { speaker: 'student', text: 'हाँ, छात्रवृत्ति की जानकारी बहुत जरूरी है।' },
      { speaker: 'ai', text: 'ज़रूर! मैं आपको हमारे प्रवेश सलाहकार से जोड़ता हूँ जो छात्रवृत्ति और शुल्क की पूरी जानकारी देंगे। कल सुबह 11 बजे का समय ठीक रहेगा?', slots: [{ key: 'छात्रवृत्ति', value: 'रुचि है' }, { key: 'स्तर', value: 'उच्च' }] },
    ],
  },
];

/* ─── Waveform for demo ─── */
function DemoWaveform({ active, barCount = 48 }: { active: boolean; barCount?: number }) {
  return (
    <div className="flex items-center justify-center gap-[2px] h-10">
      {Array.from({ length: barCount }).map((_, i) => {
        const base = Math.sin((i / barCount) * Math.PI) * 0.6 + 0.4;
        return (
          <motion.div
            key={i}
            className="w-[2px] rounded-full bg-gradient-to-t from-cyan-500/50 to-cyan-300/80"
            animate={
              active
                ? { height: [`${base * 15}%`, `${base * 100}%`, `${base * 20}%`] }
                : { height: '12%' }
            }
            transition={
              active
                ? { duration: 0.8 + Math.random() * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.03 }
                : { duration: 0.5 }
            }
          />
        );
      })}
    </div>
  );
}

/* ─── Slot Extraction Pill ─── */
function SlotPill({ slotKey, value }: { slotKey: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20"
    >
      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
      <span className="text-[11px] text-muted-foreground font-medium">{slotKey}:</span>
      <span className="text-[11px] text-emerald-400 font-semibold">{value}</span>
    </motion.div>
  );
}

export function LiveAIDemo() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [extractedSlots, setExtractedSlots] = useState<{ key: string; value: string }[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const scenario = scenarios[activeScenario];
  const lines = scenario.lines;

  // Reset when scenario changes
  useEffect(() => {
    setVisibleLines(0);
    setCurrentChar(0);
    setExtractedSlots([]);
  }, [activeScenario]);

  // Typing effect
  useEffect(() => {
    if (visibleLines >= lines.length) {
      const resetTimer = setTimeout(() => {
        setVisibleLines(0);
        setCurrentChar(0);
        setExtractedSlots([]);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }

    const currentLine = lines[visibleLines];
    if (currentChar < currentLine.text.length) {
      const speed = currentLine.speaker === 'ai' ? 18 : 22;
      const timer = setTimeout(() => setCurrentChar((p) => p + 1), speed + Math.random() * 12);
      return () => clearTimeout(timer);
    } else {
      // Line complete — extract slots if present
      if (currentLine.slots) {
        setExtractedSlots((prev) => [...prev, ...currentLine.slots!]);
      }
      const timer = setTimeout(() => {
        setVisibleLines((p) => p + 1);
        setCurrentChar(0);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, currentChar, lines]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [visibleLines, currentChar]);

  const isCallActive = visibleLines < lines.length;
  const currentSpeaker = visibleLines < lines.length ? lines[visibleLines].speaker : null;

  return (
    <section id="demo" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] mb-6"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Live Demo</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
          >
            Hear AdmitIQ{' '}
            <span className="text-gradient-cyan">in conversation.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Watch a real qualification call unfold. The AI speaks naturally, switches languages mid-sentence,
            and extracts structured data in real-time.
          </motion.p>
        </div>

        {/* Demo Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl overflow-hidden border-gradient">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isCallActive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-600'}`} />
                <span className="text-sm font-medium text-foreground">
                  {isCallActive ? 'Call Active' : 'Call Complete'}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono px-2 py-0.5 rounded bg-white/[0.03]">
                  {scenario.language}
                </span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1">
                {scenarios.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveScenario(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-300 ${
                      activeScenario === idx
                        ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
                    }`}
                  >
                    <span>{s.flag}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
              {/* Left: Call Interface */}
              <div className="lg:col-span-3 p-6">
                {/* AI Speaking Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      currentSpeaker === 'ai' ? 'bg-cyan-500/15 border border-cyan-500/25' : 'bg-white/[0.04] border border-white/[0.06]'
                    } transition-all duration-500`}>
                      {currentSpeaker === 'ai' ? (
                        <Mic className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <MicOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {currentSpeaker === 'ai' ? 'AdmitIQ Agent' : currentSpeaker === 'student' ? 'Student Speaking' : 'Call Ended'}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {currentSpeaker === 'ai' ? 'AI is speaking...' : currentSpeaker === 'student' ? 'Listening...' : 'Qualification complete'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground font-mono">{scenario.language}</span>
                  </div>
                </div>

                {/* Waveform */}
                <div className="mb-5 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] px-4">
                  <DemoWaveform active={isCallActive} />
                </div>

                {/* Transcript */}
                <div
                  ref={transcriptRef}
                  className="space-y-3 max-h-[320px] overflow-y-auto no-scrollbar pr-2"
                >
                  {lines.slice(0, visibleLines + 1).map((line, idx) => {
                    const isCurrentLine = idx === visibleLines;
                    const displayText = isCurrentLine && visibleLines < lines.length
                      ? line.text.slice(0, currentChar)
                      : line.text;
                    const isAI = line.speaker === 'ai';

                    return (
                      <motion.div
                        key={`${activeScenario}-${idx}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold ${
                          isAI
                            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                            : 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
                        }`}>
                          {isAI ? 'AI' : 'S'}
                        </div>
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                          isAI
                            ? 'bg-white/[0.04] text-slate-200 rounded-tl-md'
                            : 'bg-violet-500/[0.06] text-slate-200 rounded-tr-md'
                        }`}>
                          {displayText}
                          {isCurrentLine && visibleLines < lines.length && currentChar < line.text.length && (
                            <span className="inline-block w-[2px] h-[14px] bg-cyan-400 ml-0.5 animate-typing-cursor" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Extracted Intelligence */}
              <div className="lg:col-span-2 p-6 bg-white/[0.01]">
                <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-4">
                  Extracted Intelligence
                </div>

                {/* Extracted Slots */}
                <div className="space-y-2 mb-6">
                  <AnimatePresence mode="popLayout">
                    {extractedSlots.length > 0 ? (
                      extractedSlots.map((slot, i) => (
                        <SlotPill key={`${slot.key}-${i}`} slotKey={slot.key} value={slot.value} />
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[12px] text-muted-foreground/60 italic py-8 text-center"
                      >
                        AI is extracting data from conversation...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Qualification Progress */}
                <div className="mt-auto space-y-3">
                  <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-3">
                    Qualification Progress
                  </div>
                  {[
                    { label: 'Course Interest', filled: visibleLines >= 1 },
                    { label: 'Eligibility Score', filled: visibleLines >= 3 },
                    { label: 'Campus Preference', filled: visibleLines >= 5 },
                    { label: 'Counsellor Slot', filled: visibleLines >= 6 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all duration-500 ${
                        item.filled
                          ? 'bg-emerald-500/20 border border-emerald-500/30'
                          : 'bg-white/[0.03] border border-white/[0.06]'
                      }`}>
                        {item.filled && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <span className={`text-[12px] font-medium transition-colors duration-500 ${
                        item.filled ? 'text-foreground' : 'text-muted-foreground/60'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CRM Push Status */}
                <motion.div
                  animate={{ opacity: visibleLines >= lines.length ? 1 : 0.3 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      visibleLines >= lines.length
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                        : 'bg-slate-600'
                    }`} />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      CRM Sync
                    </span>
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    {visibleLines >= lines.length
                      ? 'Lead enriched & pushed to CRM ✓'
                      : 'Waiting for call completion...'}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
