import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request) {
  try {
    const { screens, language } = await request.json()
    if (!screens || !screens.length) {
      return NextResponse.json({ error: 'screens required' }, { status: 400 })
    }

    const lang = (language && language.trim()) || 'English'

    const screensJson = JSON.stringify(screens)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator for game UIs. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `Translate the following onboarding screens to ${lang}. Translate idiomatically, not literally. Keep the same structure — each screen has a "title" and "options" array.\n\nSource screens (Russian):\n${screensJson}\n\nReturn a JSON object with a single key "screens" whose value is an array of translated screen objects, each with "title" (string) and "options" (array of strings) in ${lang}.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    })

    const parsed = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json({ screens: parsed.screens || [] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
