import OpenAI, { toFile } from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.proxyapi.ru/openai/v1',
})

export { toFile }
