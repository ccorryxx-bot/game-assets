# game-assets

Game card images for DiamondBett betting platform — served via jsDelivr CDN.

## Folder Structure

```
game-assets/
├── pg/     → PG Soft game icons     {game_uid}.jpg
├── pp/     → Pragmatic Play icons   {game_uid}.jpg
├── jili/   → JILI Gaming icons      {game_uid}.jpg
└── jdb/    → JDB Gaming icons       {game_uid}.jpg
```

## CDN URL Pattern

```
https://cdn.jsdelivr.net/gh/ccorryxx-bot/game-assets@main/{provider}/{game_uid}.jpg
```

## Example

```
https://cdn.jsdelivr.net/gh/ccorryxx-bot/game-assets@main/pg/1189baca156e1bbbecc3b26651a63565.jpg  ← Mahjong Ways
https://cdn.jsdelivr.net/gh/ccorryxx-bot/game-assets@main/pp/e30cd08c54817096e863975e309bb457.jpg  ← Waves of Poseidon
https://cdn.jsdelivr.net/gh/ccorryxx-bot/game-assets@main/jili/e794bf5717aca371152df192341fe68b.jpg ← Royal Fishing
https://cdn.jsdelivr.net/gh/ccorryxx-bot/game-assets@main/jdb/9341a18d096ad901ef77338998f29098.jpg  ← Dragon Soar
```

## How to Upload

1. Download ICON folder from Google Drive (Huidu shared folder)
2. Place images into matching provider subfolder (`pg/`, `pp/`, `jili/`, `jdb/`)
3. Commit and push to `main` branch
4. jsDelivr CDN serves them globally within minutes

