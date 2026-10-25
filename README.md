# Royal Walima Invitation

An interactive, mobile-first Walima invitation website in emerald and antique gold. It opens with a 3D "palace door" card, then shows the invitation in English and Urdu, the Walima details, a live countdown, venue directions and a WhatsApp RSVP.

It is a plain static site (HTML, CSS and vanilla JavaScript). It has no database, no build tools to install and no API keys.

```
royal-walima/
├── index.html          page structure
├── styles.css          all styling and animation
├── script.js           behaviour (intro, language, countdown, maps, RSVP, audio)
├── config.js           ← ALL wedding details live here
├── netlify.toml        hosting settings and security headers
├── scripts/set-og-url.mjs   Netlify build step (link preview image URL)
├── assets/             original artwork (SVG), paper texture, link-preview image
└── tools/              scripts that generated the artwork (not needed to run the site)
```

---

## 1. Details still needed from you

Nothing below has been invented. Each item shows as **"To be announced"** (or is hidden) until you fill it in.

| # | Detail | Where in `config.js` | Status |
|---|--------|----------------------|--------|
| 1 | **Groom's full name** (supplied as "D.") | `couple.groom.en`, then `confirmed: true` | ✗ unconfirmed |
| 2 | **Who "Daughter of Muqadar Hussain" refers to** | `family.introduction.confirmed` + `appliesTo` | ✗ unconfirmed |
| 3 | Urdu spelling of the bride's name (suggested: چوہدری مبین اشفاق) | `couple.bride.ur`, `urduConfirmed` | ✗ please verify |
| 4 | Urdu spelling of the groom's name | `couple.groom.ur`, `urduConfirmed` | ✗ missing |
| 5 | Urdu family line (suggested: دختر مقدر حسین) | `family.introduction.ur`, `urduConfirmed` | ✗ please verify |
| 6 | **Walima date** | `event.date` — `"YYYY-MM-DD"` | ✗ missing |
| 7 | **Walima time** (Pakistan time) | `event.time` — `"HH:MM"`, 24-hour | ✗ missing |
| 8 | **Venue name** | `venue.name.en` / `.ur` | ✗ missing |
| 9 | **Venue address** | `venue.address.en` / `.ur` | ✗ missing |
| 10 | Exact map pin (recommended) | `venue.mapsUrl` or `venue.lat` / `venue.lng` | ○ optional |
| 11 | **WhatsApp number for RSVPs** | `rsvp.whatsappNumber` | ✗ missing |
| 12 | Licensed background music (optional) | `music.src` | ○ optional |

To see this list on the live page at any time, add `?checklist` to the end of the address, for example `https://your-site.netlify.app/?checklist`.

---

## 2. Editing `config.js`

Open `config.js` in any text editor (Notepad, TextEdit or VS Code). Every field has a comment explaining it. Change only the text between the quotes, save, and refresh the page.

**Preview vs live**

- `mode: "preview"` (the current setting) shows a striped "Preview mode" ribbon and a **Checklist** button. Unconfirmed details appear with a dotted orange underline.
- `mode: "live"` is for guests. The ribbon disappears, and anything marked `confirmed: false` is hidden completely.
- Switch to `"live"` only when the checklist has no ✗ items.

**Example of a completed event section**

```js
event: {
  date: "2026-12-20",     // 20 December 2026
  time: "19:30",          // 7:30 PM Pakistan time
  dateText: { en: "", ur: "" },   // leave empty to format automatically
  timeText: { en: "", ur: "" },
},
```

The date and time are always treated as **Pakistan Standard Time (UTC+05:00)**, so the countdown is correct wherever a guest opens the link.

**Groom's name and family line, once confirmed**

```js
groom: { en: "Full Name", ur: "اردو نام", confirmed: true, urduConfirmed: true },
...
introduction: { en: "Daughter of Muqadar Hussain", ur: "دختر مقدر حسین",
                confirmed: true, urduConfirmed: true, appliesTo: "bride" }, // or "groom", or ""
```

**Venue.** Fill in the name and address. For an exact pin, either:
- in Google Maps, open the venue, tap **Share → Copy link** and paste it into `mapsUrl`, or
- long-press the location, copy the coordinates (for example `31.5204, 74.3587`) and put them in `lat` / `lng`.

**WhatsApp.** Any of `"923001234567"`, `"+92 300 1234567"` or `"0300 1234567"` works.

**Wording.** All invitation text is in `text.en` and `text.ur` at the bottom of the file. Names, the date and the venue are inserted automatically.

**Music**

- Copy an instrumental track **you have the rights to use** into `assets/` and set `music.src: "assets/wedding-music.mp3"`. MP3 files under about 3 MB load fastest.
- Without a file, the button plays a soft harp-and-drone ambience generated in the browser. It is original, so there is nothing to license. To have no music instead, set `generatedAmbience: false`.
- Audio never starts on its own. Mobile browsers only allow sound after a tap, so music starts when the guest taps **Open your invitation** or the ♪ button.
- The opening chime works the same way: it uses `openingSound.src` if you set it, otherwise a gentle chime is generated.

**Feature switches.** Use `features` to turn off the intro, particles, parallax, countdown, venue, RSVP or music.

---

## 3. Try it on your computer

The page loads `config.js` as a separate file, so open it through a small local server rather than by double-clicking:

