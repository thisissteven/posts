import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preconnect"
          href="https://res.cloudinary.com/"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="overflow-x-hidden text-primary bg-background">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
