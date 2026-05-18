# Assets

Drop the following files here before running an EAS build:

| File                  | Size           | Notes                                                  |
|-----------------------|----------------|---------------------------------------------------------|
| `icon.png`            | 1024×1024 PNG  | No alpha, no rounded corners — stores apply the mask.   |
| `splash.png`          | 1242×2436 PNG  | Centered logo on solid background; transparent OK.      |
| `adaptive-icon.png`   | 1024×1024 PNG  | Android adaptive icon foreground. Safe zone in center.  |
| `favicon.png`         | 48×48 PNG      | Web favicon (only matters if we ship Expo web).         |

The Expo dev server will throw asset-not-found errors until these exist.
Placeholder generators:

- https://easyappicon.com/
- `npx create-expo-app` produces sample assets that can be copied in
  while waiting on the designer.

Final assets to come from the BidaWash brand pack (TBD).
