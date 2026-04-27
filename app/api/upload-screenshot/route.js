import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const SCREENSHOTS_DIR = path.join(process.cwd(), 'public', 'reference-screenshots')

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'file required' }, { status: 400 })
    }

    await mkdir(SCREENSHOTS_DIR, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = path.join(SCREENSHOTS_DIR, safeName)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      name: safeName,
      path: `/reference-screenshots/${safeName}`,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
