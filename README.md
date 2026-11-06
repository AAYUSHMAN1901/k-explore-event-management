# K Explore – Event Management Website

A responsive event discovery and registration website built with **HTML5, CSS3 and vanilla JavaScript** (no build step).

## Features
- Hero section with live countdown to the next event
- Event cards (name, date, venue, image banner, description)
- Real-time **search** and **category filters**
- Event details modal with **registration form** (name, email, phone, event)
- JavaScript **validation** (name format, email regex, 10-digit Indian mobile, duplicate check) and confirmation message
- **Local Storage** registration management (view and cancel registrations)
- **Dark / light mode** (remembers preference), scroll animations, smooth transitions
- Fully responsive (mobile, tablet, desktop), keyboard accessible (Esc closes modal)

## Project Structure
```
index.html   – page structure
style.css    – theming, layout, responsive styles
script.js    – event data, filtering, modal, validation, storage, countdown
```

## Run Locally
Open `index.html` in a browser, or run `npx serve .`

## Deploy
- **GitHub Pages:** push the repo → Settings → Pages → deploy from `main` branch, root folder.
- **Netlify / Vercel:** import the GitHub repo; no build command, publish directory `.`

## Git Workflow
```
git init
git add .
git commit -m "Add K Explore event website"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Implementation Notes
Events live in the `EVENTS` array in `script.js`; add or edit objects to change content. Colours are CSS variables in `style.css`, with a `[data-theme=dark]` override.
