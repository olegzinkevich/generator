import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request) {
  try {
    const { description, category } = await request.json()
    if (!description) {
      return NextResponse.json({ error: 'description required' }, { status: 400 })
    }

    const genreHint = category ? ` The game genre/category is: ${category}.` : ''

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an ASO (App Store Optimization) expert for game discovery. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `Generate 5 to 10 relevant search keywords IN RUSSIAN for a game with the following description.${genreHint} These keywords will be used in the Yandex Games console for game discovery. All keywords must be in Russian language. Return a JSON object with a single key "keywords" containing an array of strings.\n\nGame description: ${description}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const parsed = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
