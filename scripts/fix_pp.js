#!/usr/bin/env node
// DiamondBett PP Image Fixer - Run with VPN ON
// Usage: node fix_pp.js

const https = require('https');
const SERVICE_ROLE_KEY = 'PASTE_SERVICE_ROLE_KEY_HERE';
const GIT_TOKEN = 'PASTE_GIT_TOKEN_HERE';

const SUPABASE_URL = 'https://xjqrwcsxiaybpztzestb.supabase.co';
const REPO = 'ccorryxx-bot/game-assets';

const sbH = { 'apikey': SERVICE_ROLE_KEY, 'Authorization': 'Bearer ' + SERVICE_ROLE_KEY, 'Content-Type': 'application/json' };
const ghH = { 'Authorization': 'token ' + GIT_TOKEN, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };

function dlImage(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) return dlImage(res.headers.location).then(resolve).catch(reject);
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function ghUpload(code, buf) {
  const url = 'https://api.github.com/repos/' + REPO + '/contents/pp/' + code + '.jpg';
  const check = await fetch(url, { headers: ghH });
  const body = { message: 'feat: add PP image ' + code, content: buf.toString('base64') };
  if (check.status === 200) body.sha = (await check.json()).sha;
  const r = await fetch(url, { method: 'PUT', headers: ghH, body: JSON.stringify(body) });
  return r.status;
}

async function dbUpdate(id, code) {
  const url = 'https://cdn.jsdelivr.net/gh/ccorryxx-bot/game-assets@main/pp/' + code + '.jpg';
  const r = await fetch(SUPABASE_URL + '/rest/v1/game_cards?id=eq.' + id, {
    method: 'PATCH', headers: { ...sbH, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ image_url: url })
  });
  return r.status;
}

async function main() {
  // Fetch remaining broken games
  const r = await fetch(SUPABASE_URL + '/rest/v1/game_cards?provider_code=eq.pp&image_url=like.*pragmaticplay.net*&select=id,game_name,game_code,image_url&limit=300',
    { headers: { 'apikey': SERVICE_ROLE_KEY, 'Authorization': 'Bearer ' + SERVICE_ROLE_KEY } });
  const games = await r.json();
  console.log('Games to fix:', games.length);
  if (!games.length) { console.log('All fixed already!'); return; }

  let ok = 0, fail = 0;
  for (let i = 0; i < games.length; i++) {
    const g = games[i];
    process.stdout.write('[' + (i+1) + '/' + games.length + '] ' + g.game_name.substring(0,30) + ' ... ');
    try {
      const buf = await dlImage(g.image_url);
      const ghStatus = await ghUpload(g.game_code, buf);
      if (ghStatus !== 200 && ghStatus !== 201) throw new Error('GitHub status ' + ghStatus);
      await dbUpdate(g.id, g.game_code);
      ok++;
      console.log('OK (' + buf.length + ' bytes)');
    } catch(e) {
      fail++;
      console.log('FAIL: ' + e.message);
    }
    // Small delay
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('
=== Done! OK:', ok, 'Failed:', fail, '===');
}
main().catch(e => { console.error(e); process.exit(1); });
