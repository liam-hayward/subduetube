# TODO

## Popup design
- [ ] Review the Tabler icon version. Some icons looked better than the emoji, some worse. Pick the best of each per row (slider steps and toggle rows), then mix them. Browse icons at https://tabler.io/icons. Icons must be pasted inline into `popup.html`, since extensions can't load remote files.

## To verify in Chrome
Confirmed working: hover-preview toggle, hover previews greyscale at the Greyscale step, home page redirect, like count hidden, "Replace with text", "Hide 'You' section".

- [ ] "Replace with text": check the channel line shows the channel name and not the view count on newer cards.
- [ ] Hover previews at slider step 3: does a preview play over the text tiles? If so, switch previews off automatically at step 3.
- [ ] Autoplay switch, notification bell and tab-title count, end suggestions, live chat: confirm each on a real page.
- [ ] Trending / Explore and "More from YouTube": confirm both sections hide and "You" stays.
- [ ] Master switch: everything returns to normal when off, and comes back when on.
- [ ] Shorts links: a direct `/shorts/...` link opens as a normal video when "Hide Shorts" is on.
- [ ] Home redirect: with "Hide home feed" on, the logo, typing `youtube.com`, and Back to the home page all land on Subscriptions.
- [ ] Toolbar icon: after reloading the extension, the icon matches the slider without touching a setting.
- [ ] "Make channel pictures greyscale": off by default, channel pictures in colour at every slider step (including blur); when on, they go grey even with the slider at Off. Check feed cards, the channel row under a video, comments and the sidebar.
- [ ] "Make videos greyscale": off by default, player in colour at every slider step; when on, watch page, Shorts and miniplayer go grey even with the slider at Off.
- [ ] More options: counts, description, like and share bar, channel row, donate / merch, comment avatars.

## Ideas
- [ ] Revisit: clickbait badges on text tiles ("Replace with text"). A rule list in `content.js` tests each title and shows small labels under the channel name. Trialled once, then removed. Rules tried: Shouting (2+ ALL-CAPS words of 3+ letters), Hype ("insane", "shocking", "unbelievable", "!!"), Curiosity gap (ends in "...", "you won't believe", "what happened next"), Urgency ("before it's too late", "last chance", "watch now"), Listicle ("Top 10", "5 things"). Known issue: acronyms ("AMD vs NVIDIA") trigger Shouting; a bare "?" is too loose for Curiosity gap. English titles only. About 45 minutes to rebuild.
- [ ] Remaining donor-style options: hide the header, annotations.
- [ ] Shorten the manifest description if publishing: it is 133 characters and the Chrome Web Store allows 132.
- [ ] Rename the GitHub repo to match SubdueTube, then update the clone URL in the README.

## Done
- [x] Rename the extension to SubdueTube.
- [x] Master switch, Shorts link redirect, hide counts, "More options" accordion.