```bash
cd royal-walima
python3 -m http.server 8000      # then open http://localhost:8000
```

Useful address extras: `?lang=ur` (start in Urdu), `?nointro` (skip the opening), `?checklist` (open the checklist).

---

## 4. Publish on Netlify (free) and get a shareable link

### Option A: drag and drop (simplest, about 2 minutes)

1. Fill in `config.js` and set `mode: "live"`.
2. Edit one line in `index.html` so WhatsApp can show the preview picture. This needs your final address, so do it after step 5 and then drag the folder again:
   `<meta property="og:image" content="https://YOUR-SITE.netlify.app/assets/og-image.jpg">`
3. Go to **https://app.netlify.com/drop** and log in or create a free account.
4. Drag the whole **`royal-walima` folder** onto the page.
5. Netlify gives you an address such as `https://random-name-123.netlify.app`. Rename it under **Site configuration → Change site name**, for example `mubeen-walima`.
6. To update details later, edit `config.js`, open the site in Netlify, go to **Deploys**, and drag the folder again.

### Option B: from GitHub (updates publish automatically)

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project** → choose the repository.
3. If the folder is inside a larger repository, set **Base directory** to `royal-walima`. Leave the build command and publish directory as they are, because `netlify.toml` already sets them.
4. Deploy. The build step fills in the preview-image address automatically, so step 2 of Option A isn't needed.

### Option C: Netlify command line

```bash
npm install -g netlify-cli
cd royal-walima
netlify login
netlify deploy --prod --dir .
```

With this option the build step doesn't run, so edit the `og:image` line as in Option A.

**After publishing**
- Open the link on your phone. It should start with `https://`, and the padlock should show.
- Send the link to yourself on WhatsApp to check the preview card. WhatsApp caches previews, so if you changed the image, add `?v=2` to the link.
- Run through it once: open the invitation, switch to Urdu, tap **Get directions**, and send a test RSVP to your own number.

Guests just tap the link. There's no app and no account, and the site is set to stay out of search engines (`noindex`).

---

## 5. Privacy and security

- No secrets, keys or admin logins anywhere in the code.
- RSVPs are **not stored** by the website. Each guest's answers are written into a WhatsApp message, and the guest presses Send themselves. The page says this to guests.
- No guest list is published, and nothing is tracked.
- `netlify.toml` adds a strict Content-Security-Policy and other security headers.

---

## 6. Testing report

Tested in headless Chromium using an automated script (59 checks, all passing), plus screenshots reviewed at 390×844 (iPhone-size), 320×568 (iPhone SE) and 1440×900 (desktop).

**Verified with your real configuration (preview mode)**
- The first screen loads. The 3D card floats, the doors rotate in 3D when tapped (checked via the 3D transform matrix), and the camera move lands the inner card exactly on the page's cover card.
- The card opens from either the card or the button. **Skip** ends the intro at once, **Replay** shows it again, and the full sequence finishes by itself in about 4 seconds.
- Reduced-motion setting: the intro becomes a quick fade (under 1 s), with no particles and no parallax.
- The forced "no 3D support" fallback still opens (the doors slide apart instead).
- The page still opens even if `config.js` fails to load.
- English ⇄ Urdu: the layout switches to right-to-left, the Noto Nastaliq Urdu font loads, and switching keeps the RSVP entries, the countdown and the intro state.
- Missing details show "To be announced". The countdown shows a waiting message instead of a fake date. The directions and RSVP buttons are disabled, with an explanation.
- "D." and the family line show as unconfirmed in preview, and the family line is kept separate from both names.
- Music starts only after a tap (audio context confirmed "running"), and can be stopped and restarted.
- No console errors, and no horizontal scrolling at any tested size.
- Works under the production Content-Security-Policy with no violations.

**Verified with a temporary TEST configuration.** This was injected only during testing; the dummy date, venue and number were **not** saved into `config.js`.
- The countdown targets 19:30 PKT = 14:30 UTC correctly, to the second, and ticks.
- English and Urdu date and time formatting ("Sunday, 20 December 2026", "اتوار، 20 دسمبر 2026", "شام 7:30 بجے").
- The Google Maps link uses coordinates, or falls back to a name and address search. The embedded map loads only when "Show map" is tapped.
- WhatsApp: `0300 1234567` becomes `wa.me/923001234567`. The pre-filled message contains the name, attendance, number of attendees and message, in English or Urdu. "Not attending" leaves out the attendee count. An empty name is blocked.
- Live mode hides the ribbon and every unconfirmed detail.
- A past date shows a closing message instead of a negative countdown.

**Not verifiable here (please check on real phones after publishing)**
- Actual sound output and how the generated ambience sounds. Headless browsers have no speakers; only playback state was checked.
- That the WhatsApp app and Google Maps app open from the buttons on iPhone and Android. The links follow the official `wa.me` and `google.com/maps/dir` formats.
- WhatsApp's link-preview card, which needs the published https address.
- Real iOS Safari behaviour. Testing used Chromium only.

---

## 7. Credits and licences

All artwork (florals, Mughal arch, medallion, girih pattern, paper texture, preview image) was drawn procedurally for this project by `tools/generate-ornaments.mjs` and `tools/generate-texture.py`. No third-party artwork is used. Fonts are from Google Fonts (SIL Open Font License): Cinzel, Cormorant Garamond, Great Vibes, Amiri and Noto Nastaliq Urdu.
