# Put the portfolio online

1. In Supabase, open **SQL Editor**, run `supabase/schema.sql`, then in **Authentication > Users** create your one admin email/password. Disable public sign-ups in **Authentication > Providers > Email**. The CMS cannot save until this SQL step is complete.
2. Copy the Project URL and the **anon public** key from **Project Settings > API** into `js/supabase-config.js`. The anon key is safe to publish; never add a service-role key to this site.
3. Open `admin.html`, sign in, and press **Save Changes** once. This seeds the online `projects` and `profile` rows from the JSON files.
4. Commit and push this folder to `dhafinmuntaz/PortofWeb`. In GitHub, open **Settings > Pages**, set Source to **GitHub Actions**, then push to `main`. The workflow deploys the site at `https://dhafinmuntaz.github.io/PortofWeb/`.

GitHub Pages hosts the code and images. Portfolio content is saved to Supabase because a static GitHub Pages site cannot safely write back to repository files from a browser.
