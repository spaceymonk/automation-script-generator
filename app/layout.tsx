import './globals.css'

export const metadata = {
  title: 'Automation Script Generator',
  description: 'Created by spaceymonk',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body id="root">{children}</body>
    </html>
  )
}
