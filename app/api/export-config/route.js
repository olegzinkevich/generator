import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const { spec, gameCodePath } = await request.json()

    if (!spec || !gameCodePath) {
      return NextResponse.json({ error: 'spec and gameCodePath required' }, { status: 400 })
    }

    await mkdir(gameCodePath, { recursive: true })
    const filePath = path.join(gameCodePath, 'GAME_SPEC.md')
    await writeFile(filePath, spec, 'utf-8')

    return NextResponse.json({ path: filePath })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
