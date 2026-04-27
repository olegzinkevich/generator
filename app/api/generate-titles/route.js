import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request) {
  try {
    const { description, category, language } = await request.json()
    if (!description) {
      return NextResponse.json({ error: 'description required' }, { status: 400 })
    }

    const lang = (language && language.trim()) || 'Russian'
    const genreHint = category ? ` The game genre/category is: ${category}.` : ''

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative game naming expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `Generate exactly 10 cool, short, and catchy game titles in ${lang} for the following game description.${genreHint} Each title MUST be exactly 2-3 words — never a single generic word. Avoid generic words like "Логика", "Пазл", "Puzzle", "Logic" as standalone titles. Titles should be punchy, unique, memorable, and specific to this game. All titles must be in ${lang} language. Return a JSON object with a single key "titles" containing an array of exactly 10 strings.\n\nGame description: ${description}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9,
    })

    const parsed = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
