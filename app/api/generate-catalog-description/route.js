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
      ? `Translate the following game catalog description to ${lang}. Keep the same meaning, tone, structure, and approximate length. Text length — up to 1000 characters (strict). Translate idiomatically, not literally.\n\nSource text: ${sourceText}\n\nReturn a JSON object with a single key "catalogDescription" whose value is the translated string in ${lang} (max 1000 characters).`
      : `Generate a "Description for catalog" text, written in ${lang}. This block is displayed on the game page. Text length — up to 1000 characters (strict).${category ? ` The game genre/category is: ${category}.` : ''} Explain the plot setup in detail or describe the gameplay. You may also mention the main modes and features of the game — for example, playing with friends, a PVP mode, or another interesting mechanic.\n\nGame description: ${description}${hint ? `\n\nAdditional instructions from the user: ${hint}` : ''}\n\nReturn a JSON object with a single key "catalogDescription" whose value is the description string in ${lang} (max 1000 characters).`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a copywriter for game catalog pages. Always respond with valid JSON only.',
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
    let text = typeof parsed.catalogDescription === 'string' ? parsed.catalogDescription.trim() : ''
    if (text.length > 1000) text = text.slice(0, 1000)
    return NextResponse.json({ catalogDescription: text })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
