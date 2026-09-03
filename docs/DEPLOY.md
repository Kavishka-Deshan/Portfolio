# Deployment Guide

## Prerequisites

- A GitHub account with the [Student Developer Pack](https://education.github.com/pack) enabled
- A domain registered through [Namecheap for Students](https://nc.me/) (free `.me` domain for 1 year)
- Node.js and npm installed

---

## 1. Repository Setup

1. Go to [github.com/new](https://github.com/new) and create a **public** repository.
2. Name it **`portfolio`** (or any name you prefer — it won't affect the custom domain).
3. Push this project to the repository:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git remote add origin https://github.com/Kavishka-Deshan/portfolio.git
git branch -M main
git push -u origin main
```

---

## 2. Claim Your Free Domain

1. Go to [nc.me](https://nc.me/) and log in with your GitHub account.
2. Search for an available `.me` domain (e.g., `kavishkadeshan.me`).
3. Register it using the free coupon provided by the Student Developer Pack.

> **Note:** The Namecheap Student Pack currently offers a free `.me` domain for 1 year. Verify the current offer at [nc.me/landing/github](https://nc.me/landing/github) as it may change.

---

## 3. Configure DNS Records

At your Namecheap domain dashboard, go to **Domain → Advanced DNS** and add the following records:

### Apex Domain (e.g., `kavishkadeshan.me`)

Create **4 A records** (one for each GitHub Pages IP):

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `@` | `185.199.108.153` | Automatic |
| A | `@` | `185.199.109.153` | Automatic |
| A | `@` | `185.199.110.153` | Automatic |
| A | `@` | `185.199.111.153` | Automatic |

> **Source:** [GitHub Docs — Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) (retrieved September 2026).

### `www` Subdomain

Create a **CNAME record**:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `Kavishka-Deshan.github.io` | Automatic |

This ensures both `kavishkadeshan.me` and `www.kavishkadeshan.me` work, with automatic redirects between them.

---

## 4. GitHub Repository Settings

1. Go to your repository on GitHub.
2. Click **Settings → Pages** (under "Code, planning, and automation").
3. Under **Build and deployment**, set:
   - **Source:** GitHub Actions
4. Under **Custom domain**, type your domain (e.g., `kavishkadeshan.me`) and click **Save**.
5. Wait for the DNS check to pass (can take up to 24 hours).
6. Once the check passes, check **Enforce HTTPS**.

> **Note:** The TLS certificate is automatically provisioned by GitHub via Let's Encrypt. It typically takes **less than 24 hours** to become available after DNS is verified. In some cases it can take up to 48 hours.

---

## 5. CNAME File

`public/CNAME` already exists and contains:

```
kavishkadeshan.me
```

It is copied into the published site on every build, which is what stops GitHub
Pages from dropping your custom domain each time the workflow runs. **If you
register a different domain, change this file** and keep it in step with
`public/robots.txt` and `public/sitemap.xml`, which both reference the same
host:

```bash
echo "your-domain.me" > public/CNAME
# then update the Sitemap: line in public/robots.txt
# and the <loc> in public/sitemap.xml
# and metadataBase in src/app/layout.tsx
```

## 6. Verify the Deployment

After pushing to `main`, the GitHub Actions workflow will automatically build and deploy your site.

1. Go to **Settings → Pages** in your repository.
2. Under "GitHub Pages", you should see a green checkmark and the URL.
3. Visit your custom domain (e.g., `https://kavishkadeshan.me`).
4. Check that:
   - The site loads correctly
   - All sections render (Hero, About, Skills, Projects, Education, Contact)
   - The mobile menu works
   - HTTPS is enforced (padlock icon in the browser)

---

## Troubleshooting

- **DNS not resolving:** DNS propagation can take up to 24 hours. Use [dnschecker.org](https://dnschecker.org/) to verify.
- **404 error:** Make sure the workflow completed successfully (check the **Actions** tab in your repo).
- **Certificate pending:** The TLS certificate provisioning can take up to 24-48 hours after DNS is verified.
- **Build fails:** Check the Actions tab for error logs. Ensure `npm run build` works locally first.

---

## Final Build Size

The static export is approximately **480 KB** — well within GitHub Pages' 1 GB repository limit and 100 GB/month bandwidth limit.
