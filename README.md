<br>

[![posts](/assets/og-image-posts.jpg)](https://posts-cv.vercel.app)

<p align="center">
  Posts.cv clone built in Next.js + Prisma + TypeScript + Tailwind CSS
</p>

## Features ✨

- Authentication with NextAuth and Firebase
- Users can add posts, like, repost, and reply to posts
- Users can delete posts
- Users can add images, videos, and URL embeds to the post
- Users can follow and unfollow other users
- Users can see their followers and following list
- User can edit their profile
- Users can chat with each other
- Users can receive realtime notifications
- Users can search for other users through the command menu
- Realtime update on likes, reposts, and user profile
- Responsive design for mobile, tablet, and desktop
- All images uploads are stored on Cloudinary

## Tech 🛠

- [Algolia](https://www.algolia.com)
- [Cloudinary](https://cloudinary.com)
- [Next.js](https://nextjs.org)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com)
- [SWR](https://swr.vercel.app)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## Development 💻

Here are the steps to run the project locally.

1. Clone the repository

   ```bash
   git clone https://github.com/thisissteven/posts
   ```

1. Install dependencies

   ```bash
   pnpm install
   ```

1. Create a new `.env` file from the specified `.env.example` file

   ```bash
   cd web
   cp .env.example .env
   ```

   Fill in the needed environment variables

   ```bash
    DATABASE_URL=

    NEXT_PUBLIC_BASE_URL="http://localhost:3000"

    NEXTAUTH_SECRET=
    NEXTAUTH_URL="http://localhost:3000"

    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=

    EMAIL_SERVER_USER=
    EMAIL_SERVER_PASSWORD=
    EMAIL_SERVER_HOST=
    EMAIL_SERVER_PORT=
    EMAIL_FROM=

    NEXT_PUBLIC_CLOUDINARY_BASE_URL=
    NEXT_PUBLIC_CLOUDINARY_VIDEO_BASE_URL=
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
    NEXT_PUBLIC_CLOUDINARY_API_KEY=
    NEXT_PUBLIC_CLOUDINARY_API_SECRET=
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    NEXT_PUBLIC_CLOUDINARY_FOLDER=

    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_KEY=

    NEXT_PUBLIC_ALGOLIA_APP_ID=
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=
    ALGOLIA_WRITE_API_KEY=
   ```

1. Run the project

   ```bash
   pnpm dev
   ```

1. Need to seed the database? The following command will create random amount of users and posts.

   ```bash
   pnpm prisma db seed
   ```
