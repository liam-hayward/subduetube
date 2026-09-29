# SubdueTube

A Chrome extension that makes YouTube less engaging. It started as a one-click greyscale switch and now also dims, replaces or removes thumbnails and hides the parts of the site designed to keep you watching.

Click the toolbar icon to open the popup. Everything is controlled from there.

---

## Features

### Thumbnail slider

One slider with five steps. Each step replaces the last:

| Step | What you get |
|---|---|
| Off | Normal YouTube |
| Greyscale | Thumbnails and hover previews in greyscale. Videos you open and channel pictures stay in colour |
| Greyscale + blur | Greyscale, plus blurred thumbnails |
| Replace with text | Each thumbnail becomes a text tile showing the video title and channel name |
| Remove thumbnails | Thumbnails hidden; title and channel text stay |

Blur is only used at step 3, so it never blurs the text tiles.

**Make channel pictures greyscale** sits under the slider. It is off by default and works at any slider step.

The slider only affects how you *choose* a video. Once you open one, it plays in colour unless you switch on **Make videos greyscale** (under Video page).

### Master switch

The switch at the top right of the popup pauses everything without losing your settings. The toolbar icon goes inactive too.

### Toggles

| Group | Toggle | Effect |
|---|---|---|
| Home & feeds | Hide Shorts | Removes Shorts shelves, videos and sidebar links. Direct Shorts links open as normal videos |
| | Hide home feed | Hides the home grid and the Home button. Opening the home page (logo, address bar, bookmark) goes to Subscriptions instead |
| | Hide Trending / Explore | Removes the Explore section and pages |
| Video page | Hide comments | Hides the comments section |
| | Hide recommended | Hides the suggested-videos list |
| | Hide end suggestions | Hides the end-of-video wall, in-video cards and the pause overlay |
| | Hide live chat | Hides the chat panel on live streams |
| | Make videos greyscale | Turns every video player greyscale: watch page, Shorts and miniplayer. Off by default, and works at any slider step |
| Attention | Turn off autoplay | Switches off the "up next" autoplay toggle in the player |
| | Hide notifications | Hides the bell and removes the unread count from the tab title |
| | Stop hover previews | Stops the video preview that plays when you hover a thumbnail |

### More options

A collapsed section in the popup, for the smaller changes:

| Group | Toggle | Effect |
|---|---|---|
| Video page | Hide counts, date & hashtags | Hides the subscriber count, the like count, and the "views · date · #hashtags" line at the top of the description. Video cards elsewhere keep their counts |
| | Hide description | Hides the whole description box, including the "views · date · #hashtags" line |
| | Hide like & share bar | Hides the whole button row: like, share, Ask, save, and the ⋯ menu (download, report) |
| | Hide channel row | Hides the channel name, avatar, subscriber count and subscribe button under the player |
| | Hide donate / merch | Hides donation, merch and ticket shelves |
| | Hide comment avatars | Hides profile pictures beside comments |
| Sidebar | Hide "More from YouTube" | Hides the Premium, Music and Kids section of the sidebar |
| | Hide "You" section | Hides History, Playlists, Watch later and Liked videos in the sidebar |

Settings are remembered across tabs and browser restarts, and change in all open YouTube tabs at once.

---

## Installation

> This extension is not yet on the Chrome Web Store. Install it manually in developer mode.

1. **Clone this repository**
   ```bash
   git clone https://github.com/liam-hayward/subduetube
   ```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions`
   - Enable **Developer mode** (toggle in the top-right corner)

3. **Load the extension**
   - Click **Load unpacked**
   - Select the cloned folder

4. **Done!**
   - Click the extension icon on a YouTube page to open the popup
   - After updating the code, click the reload arrow on the extension card, then refresh YouTube

---

## File Structure

```
SubdueTube/
├── manifest.json      # Extension config (Manifest V3)
├── popup.html         # The settings popup: master switch, slider, toggles
├── popup.js           # Loads and saves popup settings in chrome.storage
├── background.js      # Keeps the toolbar icon in sync with the master switch and slider
├── content.js         # Turns settings into classes on the page; text tiles, autoplay, tab title, redirects
├── style.css          # All the visual rules, one block per feature
├── TODO.md            # Open tasks and ideas
├── icon16.png         # Toolbar icons (plus -active versions shown when the slider is above Off)
├── icon48.png
└── icon128.png
```

---

## How It Works

1. **`popup.js`** saves each setting to `chrome.storage.local`. The slider is stored as one number, `thumbLevel` (0 to 4), each toggle as true/false, and the master switch as `enabled`. A setting that has never been saved counts as off, except the master switch, which counts as on.
2. **`content.js`** runs on every YouTube page. It reads the settings, adds a class to `<html>` for each active one (for example `hide-shorts`), and redraws whenever storage changes, so all open tabs follow. If the master switch is off, no classes are added.
3. **`style.css`** contains rules that only apply when the matching class is present, such as `html.hide-shorts ytd-reel-shelf-renderer { display: none }`.
4. Five features need JavaScript, not just CSS: the text tiles (copy each card's title and channel into the thumbnail), autoplay (clicks YouTube's own switch off), the tab title (strips the "(3)" count), the home page redirect, and the Shorts link redirect.
5. **`background.js`** swaps the toolbar icon to its active version whenever the master switch is on and the slider is above Off.

---

## Known limitations

- YouTube changes its page markup often. If a toggle stops working, its selector in `style.css` or `content.js` probably needs updating.
- Turning off autoplay changes YouTube's own autoplay setting, which is saved to your account when signed in.

---

## Contributing

Pull requests are welcome! If you find a bug or have a feature suggestion, please [open an issue](https://github.com/liam-hayward/subduetube/issues).

---

## License

[MIT](LICENSE)
