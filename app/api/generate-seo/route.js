import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request) {
  try {
    const { description, language, sourceText, category } = await request.json()
    if (!description && !sourceText) {
      return NextResponse.json({ error: 'description or sourceText required' }, { status: 400 })
    }

    const lang = (language && language.trim()) || 'English'

    const userContent = sourceText
      ? `Translate the following SEO game description to ${lang}. Keep the same meaning, tone, and length. Text length — up to 160 characters (strict). Translate idiomatically, not literally.\n\nSource text: ${sourceText}\n\nReturn a JSON object with a single key "seo" whose value is the translated string in ${lang} (max 160 characters).`
      : `Generate a game description for search results, written in ${lang}. It will be visible in search engines under the game title. Text length — up to 160 characters (strict).${category ? ` The game genre/category is: ${category}.` : ''} Add useful information about the game (genre, essence of the plot, or game setting). Example style (in English, translate idiomatically to ${lang}): "\"Game X\" is an interesting puzzle in the \"match-three\" genre! Compete with friends, pass levels for speed, and solve complex puzzles."\n\nGame description: ${description}\n\nReturn a JSON object with a single key "seo" whose value is the description string in ${lang} (max 160 characters).`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO copywriter for game catalogs. Always respond with valid JSON only.',
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
    let seo = typeof parsed.seo === 'string' ? parsed.seo.trim() : ''
    if (seo.length > 160) seo = seo.slice(0, 160)
    return NextResponse.json({ seo })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
