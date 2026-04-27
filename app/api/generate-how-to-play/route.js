import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request) {
  try {
    const { description, language, hint, sourceText, category } = await request.json()
    if (!description && !sourceText) {
      return NextResponse.json({ error: 'description or sourceText required' }, { status: 400 })
    }

    const lang = (language && language.trim()) || 'English'

    const userContent = sourceText
      ? `Translate the following "How to play" text to ${lang}. Keep the same meaning, tone, structure, and approximate length. Text length — up to 1000 characters (strict). Translate idiomatically, not literally.\n\nSource text: ${sourceText}\n\nReturn a JSON object with a single key "howToPlay" whose value is the translated string in ${lang} (max 1000 characters).`
      : `Generate a "How to play" text, written in ${lang}. Text length — up to 1000 characters (strict).${category ? ` The game genre/category is: ${category}.` : ''} Explain how the game should be played: controls, objectives, progression, and any rules a new player needs to know.\n\nGame description: ${description}${hint ? `\n\nAdditional instructions from the user: ${hint}` : ''}\n\nReturn a JSON object with a single key "howToPlay" whose value is the instruction text in ${lang} (max 1000 characters).`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a copywriter for game instruction pages. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const parsed = JSON.parse(completion.choices[0].message.content)
    let text = typeof parsed.howToPlay === 'string' ? parsed.howToPlay.trim() : ''
    if (text.length > 1000) text = text.slice(0, 1000)
    return NextResponse.json({ howToPlay: text })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
