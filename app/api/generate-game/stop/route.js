import { NextResponse } from 'next/server'
import { sessions } from '../route.js'

export async function POST(request) {
  const { sessionId } = await request.json()

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }

  const claude = sessions.get(sessionId)
  if (!claude) {
    return NextResponse.json({ error: 'Session not found or already ended' }, { status: 404 })
  }

  try {
    claude.kill('SIGTERM')
    sessions.delete(sessionId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
