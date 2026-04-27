import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { writeFile, copyFile, mkdir, readdir } from 'fs/promises'
import path from 'path'

// Long-running SSE — disable default timeout
export const maxDuration = 600 // 10 minutes

// Store running sessions so /reply can reach the process
const sessions = new Map()

export async function POST(request) {
  const body = await request.json()
  const { spec, gameCodePath, sessionId, provider = 'claude-cli' } = body

  if (!spec || !gameCodePath) {
    return NextResponse.json({ error: 'spec and gameCodePath required' }, { status: 400 })
  }

  // Write GAME_SPEC.md into the game folder
  const specPath = path.join(gameCodePath, 'GAME_SPEC.md')
  try {
    await writeFile(specPath, spec, 'utf-8')
  } catch (err) {
    return NextResponse.json({ error: `Cannot write to game folder: ${err.message}` }, { status: 500 })
  }

  // Copy assets into game folder's public dir
  const srcPublic = path.join(process.cwd(), 'public')
  const dstPublic = path.join(gameCodePath, 'public')
  try {
    await mkdir(dstPublic, { recursive: true })
    await Promise.allSettled([
      copyFile(path.join(srcPublic, 'logo.png'), path.join(dstPublic, 'logo.png')),
      copyFile(path.join(srcPublic, 'maskable.png'), path.join(dstPublic, 'maskable.png')),
      copyFile(path.join(srcPublic, 'cover.png'), path.join(dstPublic, 'cover.png')),
    ])
    // Copy reference screenshots
    const refSrcDir = path.join(srcPublic, 'reference-screenshots')
    const refDstDir = path.join(dstPublic, 'reference-screenshots')
    try {
      const files = await readdir(refSrcDir)
      if (files.length > 0) {
        await mkdir(refDstDir, { recursive: true })
        await Promise.allSettled(
          files.map((f) => copyFile(path.join(refSrcDir, f), path.join(refDstDir, f)))
        )
      }
    } catch {
      // no screenshots dir — skip
    }
  } catch {
    // non-fatal — assets may not all exist
  }

  const prompt = [
    'Read GAME_SPEC.md in this folder.',
    'It contains the full game specification — title, description, assets, localizations, onboarding screens, and technical requirements.',
    'Update the existing codebase in this folder to match the specification.',
    'Follow the "Instructions for Claude" section at the bottom of the spec.',
    'After making changes, verify they work by running the appropriate build/test commands for the framework.',
  ].join(' ')

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      let proc

      if (provider === 'opencode') {
        proc = spawn('opencode', ['run', '--print'], {
          cwd: gameCodePath,
          shell: true,
          stdio: ['pipe', 'pipe', 'pipe'],
        })
        proc.stdin.write(prompt + '\n')
        proc.stdin.end()
      } else {
        proc = spawn('claude', [
          '--input-format', 'stream-json',
          '--output-format', 'stream-json',
          '--allowedTools', 'Edit,Write,Read,Bash,Glob,Grep',
          '--verbose',
        ], {
          cwd: gameCodePath,
          shell: true,
          stdio: ['pipe', 'pipe', 'pipe'],
        })
        const initMessage = JSON.stringify({
          type: 'user',
          message: { role: 'user', content: prompt },
        })
        proc.stdin.write(initMessage + '\n')
      }

      // Store session for /reply and /stop endpoints
      sessions.set(sessionId, proc)

      proc.stdout.on('data', (chunk) => {
        const text = chunk.toString()
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'output', data: text })}\n\n`))
      })

      proc.stderr.on('data', (chunk) => {
        const text = chunk.toString()
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'stderr', data: text })}\n\n`))
      })

      proc.on('close', (code) => {
        sessions.delete(sessionId)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done', code })}\n\n`))
        controller.close()
      })

      proc.on('error', (err) => {
        sessions.delete(sessionId)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', data: err.message })}\n\n`))
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

// Export sessions map so the reply route can access it
export { sessions }
