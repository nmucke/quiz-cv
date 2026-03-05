# Flashy CV Website

An extravagant, fire-and-explosion themed CV/portfolio website. Deploy to GitHub Pages with one push.

## Quick Start

1. **Edit your content** – Open [`config.js`](config.js) and update:
   - `name`, `tagline`, `bio`
   - `contact` (email, LinkedIn, GitHub)
   - `images` – paths to your photos
   - `video` – path to your video and optional poster image

2. **Add your media**:
   - **Images**: Drop files in `public/images/` and reference them in `config.images` (e.g. `{ src: "/images/me.jpg", alt: "Me" }`)
   - **Video**: Drop your video in `public/video/` and set `config.video.src` (e.g. `"/video/showreel.mp4"`)

3. **Run locally**:
   ```bash
   npm run dev
   ```

4. **Build**:
   ```bash
   npm run build
   ```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", select **GitHub Actions** as the source.
4. Push to the `main` branch – the site deploys automatically.

### Project site vs User site

- **Project site** (e.g. `username.github.io/quiz-cv`): In [`vite.config.js`](vite.config.js), set `base: '/quiz-cv/'`.
- **User site** (e.g. `username.github.io`): Keep `base: '/'` (default).

## Project Structure

```
├── config.js          ← Edit your content here
├── index.html
├── src/
│   ├── main.js
│   ├── styles.css
│   └── effects/
├── public/
│   ├── images/        ← Drop your photos here
│   └── video/        ← Drop your video here
```
