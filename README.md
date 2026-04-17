# Personal portfolio (GitHub Pages)

Static personal site for **Chenkai Zhang** — Electrical & Computer Engineering student. Built with HTML, CSS, and a small amount of JavaScript.

## Repository name for your URL

To publish at **https://kevinzck8k.github.io/** (user site):

1. Create a **public** repository on GitHub named exactly: **`kevinzck8k.github.io`**
2. Push the contents of this folder to the **`main`** branch (or **`master`** — see Pages settings).

User Pages sites must use the `<username>.github.io` repository name. Your site will appear at the root of that domain.

## Files you need

| File / folder   | Purpose |
|----------------|---------|
| `index.html`   | All sections and content |
| `style.css`    | Layout, typography, responsive rules |
| `script.js`    | Nav toggle, smooth scroll offset, footer year |
| `assets/`      | Optional: PDF resume, images, favicon |
| `README.md`    | This file |

No build step is required. GitHub Pages serves these files as static assets.

## Where to place them

Clone or create `kevinzck8k.github.io` locally, then copy these files into the **root** of that repository:

```text
kevinzck8k.github.io/
  index.html
  style.css
  script.js
  README.md
  assets/
    resume.pdf               ← add your CV/resume PDF (see below)
```

## Deploy with GitHub Pages

1. Push the repo to GitHub.
2. Open the repo on GitHub → **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
4. Select branch **`main`** (or `master`) and folder **`/ (root)`**, then save.
5. After a minute or two, the site should be live at `https://kevinzck8k.github.io/`.

If you use a **project** repository instead (e.g. `portfolio`), the URL would be `https://kevinzck8k.github.io/portfolio/` and you may need a `base` tag or relative links only—this project is set up for a **user** site at the domain root.

## Customize text

- Open **`index.html`** and edit the text inside each `<section>`.
- Section order matches the navigation: Home, About, Skills, Projects, Experience, Education, Highlights, Contact.

## Replace resume and links

1. **Resume:** Save your PDF as `assets/resume.pdf`, or use another filename and update the `href` on the Resume button in **`index.html`** to match.
2. **GitHub:** Confirm your username; update `https://github.com/kevinzck8k` if different.
3. **LinkedIn:** Replace `https://www.linkedin.com/in/YOUR-LINKEDIN-USERNAME` in both the hero buttons and the contact list.
4. **Email:** Already set to your U of T address; change the `mailto:` and visible text if needed.

## Update project entries

Each project is an `<article class="project-card">` in **`index.html`**. For a new project:

1. Copy one full `<article class="project-card">...</article>` block.
2. Change the title, `<time>`, description paragraphs, technologies, and contribution line.
3. Set project links to real GitHub/demo URLs, or keep the placeholder `<a href="#">` pattern.

## Local preview

Open `index.html` in a browser, or from this directory run:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Content source

Site content is derived from your CV; awards not listed there were not invented—the Highlights section states that and lists factual strengths only.
