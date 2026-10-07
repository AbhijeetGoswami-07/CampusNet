# CampusNest

Responsive student and professional living discovery app built with React, TypeScript, Tailwind CSS, Leaflet/OpenStreetMap, and Supabase.

## Run locally

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and anon key.
4. Run `npm run dev`.

Apply `supabase/schema.sql` in the Supabase SQL editor. Create a Storage bucket named `listing-images` and configure its policies for authenticated providers. Authentication is provided by Supabase Auth; the app does not implement fake credentials or local-only user data. Public registration accepts only `student` and `provider`; assign `admin` manually in `profiles`.

## Optional AI search

Deploy `supabase/functions/parse-search/index.ts` as the `parse-search` Edge Function and set the secret only in Supabase:

```bash
supabase functions deploy parse-search
supabase secrets set OPENAI_API_KEY=your-server-side-key OPENAI_MODEL=gpt-4o-mini
```

The frontend calls the function through Supabase and contains no AI provider key. The function returns an allowlisted JSON filter object; its output is validated again in the browser before normal listing queries run. If the function is unavailable or over quota, manual search and filters continue to work.

## Included in the first version

- Verified listings with transparent rent, vacancy, distance, and provider status.
- Leaflet map using OpenStreetMap tiles.
- Saved-home shortlist in the current UI session.
- Nearby mess, laundry, and move-in services.
- Secure enquiry UI with no payment processing.
- Supabase schema for profiles, listings, amenities, images, saved listings, enquiries, reviews, reports, vacancy history, and the `listing_review_summary` view.
