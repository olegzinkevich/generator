import { NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { openai, toFile } from '@/lib/openai'

const COVER_W = 800
const COVER_H = 470
const LOGO_SIZE = 200

export async function POST(request) {
  try {
    const { description } = await request.json()
    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'description required' },
        { status: 400 }
      )
    }

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

    const imageFile = await toFile(logoBuffer, 'logo.png', { type: 'image/png' })

    const prompt = `Yandex Games catalog cover banner for the following game: ${description}. Landscape orientation, visually striking, vibrant colors that complement the provided logo's palette and theme. IMPORTANT: leave the central area clear and uncluttered — a logo will be overlaid in the center afterwards. Focus the main illustration on the left and right sides. Do NOT include any text, and do NOT reproduce the logo itself inside the image.`

    const result = await openai.images.edit({
      model: 'gpt-image-1.5',
      image: imageFile,
      prompt,
      quality: 'medium',
      size: '1536x1024',
    })

    const b64 = result.data?.[0]?.b64_json
    if (!b64) {
      return NextResponse.json(
        { error: 'No image returned from API' },
        { status: 500 }
      )
    }

    const generated = Buffer.from(b64, 'base64')
    const background = await sharp(generated)
      .resize(COVER_W, COVER_H, { fit: 'cover' })
      .toBuffer()

    const logoOverlay = await sharp(logoBuffer)
      .resize(LOGO_SIZE, LOGO_SIZE, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()

    const cover = await sharp(background)
      .composite([{ input: logoOverlay, gravity: 'center' }])
      .png()
      .toBuffer()

    const outPath = path.join(publicDir, 'cover.png')
    await writeFile(outPath, cover)

    return NextResponse.json({ path: '/cover.png', savedAt: Date.now() })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
