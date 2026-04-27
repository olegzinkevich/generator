import { NextResponse } from 'next/server'
import { sessions } from '../route.js'

export async function POST(request) {
  const { sessionId, message } = await request.json()

  if (!sessionId || !message) {
    return NextResponse.json({ error: 'sessionId and message required' }, { status: 400 })
  }

  const claude = sessions.get(sessionId)
  if (!claude) {
    return NextResponse.json({ error: 'Session not found or already ended' }, { status: 404 })
  }

  try {
    const userMessage = JSON.stringify({
      type: 'user',
      message: { role: 'user', content: message },
    })
    claude.stdin.write(userMessage + '\n')
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
