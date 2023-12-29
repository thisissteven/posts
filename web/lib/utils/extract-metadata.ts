const extractMetadata = (htmlContent: string) => {
  const ogImageRegex = /<meta property="og:image" content="([^"]+)"/i
  const ogTitleRegex = /<meta property="og:title" content="([^"]+)"/i
  const ogDescriptionRegex =
    /<meta property="og:description" content="([^"]+)"/i

  const ogImageMatch = htmlContent.match(ogImageRegex)
  const ogTitleMatch = htmlContent.match(ogTitleRegex)
  const ogDescriptionMatch = htmlContent.match(ogDescriptionRegex)

  const ogImage = ogImageMatch ? ogImageMatch[1] : null
  const ogTitle = ogTitleMatch ? ogTitleMatch[1] : null
  const ogDescription = ogDescriptionMatch ? ogDescriptionMatch[1] : null

  // Fallback values if OG tags are missing
  const fallbackTitle = htmlContent.match(/<title>([^<]+)<\/title>/i)
  const fallbackDescription = htmlContent.match(
    /<meta name="description" content="([^"]+)"/i
  )

  const title = ogTitle || (fallbackTitle ? fallbackTitle[1] : null)
  const description =
    ogDescription || (fallbackDescription ? fallbackDescription[1] : null)

  return { ogImage, ogTitle: title, ogDescription: description }
}

export const extractSiteMetadata = async (url: string) => {
  const response = await fetch(url)
  const data = await response.text()
  const metadata = extractMetadata(data)
  return metadata
}
