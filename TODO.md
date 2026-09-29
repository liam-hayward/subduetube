# TODO

## Popup design
- [ ] Review the Tabler icon version. Some icons looked better than the emoji, some worse. Pick the best of each per row (slider steps and toggle rows), then mix them. Browse icons at https://tabler.io/icons. Icons must be pasted inline into `popup.html`, since extensions can't load remote files.

## To verify in Chrome
Confirmed working: hover-preview toggle, "Replace with text", "Hide 'You' section".

- [ ] "Replace with text": check the channel line shows the channel name and not the view count on newer cards.
- [ ] Hover previews at slider step 3: does a preview play over the text tiles? If so, switch previews off automatically at step 3.
- [ ] Autoplay switch, notification bell and tab-title count, end suggestions, live chat: confirm each on a real page.
- [ ] Trending / Explore and "More from YouTube": confirm both sections hide and "You" stays.
- [ ] Master switch: everything returns to normal when off, and comes back when on.
- [ ] Presets: Focus and Light set every toggle as described in the README.
- [ ] Shorts links: a direct `/shorts/...` link opens as a normal video when "Hide Shorts" is on.
- [ ] "Watch videos in colour": player is colour at greyscale, thumbnails stay grey.
- [ ] More options: counts, description, like and share bar, channel row, donate / merch, comment avatars.

## Ideas
- [ ] Redirect `youtube.com` (address bar, bookmarks) to Subscriptions when the home feed is hidden.
- [ ] Remaining donor-style options: hide the header, annotations.
- [ ] Shorten the manifest description if publishing: it is 133 characters and the Chrome Web Store allows 132.
- [ ] Rename the GitHub repo to match SubdueTube, then update the clone URL in the README.

## Done
- [x] Rename the extension to SubdueTube.
- [x] Master switch, presets, Shorts link redirect, hide counts, "More options" accordion.
