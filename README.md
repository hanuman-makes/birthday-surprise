# 🎀 Kawaii Birthday Surprise — Advanced Version

This version keeps the advanced flow and restores the features from the reference design:

1. 🔐 Cute birthday PIN dial pad
2. 💕 YES / NO prank (YES grows, NO shrinks)
3. 🏹 Cupid mini-game — shoot the heart with the bow
4. 💌 Premium animated envelope inspired by a real wax-sealed invitation
5. 🎂 Centered candle + microphone blow detection + 5-second fallback
6. 🔦 Black-screen bunny torch walk + spotlight birthday reveal
7. 🧵 Hanging memory photos revealed one at a time by pulling the string
8. 🎥 Bunny introduces the Google Drive videos
9. 🎵 Background music pauses while a video plays and resumes afterward
10. 💖 Final birthday message
11. ☁️ Google Drive API + Photos Folder ID + Videos Folder ID setup modal
12. 🐰 Replaceable GIF/PNG/WebP/JPG character
13. 📱 Responsive mobile + desktop design

## Files

- `index.html` — all screens and setup modal
- `style.css` — animations and premium visual design
- `app.js` — interactions, microphone, Drive API, media and music logic
- `config.js` — permanent personal settings
- `assets/character.gif` — small default animated bunny
- `assets/birthday-music.mp3` — add your own music here

## 1. Personal settings

Open `config.js` and change:

```js
personName: "YOUR PERSON'S NAME",
birthDate: "2005-04-07",
birthdayPin: "DDMMYYYY",
```

The age is calculated automatically from `birthDate`, so you do not need to edit the age every year.

## 2. Character

Put a character file in `assets/` and change:

```js
character: {
  image: "assets/character.gif",
  emoji: "🐰"
}
```

GIF, PNG, WebP and JPG are supported. The same character is reused throughout the website.

## 3. Google Drive setup

Create two public Viewer folders:

```text
Birthday Surprise
├── Photos
└── Videos
```

You can use the two folder IDs directly in `config.js`:

```js
googleDrive: {
  apiKey: "YOUR_API_KEY",
  photosFolderId: "YOUR_PHOTOS_FOLDER_ID",
  videosFolderId: "YOUR_VIDEOS_FOLDER_ID"
}
```

Edit these values in `config.js` before deploying. The website does not expose a Drive setup editor to visitors.

Folder ID is the value after `/folders/` in a Drive folder URL.

### API key

In Google Cloud:

1. Create/select a project.
2. Enable **Google Drive API**.
3. Create an API key.
4. Restrict the key to **Google Drive API**.
5. Add an HTTP referrer restriction for your deployed website.

The API key is browser-visible. It is not a private password.

## 4. Photos and videos

Upload images into the Photos folder and videos into the Videos folder.

The site fetches them when the birthday reveal reaches the memories section.

Photos are intentionally **not shown as a normal gallery**. One photo is revealed at a time from a hanging thread after pressing **Pull the string**.

## 5. Music

Put your music file at:

```text
assets/birthday-music.mp3
```

Then edit `config.js` if you want another filename.

When a Google Drive video starts:

- background music pauses
- video plays normally
- background music resumes when the video pauses/ends

## 6. Run locally

1. Extract the ZIP.
2. Open the folder in VS Code.
3. Open `config.js` and enter your test name/PIN/birth date.
4. Install **Live Server** if needed.
5. Right-click `index.html` → **Open with Live Server**.
6. Test the complete flow.

Microphone blow detection works best on a browser context that allows microphone permission. The candle also has a manual button and automatic 5-second fallback.

## 7. GitHub Pages

Upload the project contents so `index.html` is at the repository root. Then use:

**Settings → Pages → Deploy from a branch → main → /(root)**

This is a static website, so the Drive API key is visible to visitors. The PIN is also a fun gate, not real authentication.

## 8. Important Drive limitation

The website can read public Google Drive folders through the Drive API. It cannot make the folders private while simultaneously allowing an unauthenticated public GitHub Pages website to read them.

If you need truly private media, use a backend/authenticated storage system rather than exposing Drive access from browser JavaScript.
