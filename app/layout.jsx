import './globals.css'

export const metadata = {
  title: 'Yandex Game Generator',
  description: 'Generate game titles and keywords for Yandex Games',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
