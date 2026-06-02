#!/usr/bin/env node
/**
 * PP Game Image Downloader & GitHub Uploader
 * 
 * Usage:
 *   node pp-image-upload.js
 *
 * Required env vars:
 *   SUPABASE_SERVICE_ROLE_KEY  — Supabase service role JWT
 *   GIT_TOKEN                  — GitHub personal access token
 */

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GIT_TOKEN = process.env.GIT_TOKEN;

if (!SERVICE_ROLE_KEY || !GIT_TOKEN) {
  console.error("ERROR: Missing env vars. Set SUPABASE_SERVICE_ROLE_KEY and GIT_TOKEN.");
  process.exit(1);
}

const SUPABASE_URL =
  "https://xjqrwcsxiaybpztzestb.supabase.co/rest/v1/game_cards" +
  "?provider_code=eq.pp&image_url=like.*pragmaticplay.net*&select=id,game_code,image_url&limit=500";
const GH_REPO = "ccorryxx-bot/game-assets";
const CONCURRENCY = 10;

async function fetchGames() {
  const resp = await fetch(SUPABASE_URL, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
  if (!resp.ok) throw new Error(`Supabase fetch failed: ${resp.status} ${await resp.text()}`);
  return resp.json();
}

async function downloadImage(url) {
  const resp = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const buf = await resp.arrayBuffer();
  return Buffer.from(buf);
}

async function uploadToGitHub(gameCode, imageBuffer) {
  const base64 = imageBuffer.toString("base64");
  const url = `https://api.github.com/repos/${GH_REPO}/contents/pp/${gameCode}.jpg`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const resp = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${GIT_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `feat: add PP game image ${gameCode}`,
        content: base64,
      }),
    });

    if (resp.status === 201) return "uploaded";
    if (resp.status === 422) return "exists";

    const body = await resp.text();
    if (attempt === 1) throw new Error(`GitHub ${resp.status}: ${body.slice(0, 200)}`);
    await new Promise((r) => setTimeout(r, 2000));
  }
}

async function updateDB(id, gameCode) {
  const newUrl = `https://cdn.jsdelivr.net/gh/${GH_REPO}@main/pp/${gameCode}.jpg`;
  const resp = await fetch(
    `https://xjqrwcsxiaybpztzestb.supabase.co/rest/v1/game_cards?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ image_url: newUrl }),
    }
  );
  if (resp.status !== 204) {
    throw new Error(`DB update HTTP ${resp.status}: ${await resp.text()}`);
  }
}

async function processGame(game, stats) {
  const { id, game_code, image_url } = game;

  // Download
  let imageBuffer;
  try {
    imageBuffer = await downloadImage(image_url);
    stats.downloaded++;
  } catch (err) {
    stats.failed.push({ game_code, step: "download", error: err.message });
    return;
  }

  // Upload to GitHub
  let uploadResult;
  try {
    uploadResult = await uploadToGitHub(game_code, imageBuffer);
    if (uploadResult === "uploaded") stats.githubUploaded++;
    else stats.skipped++;
  } catch (err) {
    stats.failed.push({ game_code, step: "github", error: err.message });
    return;
  }

  // Update DB
  try {
    await updateDB(id, game_code);
    stats.dbUpdated++;
  } catch (err) {
    stats.failed.push({ game_code, step: "db_update", error: err.message });
  }

  console.log(`  ✓ ${game_code} [${uploadResult}]`);
}

async function runBatch(items, fn, concurrency) {
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    await Promise.all(batch.map(fn));
    console.log(`Progress: ${Math.min(i + concurrency, items.length)}/${items.length}`);
  }
}

async function main() {
  console.log("=== PP Game Image Upload Pipeline ===\n");

  console.log("Step 1: Fetching game list from Supabase...");
  const games = await fetchGames();
  console.log(`Found ${games.length} games.\n`);

  const stats = {
    total: games.length,
    downloaded: 0,
    githubUploaded: 0,
    skipped: 0,
    dbUpdated: 0,
    failed: [],
  };

  console.log(`Step 2-4: Downloading, uploading, updating DB (${CONCURRENCY} concurrent)...\n`);
  await runBatch(games, (g) => processGame(g, stats), CONCURRENCY);

  console.log("\n=== FINAL REPORT ===");
  console.log(`Total games processed:       ${stats.total}`);
  console.log(`Images downloaded:           ${stats.downloaded}`);
  console.log(`GitHub uploads (new):        ${stats.githubUploaded}`);
  console.log(`GitHub skipped (existing):   ${stats.skipped}`);
  console.log(`DB updated:                  ${stats.dbUpdated}`);
  console.log(`Failed:                      ${stats.failed.length}`);

  if (stats.failed.length > 0) {
    console.log("\nFailed list:");
    stats.failed.forEach((f) =>
      console.log(`  ✗ ${f.game_code} [${f.step}]: ${f.error}`)
    );
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
