const html = document.documentElement;

// storage key -> class added to <html>. style.css reacts to these classes.
const FEATURES = {
    hideShorts: "hide-shorts",
    hideComments: "hide-comments",
    hideRecommended: "hide-recommended",
    hideFeed: "hide-feed",
    hidePreview: "hide-preview",
    hideNotifs: "hide-notifs",
    hideEndscreen: "hide-endscreen",
    hideTrending: "hide-trending",
    hideChat: "hide-chat",
    stopAutoplay: "stop-autoplay",
    colourPlayer: "colour-player",
    // "More options" accordion in the popup
    hideCounts: "hide-counts",
    hideDesc: "hide-desc",
    hideActions: "hide-actions",
    hideOwner: "hide-owner",
    hideBanners: "hide-banners",
    hideCommentAvatars: "hide-comment-avatars",
    hideMoreYt: "hide-more-yt",
    hideYou: "hide-you"
};

// The popup slider stores one number, thumbLevel. Each step adds to the last,
// except that only one thumbnail treatment is active at a time (so blur never
// lands on the text tile):
//   0 off | 1 greyscale | 2 greyscale + blur | 3 replace with text | 4 remove
const LEVEL_CLASSES = {
    "grey-mode": (level) => level >= 1,
    "blur-mode": (level) => level === 2,
    "replace-thumbnails": (level) => level === 3,
    "hide-thumbnails": (level) => level === 4
};

// All saved settings, kept here so any one change can redraw the whole page state.
// "enabled" is the master switch; it counts as on unless explicitly false.
let settings = {};

const setClass = (className, isOn) => {
    const wasOn = html.classList.contains(className);
    html.classList.toggle(className, isOn);
    if (wasOn === isOn) return;
    if (className === "replace-thumbnails") syncTextTiles();
    if (className === "hide-notifs") stripTitleCount();
    if (className === "stop-autoplay" && isOn) pollAutoplay();
    if (className === "hide-shorts" && isOn) redirectShorts();
};

const render = () => {
    const enabled = settings.enabled !== false;
    for (const [key, className] of Object.entries(FEATURES)) {
        setClass(className, enabled && Boolean(settings[key]));
    }
    const level = enabled ? Number(settings.thumbLevel) || 0 : 0;
    for (const [className, isOn] of Object.entries(LEVEL_CLASSES)) {
        setClass(className, isOn(level));
    }
};

// When the home feed is hidden, the logo would lead to a blank page.
// Send it to Subscriptions instead. YouTube handles logo clicks itself
// (without a real page load), so we catch the click first, in the capture phase.
const SUBSCRIPTIONS_URL = "https://www.youtube.com/feed/subscriptions";

document.addEventListener("click", (event) => {
    if (!html.classList.contains("hide-feed")) return;
    if (!event.target.closest("a#logo")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.href = SUBSCRIPTIONS_URL;
}, true);

// With Shorts hidden, a direct /shorts/<id> link opens as a normal video instead.
const redirectShorts = () => {
    if (!html.classList.contains("hide-shorts")) return;
    const match = location.pathname.match(/^\/shorts\/([\w-]+)/);
    if (match) location.replace("/watch?v=" + match[1]);
};
window.addEventListener("yt-navigate-finish", redirectShorts);

// 1. Initial check when the page first loads
chrome.storage.local.get([...Object.keys(FEATURES), "thumbLevel", "enabled"], (data) => {
    settings = data;
    render();
});

// 2. The Watcher: If storage changes (even in another tab), update this page
chrome.storage.onChanged.addListener((changes) => {
    for (const [key, change] of Object.entries(changes)) {
        settings[key] = change.newValue;
    }
    render();
});

// ---- Replace thumbnails: show title + channel as a text tile over the image ----
// The image stays in place (hidden by style.css) so its link, size and hover
// behaviour keep working. The tile is drawn on top and ignores clicks.
const CARD_SELECTOR = "ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model";
const THUMB_SELECTOR = "ytd-thumbnail, yt-thumbnail-view-model";
const TITLE_SELECTOR = "#video-title, .ytLockupMetadataViewModelTitle, .yt-lockup-metadata-view-model__title, h3";
const CHANNEL_SELECTOR = "ytd-channel-name #text, ytd-channel-name a, .ytContentMetadataViewModelMetadataText, .yt-content-metadata-view-model__metadata-text";

const setText = (el, text) => {
    if (el.textContent !== text) el.textContent = text;
};

const syncTextTiles = () => {
    if (!html.classList.contains("replace-thumbnails")) {
        document.querySelectorAll(".text-tile").forEach((tile) => tile.remove());
        return;
    }
    document.querySelectorAll(THUMB_SELECTOR).forEach((thumb) => {
        if (thumb.parentElement.closest(THUMB_SELECTOR)) return; // nested thumbnail
        const card = thumb.closest(CARD_SELECTOR);
        if (!card) return; // not a video card (e.g. the player)
        const title = card.querySelector(TITLE_SELECTOR);
        if (!title) return;
        const channel = card.querySelector(CHANNEL_SELECTOR);

        let tile = thumb.querySelector(":scope > .text-tile");
        if (!tile) {
            tile = document.createElement("div");
            tile.className = "text-tile";
            tile.append(document.createElement("div"), document.createElement("div"));
            tile.children[0].className = "text-tile-title";
            tile.children[1].className = "text-tile-channel";
            if (getComputedStyle(thumb).position === "static") thumb.style.position = "relative";
            thumb.append(tile);
        }
        // YouTube reuses card elements for new videos, so refresh the text every scan
        setText(tile.children[0], title.textContent.trim());
        setText(tile.children[1], channel ? channel.textContent.trim() : "");
    });
};

// New cards appear as you scroll. Rescan (at most every 300ms) when the page changes.
let scanTimer = null;
new MutationObserver(() => {
    if (scanTimer || !html.classList.contains("replace-thumbnails")) return;
    scanTimer = setTimeout(() => {
        scanTimer = null;
        syncTextTiles();
    }, 300);
}).observe(html, { childList: true, subtree: true });

// ---- Notifications: remove the "(3)" unread count from the tab title ----
const stripTitleCount = () => {
    if (!html.classList.contains("hide-notifs")) return;
    const clean = document.title.replace(/^\(\d+\)\s*/, "");
    if (clean !== document.title) document.title = clean;
};

// The <title> element may not exist yet at document_start, so wait for it.
const watchTitle = () => {
    const titleEl = document.querySelector("title");
    if (!titleEl) return false;
    new MutationObserver(stripTitleCount).observe(titleEl, { childList: true });
    stripTitleCount();
    return true;
};
if (!watchTitle()) {
    const waitForTitle = new MutationObserver(() => {
        if (watchTitle()) waitForTitle.disconnect();
    });
    waitForTitle.observe(html, { childList: true, subtree: true });
}

// ---- Autoplay: click YouTube's own "Autoplay" switch off ----
// The switch only exists once the player has loaded, so retry for ~15 seconds
// after each page load or in-site navigation.
const turnOffAutoplay = () => {
    if (!html.classList.contains("stop-autoplay")) return;
    const toggle = document.querySelector(".ytp-autonav-toggle-button");
    if (toggle && toggle.getAttribute("aria-checked") === "true") toggle.click();
};

let autoplayTimer = null;
const pollAutoplay = () => {
    clearInterval(autoplayTimer);
    let tries = 0;
    autoplayTimer = setInterval(() => {
        turnOffAutoplay();
        if (++tries >= 15) clearInterval(autoplayTimer);
    }, 1000);
};

// YouTube fires this after each in-site page change
window.addEventListener("yt-navigate-finish", pollAutoplay);
