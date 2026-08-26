V4 review build
- Reformatted opening 'At each stop' section into three spacious illustrated steps.
- Replaced emoji garden map with CSS-drawn garden illustration and unlabeled shed.
- Replaced fashion-boot emoji with drawn green garden wellies.
- Boots begin walking automatically after returning from each completed stop.
- Added written plant symptoms above weather data on every scenario.
- Weather data enlarged to fill the clue box.
- Increased question and answer text size/padding.
- Restored a distinct conclusion page with smaller 'The plant is a clue—not the whole picture' takeaway.
- Conclusion uses a garden-toned background and has no stops or boots.

v5
- Garden map is now based on one cohesive illustrated garden image rather than CSS-drawn beds/trees/shed.
- Interactive stop markers and garden wellies are separate HTML overlays.
- Same garden artwork is reused behind the conclusion without interactive markers.

v6
- Fixed title-page step layout: number + icon + text are aligned in one row.
- Rebuilt map stop markers so they appear as compact overlays rather than bottom buttons.
- Rebuilt garden wellies as larger, high-contrast overlays.
- Restored interactive progression: complete scenario -> return to garden -> brief pause -> boots move -> next stop unlocks.

v7
- Simplified title-page steps to number + icon + text on one row.
- Enter the Garden button now uses a direct onclick handler with global show() fallback.

v9
- Re-cropped the garden image to include the full bottom edge.
- Forced natural image aspect ratio with no vertical cropping.
- Boots now move between four independent overlay positions rather than following the illustrated path.

v11
- Removed the static boots baked into the garden background.
- Replaced moving wellies with a simpler illustrated garden-step marker.
- Set four explicit overlay destinations beside the visible plant-stop labels.
- Slightly realigned click hotspots to match the visible stop labels.

v12
- Removed animated boots entirely.
- Garden navigation is now simple sequential unlocking: complete a stop, return to the garden, and the next stop becomes clickable.
