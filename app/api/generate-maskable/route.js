import { NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const CANVAS = 512
const SAFE = Math.round(CANVAS * 0.8) // 410px — 80% safe zone, ~10% padding per side
const BG = { r: 255, g: 204, b: 0, alpha: 1 } // yellow

export async function POST() {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    const logoPath = path.join(publicDir, 'logo.png')

    let logoBuffer
    try {
      logoBuffer = await readFile(logoPath)
    } catch {
      return NextResponse.json(
        { error: 'logo.png not found — generate a logo first' },
        { status: 400 }
      )
    }

    const fittedLogo = await sharp(logoBuffer)
      .resize(SAFE, SAFE, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()

    const maskable = await sharp({
      create: {
        width: CANVAS,
        height: CANVAS,
        channels: 4,
        background: BG,
      },
    })
      .composite([{ input: fittedLogo, gravity: 'center' }])
      .png()
      .toBuffer()

    const outPath = path.join(publicDir, 'maskable.png')
    await writeFile(outPath, maskable)

    return NextResponse.json({ path: '/maskable.png', savedAt: Date.now() })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
