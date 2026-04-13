This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Email Configuration

This project uses [Resend](https://resend.com) for sending emails. To enable email functionality:

1. Sign up for a free account at [Resend](https://resend.com)
2. Get your API key from the [Resend dashboard](https://resend.com/api-keys)
3. Add the following environment variables to your `.env.local` file:

```env
# Resend Email Service
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"

# Email Configuration
# The email address that will send emails (must be verified in Resend)
FROM_EMAIL="noreply@yourdomain.com"

# The email address that will receive contact form submissions
TO_EMAIL="contact@yourdomain.com"

# Company Name (used in email templates)
COMPANY_NAME="Explore Vision Nepal"
```

4. Verify your domain in Resend (required for production)
5. For development, you can use Resend's test domain or verify your email address

**Note:** If `RESEND_API_KEY` is not set, the contact form will still work and save submissions to the database, but emails will not be sent. This allows the application to function in development without email configuration.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
