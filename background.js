// The toolbar icon opens popup.html, so there is no click handler here.
// This file only keeps the icon in sync: "active" when SubdueTube is switched on
// and the thumbnail slider is above Off.

function refreshIcon() {
    chrome.storage.local.get(["thumbLevel", "enabled"], (data) => {
        const isActive = data.enabled !== false && Number(data.thumbLevel) > 0;
        chrome.action.setIcon({
            path: isActive
                ? { 16: "icon16-active.png", 48: "icon48-active.png", 128: "icon128-active.png" }
                : { 16: "icon16.png", 48: "icon48.png", 128: "icon128.png" }
        });
    });
}

// Runs whenever the slider or master switch changes, whether from the popup or another window
chrome.storage.onChanged.addListener((changes) => {
    if (changes.thumbLevel || changes.enabled) refreshIcon();
});

// Restore correct icon on browser startup, and after install, update or reload
chrome.runtime.onStartup.addListener(refreshIcon);
chrome.runtime.onInstalled.addListener(refreshIcon);
