# ROLA Boutique Demo

Next.js 15 + TypeScript + Tailwind CSS demo site for ROLA Boutique.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Admin

Create `.env.local` and set:

```bash
ADMIN_USERNAME=rola
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_LINE_URL=https://lin.ee/your-line-link
```

Then open http://localhost:3000/admin.

Products are stored in `data/products.json`. Site settings are stored in `data/site-settings.json`.
Uploaded product images are saved to `public/uploads/products`; uploaded Logo, Hero, and Favicon files are saved to `public/uploads/branding`.

## Deploy

This project is ready for Vercel. Import the repository and use the default Next.js settings.
