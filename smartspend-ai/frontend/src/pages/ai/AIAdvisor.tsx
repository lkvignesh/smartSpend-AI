import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Send, TrendingUp, PiggyBank, AlertTriangle,
  Lightbulb, Brain, RotateCcw, ChevronRight,
} from 'lucide-react'
import { useAIChat } from '@/hooks/useFinance'
import { useAuth }   from '@/hooks/useAuth'
import { Avatar }    from '@/components/ui/Avatar'
import { Badge }     from '@/components/ui/Badge'

interface Message { role: 'user' | 'assistant'; content: string; ts: number }

const SUGGESTIONS = [
  { icon: TrendingUp,    text: 'How can I reduce my monthly expenses?' },
  { icon: PiggyBank,     text: 'What is the best way to start saving?' },
  { icon: AlertTriangle, text: 'Am I spending too much on entertainment?' },
  { icon: Lightbulb,     text: 'Give me a personalised budget plan' },
]

function UserBubble({ content, name }: { content: string; name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end justify-end gap-3">
      <div
        className="max-w-[70%] px-4 py-3 rounded-2xl rounded-br-md text-[14px] leading-relaxed"
        style={{
          background: 'var(--grad)',
          color: 'white',
          boxShadow: '0 3px 12px rgba(59,130,246,0.25)',
        }}>
        {content}
      </div>
      <Avatar name={name} size="sm" />
    </motion.div>
  )
}

function AiBubble({ content, isTyping }: { content: string; isTyping?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'var(--grad)' }}>
        <Brain size={14} className="text-white" />
      </div>
      <div
        className="max-w-[70%] px-4 py-3 rounded-2xl rounded-bl-md text-[14px] leading-relaxed"
        style={{
          background: 'var(--card2)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}>
        {isTyping ? (
          <div className="flex gap-1.5 py-1">
            {[0,1,2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: 'var(--primary)' }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        ) : content}
      </div>
    </motion.div>
  )
}

export default function AIAdvisor() {
  const { user } = useAuth()
  const { mutate: chat, isPending } = useAIChat()
  const [messages, setMessages]     = useState<Message[]>([])
  const [input, setInput]           = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending])

  const send = (text: string) => {
    if (!text.trim() || isPending) return
    const userMsg: Message = { role: 'user', content: text.trim(), ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    chat(text.trim(), {
      onSuccess: (data: any) => {
        const reply = data?.response || data?.message || data?.content
          || 'I am here to help! Could you please rephrase your question?'
        setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: Date.now() }])
      },
      onError: () => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I could not process that. Please try again.',
          ts: Date.now(),
        }])
      },
    })
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - var(--topbar-h) - 80px)' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--grad)', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>
              AI Financial Advisor
            </h1>
            <p className="t-small flex items-center gap-2" style={{ color: 'var(--text3)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              Online · GPT-4 powered
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-2 px-3 py-2 rounded-xl t-small font-medium transition-colors hover:bg-[var(--card)]"
            style={{ color: 'var(--text3)' }}>
            <RotateCcw size={13} /> New chat
          </button>
        )}
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 overflow-y-auto fp-scroll min-h-0 rounded-2xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

        {isEmpty ? (
          /* Welcome state */
          <div className="flex flex-col items-center justify-center h-full px-8 py-12">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
              style={{ background: 'var(--grad)', boxShadow: '0 8px 32px rgba(59,130,246,0.3)' }}>
              <Brain size={32} className="text-white" />
            </div>
            <h2 className="text-[22px] font-bold text-center mb-2" style={{ color: 'var(--text)' }}>
              Your AI Financial Advisor
            </h2>
            <p className="t-body text-center max-w-sm mb-10" style={{ color: 'var(--text2)' }}>
              Ask me anything about your finances. I can help with budgeting, savings goals, investment ideas, and more.
            </p>

            {/* Suggestion chips */}
            <div className="w-full max-w-lg space-y-2.5">
              <p className="t-label text-center mb-3" style={{ color: 'var(--text3)' }}>SUGGESTED QUESTIONS</p>
              {SUGGESTIONS.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  onClick={() => send(text)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all hover:bg-[var(--card2)] group"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--primary-dim)' }}>
                    <Icon size={15} style={{ color: 'var(--primary)' }} />
                  </div>
                  <span className="flex-1 text-[13px] font-medium" style={{ color: 'var(--text)' }}>{text}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--text3)' }} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="flex flex-col gap-5 p-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                msg.role === 'user'
                  ? <UserBubble key={msg.ts} content={msg.content} name={user?.full_name ?? 'User'} />
                  : <AiBubble key={msg.ts} content={msg.content} />
              ))}
              {isPending && (
                <AiBubble key="typing" content="" isTyping />
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 mt-4">
        <div className="flex items-end gap-3 p-3 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask your AI advisor anything…"
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 14,
              color: 'var(--text)',
              lineHeight: '1.5',
              padding: '8px 4px',
              maxHeight: 120,
              overflowY: 'auto',
            }}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`
            }}
          />
          <motion.button
            onClick={() => send(input)}
            disabled={!input.trim() || isPending}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all disabled:opacity-40"
            style={{
              background: input.trim() && !isPending ? 'var(--grad)' : 'var(--card2)',
              color: input.trim() && !isPending ? 'white' : 'var(--text3)',
            }}>
            <Send size={16} />
          </motion.button>
        </div>
        <p className="text-center t-small mt-2" style={{ color: 'var(--text3)' }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
