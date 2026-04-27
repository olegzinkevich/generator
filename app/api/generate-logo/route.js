import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { openai } from '@/lib/openai'

export async function POST(request) {
  try {
    const { description, logoPrompt, titleText } = await request.json()

    const basePrompt = (logoPrompt && logoPrompt.trim()) || description
    if (!basePrompt || !basePrompt.trim()) {
      return NextResponse.json(
        { error: 'description or logoPrompt required' },
        { status: 400 }
      )
    }

    const titleInstruction = titleText
      ? ` Include the game title "${titleText}" as stylized text integrated into the logo design.`
      : ' No text unless essential, no background elements.'

    const prompt = `Game logo for the following game: ${basePrompt}. The logo must be on a fully transparent background, centered, suitable as an app icon.${titleInstruction} It should have the size of 512×512px`

    const result = await openai.images.generate({
      model: 'gpt-image-1.5',
      prompt,
      quality: 'high',
      size: '1024x1024',
      background: 'transparent',
    })

    const b64 = result.data?.[0]?.b64_json
    if (!b64) {
      return NextResponse.json(
        { error: 'No image returned from API' },
        { status: 500 }
      )
    }

    const buffer = Buffer.from(b64, 'base64')
    const resized = await sharp(buffer)
      .resize(512, 512, { fit: 'cover' })
      .png()
      .toBuffer()
    const publicDir = path.join(process.cwd(), 'public')
    const filePath = path.join(publicDir, 'logo.png')
    await writeFile(filePath, resized)

    return NextResponse.json({ path: '/logo.png', savedAt: Date.now() })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
