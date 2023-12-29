import { z } from 'zod'

export type OpenGraphData = {
  ogImage: string | null
  ogTitle: string | null
  ogDescription: string | null
}

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

export const urlValidator = (arg: string) => {
  if (arg === undefined || arg === null || arg === '') {
    return true
  }

  const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/

  if (!arg.startsWith('http://') && !arg.startsWith('https://')) {
    return domainRegex.test(arg)
  }

  try {
    const url = new URL(arg)

    const hostnameParts = url.hostname.split('.')
    if (hostnameParts.length < 2) {
      return false
    }

    const tld = hostnameParts[hostnameParts.length - 1]
    if (tld.length < 2) {
      return false
    }
    return true
  } catch {
    return false
  }
}

export const isWebsite = (word: string) =>
  z
    .string()
    .max(96)
    .refine(urlValidator, 'Invalid url')
    .optional()
    .safeParse(word).success

export const getHref = (url?: string) => {
  const website = url?.replace('https://', '').replace('http://', '')

  const href =
    !website?.startsWith('http://') &&
    !website?.startsWith('https://') &&
    website !== undefined &&
    website?.length > 0
      ? 'https://' + website
      : website

  return href
}
