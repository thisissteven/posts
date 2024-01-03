/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://posts-cv.vercel.app/',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  exclude: ['/experiment', '/replies/*'],
}
