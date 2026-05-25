import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Languages, Sparkles } from 'lucide-react';

type LanguageDemo = {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
  conversation: {
    speaker: 'ai' | 'student';
    text: string;
    highlight?: string;
  }[];
  codeSwitch?: {
    original: string;
    breakdown: { text: string; lang: string }[];
  };
};

const languages: LanguageDemo[] = [
  {
    id: 'hinglish',
    name: 'Hinglish',
    nativeName: 'हिंग्लिश',
    flag: '🇮🇳',
    description: 'Seamless Hindi-English code-switching — the way 80% of urban India actually speaks. No awkward language detection, no forced switches.',
    conversation: [
      { speaker: 'ai', text: 'Aapne B.Tech CSE ke liye inquiry ki thi, right? Kya aapke paas JEE score hai?' },
      { speaker: 'student', text: 'Haan, mera 89 percentile hai. Main South Delhi campus prefer karunga.' },
      { speaker: 'ai', text: 'Great! 89 percentile ke saath merit admission mil jayega. Let me connect you with our counsellor.', highlight: 'Natural code-switching detected' },
    ],
    codeSwitch: {
      original: 'Aapne B.Tech CSE ke liye inquiry ki thi, right?',
      breakdown: [
        { text: 'Aapne', lang: 'Hindi' },
        { text: 'B.Tech CSE', lang: 'English' },
        { text: 'ke liye inquiry ki thi,', lang: 'Hindi' },
        { text: 'right?', lang: 'English' },
      ],
    },
  },
  {
    id: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    description: 'Pure Hindi conversations for students more comfortable in their mother tongue. Natural, conversational, and culturally appropriate.',
    conversation: [
      { speaker: 'ai', text: 'नमस्ते! मैं AdmitIQ से बोल रहा हूँ। आपने B.Sc. कार्यक्रम के लिए जानकारी माँगी थी।' },
      { speaker: 'student', text: 'जी हाँ, मुझे Chemistry में प्रवेश लेना है। मेरे 78% अंक आए हैं।' },
      { speaker: 'ai', text: 'बहुत अच्छा! आप प्रवेश के लिए पात्र हैं। क्या आप छात्रवृत्ति के बारे में भी जानना चाहेंगे?', highlight: 'शुद्ध हिन्दी संवाद' },
    ],
  },
  {
    id: 'english',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    description: 'Professional English conversations for MBA candidates, international students, and premium program inquiries.',
    conversation: [
      { speaker: 'ai', text: 'Good afternoon! This is AdmitIQ calling about your MBA inquiry. You mentioned interest in our PGDM program?' },
      { speaker: 'student', text: 'Yes, I have 3 years at Deloitte and scored 92 percentile in CAT.' },
      { speaker: 'ai', text: 'Excellent profile! You\'d be a strong candidate for our Executive PGDM track. Let me connect you with admissions.', highlight: 'Professional tone calibration' },
    ],
  },
];

function ConversationBubble({
  speaker,
  text,
  highlight,
  delay,
}: {
  speaker: 'ai' | 'student';
  text: string;
  highlight?: string;
  delay: number;
}) {
  const isAI = speaker === 'ai';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold ${
        isAI
          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
          : 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
      }`}>
        {isAI ? 'AI' : 'S'}
      </div>
      <div className="flex flex-col gap-1.5 max-w-[85%]">
        <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
          isAI
            ? 'bg-white/[0.04] text-slate-200 rounded-tl-md'
            : 'bg-violet-500/[0.06] text-slate-200 rounded-tr-md'
        }`}>
          {text}
        </div>
        {highlight && (
          <div className="flex items-center gap-1.5 px-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] text-cyan-400 font-medium">{highlight}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CodeSwitchBreakdown({ data }: { data: LanguageDemo['codeSwitch'] }) {
  if (!data) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
    >
      <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-3">
        Code-Switch Analysis
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.breakdown.map((segment, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className={`px-2.5 py-1.5 rounded-lg text-[12px] font-medium ${
              segment.lang === 'Hindi'
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
            }`}>
              {segment.text}
            </span>
            <span className="text-[9px] text-muted-foreground mt-1 font-mono">{segment.lang}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function MultilingualShowcase() {
  const [activeLanguage, setActiveLanguage] = useState(0);
  const lang = languages[activeLanguage];

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.03)_0%,transparent_60%)]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.03)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.06] mb-6"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">India-First AI</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
          >
            Your students don't speak in{' '}
            <span className="line-through text-muted-foreground/50 decoration-red-500/40">one language</span>.{' '}
            <br className="hidden sm:block" />
            <span className="text-gradient-multi">Neither does AdmitIQ.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            80% of Indian students mix Hindi and English mid-sentence. AdmitIQ handles
            real-world code-switching natively — not as a feature, but as a first principle.
          </motion.p>
        </div>

        {/* Demo */}
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Language Selector */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {languages.map((l, idx) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  onClick={() => setActiveLanguage(idx)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-400 ${
                    activeLanguage === idx
                      ? 'glass-card border-cyan-500/20 bg-cyan-500/[0.03] shadow-[0_0_40px_rgba(34,211,238,0.05)]'
                      : 'border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{l.flag}</span>
                    <div>
                      <div className="text-sm font-bold text-foreground">{l.name}</div>
                      <div className="text-[11px] text-muted-foreground">{l.nativeName}</div>
                    </div>
                    {activeLanguage === idx && (
                      <motion.div
                        layoutId="lang-indicator"
                        className="ml-auto w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                      />
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    {l.description}
                  </p>
                </motion.button>
              ))}
            </div>

            {/* Right: Conversation Preview */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="glass-card rounded-2xl overflow-hidden border-gradient h-full"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[12px] font-semibold text-foreground">{lang.name} Conversation</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono px-2 py-0.5 rounded bg-white/[0.03]">
                    AI Agent Active
                  </span>
                </div>

                {/* Conversation */}
                <div className="p-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={lang.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {lang.conversation.map((line, i) => (
                        <ConversationBubble
                          key={`${lang.id}-${i}`}
                          speaker={line.speaker}
                          text={line.text}
                          highlight={line.highlight}
                          delay={i * 0.15}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  {/* Code-Switch Breakdown (only for Hinglish) */}
                  <AnimatePresence>
                    {lang.codeSwitch && (
                      <CodeSwitchBreakdown data={lang.codeSwitch} />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
