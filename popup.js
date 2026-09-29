// Each checkbox has data-key="<storage key>". Load saved values, save on change.
const boxes = document.querySelectorAll("input[data-key]");
const slider = document.getElementById("level");
const levelName = document.getElementById("level-name");
const levelIcon = document.getElementById("level-icon");

// Thumbnail slider. Position 0-4 is saved as thumbLevel; content.js maps it to classes.
const LEVEL_NAMES = ["Off", "Greyscale", "Greyscale + blur", "Replace with text", "Remove thumbnails"];
const LEVEL_ICONS = ["🎨", "⚪", "🌫️", "🔤", "🚫"];

const showLevel = (level) => {
    levelName.textContent = LEVEL_NAMES[level];
    levelIcon.textContent = LEVEL_ICONS[level];
};

// Fill every control from storage. "enabled" (master switch) counts as on unless saved as false.
const loadUI = () => {
    const keys = [...boxes].map((box) => box.dataset.key).concat("thumbLevel");
    chrome.storage.local.get(keys, (data) => {
        boxes.forEach((box) => {
            const key = box.dataset.key;
            box.checked = key === "enabled" ? data.enabled !== false : Boolean(data[key]);
        });
        slider.value = Number(data.thumbLevel) || 0;
        showLevel(slider.value);
        document.body.classList.toggle("paused", data.enabled === false);
    });
};

boxes.forEach((box) => {
    box.addEventListener("change", () => {
        chrome.storage.local.set({ [box.dataset.key]: box.checked });
        if (box.dataset.key === "enabled") {
            document.body.classList.toggle("paused", !box.checked);
        }
    });
});

slider.addEventListener("input", () => {
    showLevel(slider.value);
    chrome.storage.local.set({ thumbLevel: Number(slider.value) });
});

// Presets set every toggle at once. The master switch, "watch in colour" and "hide You section" are left alone.
const KEEP = ["enabled", "colourPlayer", "hideYou"];
const PRESETS = {
    focus: { toggles: true, thumbLevel: 3 },
    light: { toggles: false, thumbLevel: 1 }
};

document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
        const preset = PRESETS[button.dataset.preset];
        const values = { thumbLevel: preset.thumbLevel };
        boxes.forEach((box) => {
            if (!KEEP.includes(box.dataset.key)) values[box.dataset.key] = preset.toggles;
        });
        chrome.storage.local.set(values, loadUI);
    });
});

loadUI();
