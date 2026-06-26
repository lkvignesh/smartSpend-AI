import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { useAIChat } from '@/hooks/useFinance'

const SUGGESTIONS = [
  'Where am I wasting money?',
  'How can I save ₹5,000 this month?',
  'What is my savings rate?',
  'Give me tips to reduce food expenses',
]

const CARD_STYLE = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }

interface Message { role: 'user' | 'ai'; content: string }

const INITIAL: Message = {
  role: 'ai',
  content: "Hi! I'm your SmartSpend AI advisor. Ask me anything about your finances — spending patterns, savings tips, budget advice, or financial goals.",
}

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([INITIAL])
  const [input, setInput] = useState('')
  const chat = useAIChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = (msg?: string) => {
    const message = msg || input.trim()
    if (!message) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: message }])
    chat.mutate(message, {
      onSuccess: (res: any) => {
        setMessages(prev => [...prev, { role: 'ai', content: String(res?.response || 'No response') }])
      },
      onError: () => {
        setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }])
      },
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-48px)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#F0F0FF]">AI Advisor</h1>
        <p className="text-[#8A8AA0] text-sm mt-1">Your personal financial intelligence</p>
      </div>

      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0" style={CARD_STYLE}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${m.role === 'ai' ? 'bg-[#6C63FF]' : 'bg-[#00D4AA]'}`}>
                {m.role === 'ai'
                  ? <Bot size={16} className="text-white" />
                  : <User size={16} className="text-white" />}
              </div>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${m.role === 'ai'
                    ? 'bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#F0F0FF]'
                    : 'bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#F0F0FF]'}`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {chat.isPending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-[#8A8AA0]">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex gap-2 flex-wrap mb-3">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full transition-colors text-[#6C63FF] hover:bg-[#6C63FF]/20"
                style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)' }}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask about your finances…"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm text-[#F0F0FF] placeholder-[#8A8AA0] focus:outline-none focus:border-[#6C63FF] transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || chat.isPending}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
