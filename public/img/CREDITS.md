# Image credits

## Current state: placeholders, not sourced yet

Every JPG directly in `/public/img/` right now (`hero-living-room.jpg`, `room-*.jpg`, `moving-boxes.jpg`, `pcb-macro.jpg`, `case-camelx.jpg`, `case-soil.jpg`) is a **generated placeholder** from `scripts/dev-placeholder-images.mjs` — a flat navy/paper gradient stamped with a label describing what real photo belongs there. None of these are sourced from Pexels/Unsplash or anywhere else; there is nothing to credit yet.

Team headshots (`/public/img/team/*.webp`) ARE real: processed from Amir's own upload via `scripts/images.mjs` (the real pipeline), not placeholders.

## Before launch: source and log real photography here

For each placeholder above, search Pexels/Unsplash using the shot list in `LMX_Build_Prompt_v2.md` Step 12.1, save the master into `/assets-src/img/` under the matching name (e.g. a real "apartment living room, evening lamps" photo saved as `assets-src/img/hero-living-room.jpg`), then run `npm run images` to generate the real responsive derivatives and delete the flat placeholder of the same name from `/public/img/`.

Log each one here as it's sourced:

| File | Source URL | Licence | Downloaded |
| --- | --- | --- | --- |
| hero-living-room | PLACEHOLDER: not yet sourced | | |
| room-lights | PLACEHOLDER: not yet sourced | | |
| room-fans | PLACEHOLDER: not yet sourced | | |
| room-leds | PLACEHOLDER: not yet sourced | | |
| room-tv | PLACEHOLDER: not yet sourced | | |
| room-water-pump | PLACEHOLDER: not yet sourced | | |
| room-security | PLACEHOLDER: not yet sourced | | |
| room-curtains | PLACEHOLDER: not yet sourced | | |
| room-ac | PLACEHOLDER: not yet sourced | | |
| moving-boxes | PLACEHOLDER: not yet sourced | | |
| pcb-macro | PLACEHOLDER: not yet sourced | | |
| case-camelx | PLACEHOLDER: not yet sourced | | |
| case-soil | PLACEHOLDER: not yet sourced | | |

## Video (not yet added at all)
No video loops exist in this build. Per the Build Prompt Step 12.1, up to two short (3&#8211;6s), silent, faceless texture loops could go in the Keychain section background and the Renters section — source via `ffmpeg`-friendly free clips, save masters into `/assets-src/video/`, run `npm run video`, then wire a `<video data-loop>` element (see `ui/video.js` and Technical Spec 10.4) into the target section.
