import { NextResponse } from 'next/server'
import { stat } from 'fs/promises'
import path from 'path'

async function fileInfo(filePath) {
  try {
    const s = await stat(filePath)
    return { exists: true, mtime: s.mtimeMs }
  } catch {
    return { exists: false }
  }
}

export async function GET() {
  const publicDir = path.join(process.cwd(), 'public')
  const [logo, maskable, cover] = await Promise.all([
    fileInfo(path.join(publicDir, 'logo.png')),
    fileInfo(path.join(publicDir, 'maskable.png')),
    fileInfo(path.join(publicDir, 'cover.png')),
  ])
  return NextResponse.json({ logo, maskable, cover })
}
