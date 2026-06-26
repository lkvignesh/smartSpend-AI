import { useState, useRef, useEffect } from 'react'
import { Box, Card, CardContent, TextField, IconButton, Typography, Avatar, Chip, CircularProgress } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import { useAIChat } from '@/hooks/useFinance'

const SUGGESTIONS = [
  'Where am I wasting money?',
  'How can I save ₹5,000 this month?',
  'What is my savings rate?',
  'Give me tips to reduce food expenses',
]

interface Message { role: 'user' | 'ai'; content: string }

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'ai', content: 'Hi! I\'m your SmartSpend AI advisor. Ask me anything about your finances — spending patterns, savings tips, budget advice, or financial goals.' }])
  const [input, setInput] = useState('')
  const chat = useAIChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (msg?: string) => {
    const message = msg || input.trim()
    if (!message) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: message }])
    try {
      const res = await chat.mutateAsync(message)
      setMessages(prev => [...prev, { role: 'ai', content: res.response }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }])
    }
  }

  return (
    <Box sx={{ height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>AI Advisor</Typography>
        <Typography color="text.secondary" fontSize={14} sx={{ mt: 0.5 }}>Your personal financial intelligence</Typography>
      </Box>

      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <CardContent sx={{ flex: 1, overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((m, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: m.role === 'ai' ? 'primary.main' : 'secondary.main', flexShrink: 0 }}>
                {m.role === 'ai' ? <SmartToyIcon sx={{ fontSize: 18 }} /> : <PersonIcon sx={{ fontSize: 18 }} />}
              </Avatar>
              <Box sx={{ maxWidth: '75%', bgcolor: m.role === 'ai' ? 'rgba(108,99,255,0.1)' : 'rgba(0,212,170,0.1)',
                border: `1px solid ${m.role === 'ai' ? 'rgba(108,99,255,0.2)' : 'rgba(0,212,170,0.2)'}`,
                borderRadius: 3, px: 2, py: 1.5 }}>
                <Typography fontSize={14} lineHeight={1.6} sx={{ whiteSpace: 'pre-wrap' }}>{m.content}</Typography>
              </Box>
            </Box>
          ))}
          {chat.isPending && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}><SmartToyIcon sx={{ fontSize: 18 }} /></Avatar>
              <Box sx={{ bgcolor: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 3, px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={14} /><Typography fontSize={13} color="text.secondary">Thinking...</Typography>
              </Box>
            </Box>
          )}
          <div ref={bottomRef} />
        </CardContent>

        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
            {SUGGESTIONS.map(s => (
              <Chip key={s} label={s} size="small" onClick={() => send(s)} clickable
                sx={{ fontSize: 12, bgcolor: 'rgba(108,99,255,0.1)', color: 'primary.light', border: '1px solid rgba(108,99,255,0.2)', '&:hover': { bgcolor: 'rgba(108,99,255,0.2)' } }} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth placeholder="Ask about your finances..." size="small" value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <IconButton onClick={() => send()} disabled={!input.trim() || chat.isPending}
              sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 2, '&:hover': { bgcolor: 'primary.dark' }, '&:disabled': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
