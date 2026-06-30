import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, TrendingUp, PiggyBank, AlertTriangle, Lightbulb } from 'lucide-react'
import { useAIChat } from '@/hooks/useFinance'

const EASE_CUSTOM = [0.25, 0.1, 0.25, 1] as [number,number,number,number]

const SUGGESTIONS = [
  'How can I reduce my monthly expenses?',
  "What's a good savings rate for my income?",
  'Help me create a budget plan',
  'How do I start investing?',
  'Tips for reaching my savings goals faster',
  'Analyze my spending patterns',
]

const INSIGHT_CARDS = [
  { icon: TrendingUp,    label: 'Spending trend', value: '+12%', desc: 'vs last month',  color: '#EF4444', bg: 'rgba(239,68,68,0.08)'   },
  { icon: PiggyBank,     label: 'Savings rate',   value: '28%',  desc: 'on track',       color: '#10B981', bg: 'rgba(16,185,129,0.08)'  },
  { icon: AlertTriangle, label: 'Alerts',          value: '2',    desc: 'review needed',  color: '#F59E0B', bg: 'rgba(245,158,11,0.08)'  },
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#2563EB' }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15, ease: 'easeInOut' }} />
      ))}
    </div>
  )
}

interface Message { role: 'user' | 'assistant'; content: string }

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE_CUSTOM }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
          <Sparkles size={14} className="text-white" />
        </div>
      )}
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
        style={{
          background: isUser ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : 'var(--c-s2)',
          color: isUser ? 'white' : 'var(--c-text)',
          border: isUser ? 'none' : '1px solid var(--c-border)',
        }}>
        {String(msg.content)}
      </div>
    </motion.div>
  )
}

export default function AIAdvisor() {
  const aiChat = useAIChat()
  const [input, setInput]     = useState('')
  const [history, setHistory] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m your AI financial advisor. Ask me anything about budgeting, saving, or investing — or pick a suggestion on the left.' },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    setHistory(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    aiChat.mutate(
      text.trim(),
      {
        onSuccess: (data: any) => {
          const reply = String(data?.response || data?.message || 'Let me check that for you.')
          setHistory(prev => [...prev, { role: 'assistant', content: reply }])
          setIsTyping(false)
        },
        onError: () => {
          setHistory(prev => [
            ...prev,
            { role: 'assistant', content: 'Sorry, I couldn\'t connect right now. Please try again.' },
          ])
          setIsTyping(false)
        },
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  return (
    <div className="flex gap-5 h-[calc(100vh-7rem)]">

      {/* Left panel */}
      <div className="hidden lg:flex w-64 shrink-0 flex-col gap-4 overflow-y-auto">
        {/* Snapshot */}
        <div className="rounded-2xl p-4 space-y-2"
          style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--c-text3)' }}>
            Your snapshot
          </p>
          {INSIGHT_CARDS.map(({ icon: Icon, label, value, desc, color, bg }) => (
            <div key={label} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: bg }}>
              <Icon size={16} style={{ color }} />
              <div>
                <p className="text-[11px]" style={{ color: 'var(--c-text3)' }}>{label}</p>
                <p className="text-[14px] font-bold num" style={{ color }}>
                  {value} <span className="text-[11px] font-normal" style={{ color: 'var(--c-text3)' }}>{desc}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={13} style={{ color: '#F59E0B' }} />
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--c-text3)' }}>
              Try asking
            </p>
          </div>
          <div className="space-y-1.5">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className="w-full text-left px-3 py-2 rounded-xl text-[12px] leading-snug transition-all"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-text2)', background: 'transparent' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(37,99,235,0.06)'
                  el.style.color = '#2563EB'
                  el.style.borderColor = 'rgba(37,99,235,0.25)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.color = 'var(--c-text2)'
                  el.style.borderColor = 'var(--c-border)'
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden"
        style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 shrink-0"
          style={{ borderBottom: '1px solid var(--c-border)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--c-text)' }}>AI Advisor</p>
            <p className="text-[11px]" style={{ color: '#10B981' }}>● Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <AnimatePresence initial={false}>
            {history.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm"
                style={{ background: 'var(--c-s2)', border: '1px solid var(--c-border)' }}>
                <TypingDots />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Mobile suggestions */}
        <div className="lg:hidden flex gap-2 px-4 pb-2 overflow-x-auto shrink-0">
          {SUGGESTIONS.slice(0, 3).map(s => (
            <button key={s} onClick={() => sendMessage(s)}
              className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap"
              style={{ background: 'var(--c-s2)', border: '1px solid var(--c-border)', color: 'var(--c-text2)' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid var(--c-border)' }}>
          <div className="flex items-end gap-2 px-4 py-2.5 rounded-2xl"
            style={{ background: 'var(--c-s2)', border: '1px solid var(--c-border)' }}>
            <textarea
              ref={textareaRef}
              rows={1}
              className="flex-1 text-[13px] resize-none bg-transparent focus:outline-none max-h-32"
              style={{ color: 'var(--c-text)', lineHeight: '1.5' }}
              placeholder="Ask me anything about your finances…"
              value={input}
              onChange={e => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
              }}
              onKeyDown={handleKeyDown}
            />
            <button onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              aria-label="Send"
              className="w-8 h-8 flex items-center justify-center rounded-xl text-white transition-opacity disabled:opacity-40 shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              <Send size={15} />
            </button>
          </div>
          <p className="text-center text-[11px] mt-2" style={{ color: 'var(--c-text3)' }}>
            AI advice is for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  )
}
