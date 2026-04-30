# Portfolio Template

A modern, minimal portfolio website ready to deploy on GitHub Pages.

---

## Quick Start — Customize in 10 Minutes

### Step 1: Replace "Your Name" everywhere

Open each of these files and search for `EDIT:` — every comment marks something you should change:

| File | What to change |
|------|----------------|
| `index.html` | Name, title, bio, stats, skills, social links |
| `about.html` | Photo, bio, skills, experience, education |
| `contact.html` | Email, location, social links |
| All `.html` files | Logo initials `YN` → your own initials |

### Step 2: Add your profile photo

1. Put your photo in `assets/images/` (name it `profile.jpg`)
2. In `about.html`, find the `<!-- Profile Photo -->` comment
3. Uncomment the `<img>` tag and delete the placeholder `<div>` below it

### Step 3: Add a project

1. Copy `projects/template.html` → rename it (e.g. `projects/my-app.html`)
2. Open the new file and fill in all the `EDIT:` sections
3. Open `projects/config.js` and add an entry for it:

```js
{
  title:       "My App",
  description: "What it does in one sentence.",
  tags:        ["React", "Node.js"],
  image:       null,                    // or "images/my-app-screenshot.png"
  file:        "my-app.html",
  featured:    false,
  date:        "2025-06"
}
```

4. Save. Reload `projects.html` — your project appears automatically with filter support.

---

## Deploy to GitHub Pages (Free Hosting)

### Method A — Simplest (recommended for beginners)

1. Create a free account at [github.com](https://github.com)
2. Create a new repository named exactly: `yourusername.github.io`
   - Replace `yourusername` with your actual GitHub username
3. Upload all these files to that repository
4. Go to your repo → **Settings** → **Pages**
5. Under "Source", select **main branch** → Save
6. Your site will be live at `https://yourusername.github.io` in ~2 minutes

### Method B — Existing repository

If you want your portfolio at `yourusername.github.io/portfolio`:

1. Create a repo named `portfolio`
2. Upload all files
3. Go to **Settings** → **Pages** → Source: **main branch** → Save
4. Site lives at `https://yourusername.github.io/portfolio`

---

## Set Up the Contact Form (Free)

The contact form uses [Formspree](https://formspree.io) — no backend needed.

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Click "New Form" and give it a name
3. Copy your **Form ID** (looks like `xpzgkwqd`)
4. Open `contact.html` and find this line:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
5. Replace `YOUR_FORM_ID` with your actual ID

Done! You'll receive emails at the address you signed up with.

---

## Folder Structure

```
Portfolio/
├── index.html              ← Home page
├── about.html              ← About page
├── projects.html           ← Projects listing (auto-populates)
├── contact.html            ← Contact page
├── 404.html                ← "Page not found" page
│
├── assets/
│   ├── css/
│   │   └── style.css       ← All styles (colors, layout, components)
│   ├── js/
│   │   └── main.js         ← All JavaScript
│   └── images/             ← Put your photos here
│       └── profile.jpg     ← (add this yourself)
│
└── projects/
    ├── config.js           ← ⭐ Edit this to add/remove projects
    ├── template.html       ← Copy this for each new project
    └── example-project.html
```

---

## Customization Tips

### Change the accent color

Open `assets/css/style.css` and find the `:root` block near the top.
Change `--color-accent` to any color you like:

```css
--color-accent: #6366f1;   /* Indigo (default) */
--color-accent: #10b981;   /* Green */
--color-accent: #f59e0b;   /* Amber */
--color-accent: #ef4444;   /* Red */
--color-accent: #3b82f6;   /* Blue */
```

### Add a custom domain

1. Buy a domain (e.g. from Namecheap or Google Domains)
2. In your GitHub repo, go to **Settings → Pages → Custom Domain**
3. Enter your domain and save
4. Add a `CNAME` file to the root of your repo containing just your domain:
   ```
   www.yourdomain.com
   ```

### Add Google Analytics

Paste your GA4 script tag just before `</head>` in each HTML file.

---

## Need Help?

- GitHub Pages docs: https://docs.github.com/pages
- Formspree docs: https://help.formspree.io
- Open an issue on this repo if something is broken
