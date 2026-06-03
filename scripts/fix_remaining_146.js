#!/usr/bin/env node
// Run this script locally (not from Myanmar) where static.pragmaticplay.net is accessible
// Usage: SUPABASE_KEY=<service_role_key> GIT_TOKEN=<token> node fix_remaining.js

const https = require('https');
const fs = require('fs');

const GIT_TOKEN = process.env.GIT_TOKEN;
const KEY = process.env.SUPABASE_KEY;
const SUPABASE_URL = 'https://xjqrwcsxiaybpztzestb.supabase.co';
const REPO = 'ccorryxx-bot/game-assets';
const sbH = { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json' };
const ghH = { 'Authorization': 'token ' + GIT_TOKEN, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };

const games = [
  {
    "id": 2381,
    "name": "Country Farming",
    "game_code": "ea74dd2d834178a631d8743b8ff6b0d9",
    "pp_code": "vs10farming",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs10farming/vs10farming_en.png"
  },
  {
    "id": 2697,
    "name": "Club Tropicana – Happy Hour",
    "game_code": "ecd5138b81f23063f5024a9675c6bc5a",
    "pp_code": "vs20tropicana",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20tropicana/vs20tropicana_en.png"
  },
  {
    "id": 2686,
    "name": "Plushie Wins",
    "game_code": "cc76cd19442f8ac49c03d88b66954e53",
    "pp_code": "vs20plushie",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20plushie/vs20plushie_en.png"
  },
  {
    "id": 2698,
    "name": "Gem Trio",
    "game_code": "de42f032cd46070828850af2ab651fdd",
    "pp_code": "vs20gemtrio",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20gemtrio/vs20gemtrio_en.png"
  },
  {
    "id": 2876,
    "name": "Rise of Samurai Megaways",
    "game_code": "ee8b6a0a96a2687308f1eb850dd986c5",
    "pp_code": "vswaysrsamurai",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysrsamurai/vswaysrsamurai_en.png"
  },
  {
    "id": 2893,
    "name": "Battle Ground Zero Megaways",
    "game_code": "418fa5df66d2c139a4fb073c80a364ff",
    "pp_code": "vswaysbg0",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysbg0/vswaysbg0_en.png"
  },
  {
    "id": 2679,
    "name": "Cachorro Sortudo",
    "game_code": "afb3a1305d1ffabfea22d740cd489afa",
    "pp_code": "vs25cachorroso",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25cachorroso/vs25cachorroso_en.png"
  },
  {
    "id": 2758,
    "name": "Hammerstorm",
    "game_code": "982f8ac34ca69e49fa5c470fbd53eb03",
    "pp_code": "vs20hammerstorm",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20hammerstorm/vs20hammerstorm_en.png"
  },
  {
    "id": 2887,
    "name": "Dragon Bonus Baccarat",
    "game_code": "d609de6b9469ae04658b7da73d569cb2",
    "pp_code": "vsbaccaratdragonbonus",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vsbaccaratdragonbonus/vsbaccaratdragonbonus_en.png"
  },
  {
    "id": 2197,
    "name": "Joker’s Jewels Cash",
    "game_code": "fcb9a4dabb068f060d3701be9fc6a0f0",
    "pp_code": "vs5jokerscash",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs5jokerscash/vs5jokerscash_en.png"
  },
  {
    "id": 2892,
    "name": "Olympus Wins",
    "game_code": "3f055f6e73acd6c3b4da3a7193885151",
    "pp_code": "vs20olympuswins",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20olympuswins/vs20olympuswins_en.png"
  },
  {
    "id": 2299,
    "name": "Lobster Bob’s Sea Food and Win It",
    "game_code": "75490d7675a731a6f7197ff860df1f5b",
    "pp_code": "vs50lobsterbob",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs50lobsterbob/vs50lobsterbob_en.png"
  },
  {
    "id": 2852,
    "name": "Lucky Fishing Megaways",
    "game_code": "9a0b02afcb79b9cc0bf01cc5990014cb",
    "pp_code": "vswaysluckyfishing",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysluckyfishing/vswaysluckyfishing_en.png"
  },
  {
    "id": 2804,
    "name": "Heartbreakers",
    "game_code": "31115da0448ae1b53c652f1806ce4c65",
    "pp_code": "vs20heartbreakers",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20heartbreakers/vs20heartbreakers_en.png"
  },
  {
    "id": 2883,
    "name": "Money Money Money",
    "game_code": "d72f6494668bdad755e60280c6624a2c",
    "pp_code": "vs20moneymm",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20moneymm/vs20moneymm_en.png"
  },
  {
    "id": 2846,
    "name": "Holiday Ride",
    "game_code": "28e4d704cf080bb6cae517365b27c1fa",
    "pp_code": "vs20holidayride",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20holidayride/vs20holidayride_en.png"
  },
  {
    "id": 2830,
    "name": "Happy Fortune",
    "game_code": "8f743f3c43a3b649434350f1de898c72",
    "pp_code": "vs20happyfortune",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20happyfortune/vs20happyfortune_en.png"
  },
  {
    "id": 2874,
    "name": "Aztec King Megaways",
    "game_code": "41e626a6f7de17238ded22bb566654b3",
    "pp_code": "vswaysazteckg",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysazteckg/vswaysazteckg_en.png"
  },
  {
    "id": 2826,
    "name": "Bali Dragon",
    "game_code": "3285fedfb12a8603737103ca7df79851",
    "pp_code": "vs20balidragon",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20balidragon/vs20balidragon_en.png"
  },
  {
    "id": 2702,
    "name": "Alien Invaders",
    "game_code": "8afaa529b72a3f8451552d79774eeb89",
    "pp_code": "vs20alieninvaders",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20alieninvaders/vs20alieninvaders_en.png"
  },
  {
    "id": 2865,
    "name": "Book of Aztec King",
    "game_code": "32370b44281b818c3b03bfdb8180ada0",
    "pp_code": "vs20bookaztec",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20bookaztec/vs20bookaztec_en.png"
  },
  {
    "id": 2700,
    "name": "Master Gems",
    "game_code": "28e338399ec8155da47eab5d57c9adf8",
    "pp_code": "vs20mastergems",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20mastergems/vs20mastergems_en.png"
  },
  {
    "id": 2690,
    "name": "Lucky Monkey",
    "game_code": "7bb5fa3556c5cec875d8887a12efb26c",
    "pp_code": "vs25luckymonkey",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25luckymonkey/vs25luckymonkey_en.png"
  },
  {
    "id": 2682,
    "name": "Touro Sortudo",
    "game_code": "a88031c49682c9e07e953da061f12896",
    "pp_code": "vs25tourosor",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25tourosor/vs25tourosor_en.png"
  },
  {
    "id": 2721,
    "name": "Mermaid's Treasure Trove",
    "game_code": "130fba0ef9dd44344062f5e96f590482",
    "pp_code": "vs20mermaidtreasure",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20mermaidtreasure/vs20mermaidtreasure_en.png"
  },
  {
    "id": 2778,
    "name": "Lucky Tiger Gold",
    "game_code": "bffb4c3b5d8c0f64893539635afd7cfa",
    "pp_code": "vs20luckytgold",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20luckytgold/vs20luckytgold_en.png"
  },
  {
    "id": 2786,
    "name": "CULT.",
    "game_code": "9297664682018d584f5a7650362e2420",
    "pp_code": "vs20cult",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20cult/vs20cult_en.png"
  },
  {
    "id": 2766,
    "name": "Meow Megaways™",
    "game_code": "962548e11ec32718a663a449af899dfe",
    "pp_code": "vswaysmeow",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysmeow/vswaysmeow_en.png"
  },
  {
    "id": 2747,
    "name": "Lucky Fortune Tree",
    "game_code": "29180923d6e56fdbb4f95ea56ba47241",
    "pp_code": "vs20luckyfortune",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20luckyfortune/vs20luckyfortune_en.png"
  },
  {
    "id": 2872,
    "name": "Raging Bull",
    "game_code": "4f70e310a4f7645cfeafd50d43a0643c",
    "pp_code": "vs40rage",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs40rage/vs40rage_en.png"
  },
  {
    "id": 2709,
    "name": "Ice Mints",
    "game_code": "f48a01ce6d9183c8c8869529757b172a",
    "pp_code": "vs20icemints",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20icemints/vs20icemints_en.png"
  },
  {
    "id": 2905,
    "name": "Zombie School Megaways",
    "game_code": "a01a6f5f2226587509812694f240023c",
    "pp_code": "vswayszszombisc",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswayszszombisc/vswayszszombisc_en.png"
  },
  {
    "id": 2327,
    "name": "O Vira-lata Caramelo",
    "game_code": "73ad9098dcb85e0341996d3ab86a3c40",
    "pp_code": "vs25viralata",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25viralata/vs25viralata_en.png"
  },
  {
    "id": 2329,
    "name": "Jeitinho Brasileiro",
    "game_code": "aa0524418bd20463f2127457e2f791ad",
    "pp_code": "vs25jeitinho",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25jeitinho/vs25jeitinho_en.png"
  },
  {
    "id": 2320,
    "name": "Red Hot Luck",
    "game_code": "0afd6c16b5b6bb0df073ccd9098ad114",
    "pp_code": "vs5redhotluck",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs5redhotluck/vs5redhotluck_en.png"
  },
  {
    "id": 2692,
    "name": "Lucky Dog",
    "game_code": "0d241578a8fe23f743ab5003321fac85",
    "pp_code": "vs25luckydog",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25luckydog/vs25luckydog_en.png"
  },
  {
    "id": 2808,
    "name": "Slime Pop",
    "game_code": "e763129659cb5ec4d4a0393f3236dd38",
    "pp_code": "vs20slimepop",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20slimepop/vs20slimepop_en.png"
  },
  {
    "id": 2803,
    "name": "Triple Pot Plinko – Hercules",
    "game_code": "18bc7c7b1133f3bcf396cb1907b6ae29",
    "pp_code": "vs20triplepotph",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20triplepotph/vs20triplepotph_en.png"
  },
  {
    "id": 2763,
    "name": "Hot Tuna",
    "game_code": "8ad6278cee6507810be85c68357784e9",
    "pp_code": "vs20hottuna",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20hottuna/vs20hottuna_en.png"
  },
  {
    "id": 2730,
    "name": "Oracle of Gold",
    "game_code": "752b270e6a7c2fe69fe7ffd1ba8278d3",
    "pp_code": "vs20oraclegold",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20oraclegold/vs20oraclegold_en.png"
  },
  {
    "id": 2896,
    "name": "Bau Cua Ca Cop",
    "game_code": "82fee8d74aa930890482dd2021e91c7e",
    "pp_code": "vs20baucuacacop",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20baucuacacop/vs20baucuacacop_en.png"
  },
  {
    "id": 2751,
    "name": "Code of Cairo",
    "game_code": "702c45c74023dd88cef625ccd4e78bbe",
    "pp_code": "vs20codocairo",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20codocairo/vs20codocairo_en.png"
  },
  {
    "id": 2714,
    "name": "Captain Kraken Megaways",
    "game_code": "4eae6d615c766a30fe3df1df57018607",
    "pp_code": "vswayscrptkraken",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswayscrptkraken/vswayscrptkraken_en.png"
  },
  {
    "id": 2743,
    "name": "Zeus vs Typhon",
    "game_code": "bc50831ebfc92032a26764da1bbecbc4",
    "pp_code": "vs20zeustyphon",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20zeustyphon/vs20zeustyphon_en.png"
  },
  {
    "id": 2788,
    "name": "Steamin’ Reels",
    "game_code": "ed711bdbf63b2256648de689594363df",
    "pp_code": "vs20steamreels",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20steamreels/vs20steamreels_en.png"
  },
  {
    "id": 2806,
    "name": "Dragon’s Gate – Bonus Choice",
    "game_code": "a1af1863d5ddf0f690c83ed1317050c8",
    "pp_code": "vs20dragonsgate",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20dragonsgate/vs20dragonsgate_en.png"
  },
  {
    "id": 2857,
    "name": "Wildman Super Bonanza",
    "game_code": "cc5d5413023cf9787d3e631c6ca766c8",
    "pp_code": "vs20wildmanbonanza",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20wildmanbonanza/vs20wildmanbonanza_en.png"
  },
  {
    "id": 2833,
    "name": "Xmas Spark",
    "game_code": "8166e58684c0bfe3a61abc9e37611be5",
    "pp_code": "vs20xmasspark",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20xmasspark/vs20xmasspark_en.png"
  },
  {
    "id": 2783,
    "name": "Dark Overlord – Final Duel",
    "game_code": "60eb75d218c81bcf3ff6f6245b2a9c2c",
    "pp_code": "vs20darkoverlord",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20darkoverlord/vs20darkoverlord_en.png"
  },
  {
    "id": 2670,
    "name": "Roulette",
    "game_code": "c75a2632e60c6fad859d8228bfb31c08",
    "pp_code": "vsroulette",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vsroulette/vsroulette_en.png"
  },
  {
    "id": 2894,
    "name": "Plinko+",
    "game_code": "3e606335523830a7ca62d105a5205a74",
    "pp_code": "vs1plinkoplus",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs1plinkoplus/vs1plinkoplus_en.png"
  },
  {
    "id": 2908,
    "name": "Mat Rempit",
    "game_code": "6937624c5d4c06a0f7e2e2d9498dded3",
    "pp_code": "vs20matrempit",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20matrempit/vs20matrempit_en.png"
  },
  {
    "id": 2873,
    "name": "Pyramid Bonanza",
    "game_code": "ab841b96a216b2321baa11d6121185a3",
    "pp_code": "vs25pyramid",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25pyramid/vs25pyramid_en.png"
  },
  {
    "id": 2680,
    "name": "Macaco Sortudo",
    "game_code": "46817907b43e53288e49291572946426",
    "pp_code": "vs25macacoso",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25macacoso/vs25macacoso_en.png"
  },
  {
    "id": 2839,
    "name": "Big Bass Crash",
    "game_code": "f4c5947fbaa31d2602e6089962b90876",
    "pp_code": "vs1bigbasscrash",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs1bigbasscrash/vs1bigbasscrash_en.png"
  },
  {
    "id": 2688,
    "name": "Lucky Tiger 1000",
    "game_code": "ec84348a2bdee18aa147f62d1fe91ea2",
    "pp_code": "vs20luckytiger1000",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20luckytiger1000/vs20luckytiger1000_en.png"
  },
  {
    "id": 2842,
    "name": "Supermania",
    "game_code": "9d2ff202764e3ac97e16bff3aed6c9b9",
    "pp_code": "vs20supermania",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20supermania/vs20supermania_en.png"
  },
  {
    "id": 2802,
    "name": "Mr Null’s Wicked Wares",
    "game_code": "c77cd0d30fb9b8c288a61819839c1508",
    "pp_code": "vs20mrnull",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20mrnull/vs20mrnull_en.png"
  },
  {
    "id": 2880,
    "name": "Rise of Samurai",
    "game_code": "501002d1c366989b985b58a99d8ada6f",
    "pp_code": "vs20rsamurai",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20rsamurai/vs20rsamurai_en.png"
  },
  {
    "id": 2569,
    "name": "The Dog House Megaways",
    "game_code": "553b3622cad4fa40e351055005915a98",
    "pp_code": "vswaysdoghouse",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysdoghouse/vswaysdoghouse_en.png"
  },
  {
    "id": 2641,
    "name": "American Blackjack",
    "game_code": "bf91fbba325bbc02698a07ddd902fec4",
    "pp_code": "vsbj",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vsbj/vsbj_en.png"
  },
  {
    "id": 2667,
    "name": "Hot Safari",
    "game_code": "b9ce78f7e39d12557a194f9ef4d87998",
    "pp_code": "vs25hotsafari",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25hotsafari/vs25hotsafari_en.png"
  },
  {
    "id": 2678,
    "name": "Fenix Sortuda",
    "game_code": "274346efcf702032e4d72a773d0c2d3d",
    "pp_code": "vs20fenixsort",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20fenixsort/vs20fenixsort_en.png"
  },
  {
    "id": 2659,
    "name": "Multihand Blackjack",
    "game_code": "af6c67dcbe8cdcb706c947855cc3b125",
    "pp_code": "vsmultibj",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vsmultibj/vsmultibj_en.png"
  },
  {
    "id": 2684,
    "name": "Tigre Sortudo",
    "game_code": "b40eef98727329f7dd86b27b6e5ec126",
    "pp_code": "vs25tigresor",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25tigresor/vs25tigresor_en.png"
  },
  {
    "id": 2715,
    "name": "Spaceman",
    "game_code": "bee355cb11e533e4fdc98a043f2a9b4f",
    "pp_code": "vs1spaceadv",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs1spaceadv/vs1spaceadv_en.png"
  },
  {
    "id": 2685,
    "name": "Pig Farm",
    "game_code": "eb17a6d8839c7a44e059411d6e63bc2c",
    "pp_code": "vs20pigfarm",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20pigfarm/vs20pigfarm_en.png"
  },
  {
    "id": 2693,
    "name": "Lucky Ox",
    "game_code": "5ce0e0ad05cb028ebac6a84a677fd678",
    "pp_code": "vs25luckyox",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25luckyox/vs25luckyox_en.png"
  },
  {
    "id": 2708,
    "name": "Spellmaster",
    "game_code": "3956f4420fd879b9cdde090adb36481f",
    "pp_code": "vs20spellmaster",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20spellmaster/vs20spellmaster_en.png"
  },
  {
    "id": 2713,
    "name": "Zombie School Megaways",
    "game_code": "8fa2b1e8c24857095efd18ed3a5f2738",
    "pp_code": "vswayszszombisc",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswayszszombisc/vswayszszombisc_en.png"
  },
  {
    "id": 2695,
    "name": "Lucky Tiger",
    "game_code": "8007344e017bdd5c2d5d0d4eb43c3b2b",
    "pp_code": "vs25luckytiger",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25luckytiger/vs25luckytiger_en.png"
  },
  {
    "id": 2681,
    "name": "Tigre Sortudo 1000",
    "game_code": "7da52f89db16b49cfaef1cdad4fbcbeb",
    "pp_code": "vs20tigresor1000",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20tigresor1000/vs20tigresor1000_en.png"
  },
  {
    "id": 2694,
    "name": "Emotiwins",
    "game_code": "744b6048621f596bf17e9b215243c079",
    "pp_code": "vs20emoticoins",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20emoticoins/vs20emoticoins_en.png"
  },
  {
    "id": 2683,
    "name": "Ratinho Sortudo",
    "game_code": "ee230adb90d8aec1a4c7e3b6403c9c90",
    "pp_code": "vs25ratinhosor",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25ratinhosor/vs25ratinhosor_en.png"
  },
  {
    "id": 2717,
    "name": "Genie's Gem Bonanza",
    "game_code": "98d78459ce981e90e1d6a027c6b7256a",
    "pp_code": "vs20geniebonanza",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20geniebonanza/vs20geniebonanza_en.png"
  },
  {
    "id": 2711,
    "name": "Argonauts",
    "game_code": "fab80339033327c607eaa5227ec1f418",
    "pp_code": "vs25argonauts",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25argonauts/vs25argonauts_en.png"
  },
  {
    "id": 2755,
    "name": "Fortune of Olympus",
    "game_code": "c2d07f40a0f6315629e88b3d644773d0",
    "pp_code": "vs20fortuneolympus",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20fortuneolympus/vs20fortuneolympus_en.png"
  },
  {
    "id": 2739,
    "name": "Gates of Pyroth",
    "game_code": "558163557e7150ea8b21d9a42824fc11",
    "pp_code": "vs20pyroth",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20pyroth/vs20pyroth_en.png"
  },
  {
    "id": 2726,
    "name": "Chests of Cai Shen 2",
    "game_code": "697a1c901dd57f98b293027e8af62e2d",
    "pp_code": "vs20caishen2",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20caishen2/vs20caishen2_en.png"
  },
  {
    "id": 2729,
    "name": "Pandemic Rising",
    "game_code": "dc15dfa9b05d50075a763f9867b38f32",
    "pp_code": "vs20pandemic",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20pandemic/vs20pandemic_en.png"
  },
  {
    "id": 2735,
    "name": "DJ Neko",
    "game_code": "6ee88cd8d45a5abc5797f14ec19137be",
    "pp_code": "vs20djneko",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20djneko/vs20djneko_en.png"
  },
  {
    "id": 2733,
    "name": "Lucky Panda",
    "game_code": "3e513a54acd691a8925127cb3f359c48",
    "pp_code": "vs25luckypanda",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25luckypanda/vs25luckypanda_en.png"
  },
  {
    "id": 2731,
    "name": "Mines+",
    "game_code": "c4f954079d20b7eb6da49c9fce1f9b08",
    "pp_code": "vs1minesplus",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs1minesplus/vs1minesplus_en.png"
  },
  {
    "id": 2756,
    "name": "Limbo+",
    "game_code": "4c2f18fa61c0becd4706a6da1961b020",
    "pp_code": "vs1limboplus",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs1limboplus/vs1limboplus_en.png"
  },
  {
    "id": 2728,
    "name": "Bingo Mania",
    "game_code": "7de938fd86a4cd93ecf5d5602ee7569c",
    "pp_code": "vs20bingomania",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20bingomania/vs20bingomania_en.png"
  },
  {
    "id": 2740,
    "name": "Big Bass Christmas Frozen Lake",
    "game_code": "b3441ece8fc94ddaafe01be3f3483273",
    "pp_code": "vs20bigbassfrozenlake",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20bigbassfrozenlake/vs20bigbassfrozenlake_en.png"
  },
  {
    "id": 2741,
    "name": "Wisdom of Athena 1000 Xmas",
    "game_code": "5fc84330832564bfdef55db77be42779",
    "pp_code": "vs20wisdomathxmas",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20wisdomathxmas/vs20wisdomathxmas_en.png"
  },
  {
    "id": 2753,
    "name": "Fire Stampede 2",
    "game_code": "fc6291b0e79009fc18a1dfdbddefdd1a",
    "pp_code": "vs20firestampede2",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20firestampede2/vs20firestampede2_en.png"
  },
  {
    "id": 2792,
    "name": "Furry Bonanza Megaways",
    "game_code": "52301cdd4bd914a03f3190e7f479fb5f",
    "pp_code": "vswaysfurrybonanza",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysfurrybonanza/vswaysfurrybonanza_en.png"
  },
  {
    "id": 2793,
    "name": "Idol Pop Fever",
    "game_code": "c49c72cf79fdd6a416f714141e38043e",
    "pp_code": "vs20idolpop",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20idolpop/vs20idolpop_en.png"
  },
  {
    "id": 2770,
    "name": "Mahjong Wins 3 – Black Scatter",
    "game_code": "a4f67f1730245d22f834bf826ae22c13",
    "pp_code": "vs20mahjong3bs",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20mahjong3bs/vs20mahjong3bs_en.png"
  },
  {
    "id": 2785,
    "name": "Tut’s Treasure Tower",
    "game_code": "6fe75c9049186c7888a80a49a09c84b2",
    "pp_code": "vs20tuttreasure",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20tuttreasure/vs20tuttreasure_en.png"
  },
  {
    "id": 2787,
    "name": "Lucky’s Wild Pub 2",
    "game_code": "f79a8b107c27c5601751a04579cae19b",
    "pp_code": "vs20luckyswildpub2",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20luckyswildpub2/vs20luckyswildpub2_en.png"
  },
  {
    "id": 2775,
    "name": "Mummy’s Jewels 100",
    "game_code": "c9ce7efdde0fb64d1a7bfb5f3f2ff131",
    "pp_code": "vs5mummyjewels100",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs5mummyjewels100/vs5mummyjewels100_en.png"
  },
  {
    "id": 2771,
    "name": "Zeus vs Hades – Gods of War 250",
    "game_code": "a9f2f1bc3dc8711f045210302d3f6e68",
    "pp_code": "vs20zeushades250",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20zeushades250/vs20zeushades250_en.png"
  },
  {
    "id": 2772,
    "name": "3 Magic Eggs",
    "game_code": "f034e949cdd794c93db07636af5adce2",
    "pp_code": "vs20magiceggs",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20magiceggs/vs20magiceggs_en.png"
  },
  {
    "id": 2789,
    "name": "Jelly Express",
    "game_code": "1265cf0a758c2cfa36b0fbe6db314588",
    "pp_code": "vs20jellyexpress",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20jellyexpress/vs20jellyexpress_en.png"
  },
  {
    "id": 2759,
    "name": "Anime Cosplay VS",
    "game_code": "ad15397c1eeb829025853bc1b28adc34",
    "pp_code": "vs20animecosplay",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20animecosplay/vs20animecosplay_en.png"
  },
  {
    "id": 2779,
    "name": "Haunted Crypt",
    "game_code": "e863f19c6f997f1edc598d87400c5593",
    "pp_code": "vs20hauntedcrypt",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20hauntedcrypt/vs20hauntedcrypt_en.png"
  },
  {
    "id": 2776,
    "name": "Treasures of Osiris",
    "game_code": "25af131fa95bfd1b9bf14aade403493a",
    "pp_code": "vs20treasureosiris",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20treasureosiris/vs20treasureosiris_en.png"
  },
  {
    "id": 2796,
    "name": "Dragon Pots Megaways",
    "game_code": "17d5012513410f5e9b0708f481b532c3",
    "pp_code": "vswaysdragonpots",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysdragonpots/vswaysdragonpots_en.png"
  },
  {
    "id": 2760,
    "name": "Joker’s Jewels Hold & Spin",
    "game_code": "a2c2639979c00578c08a3d3158ce5757",
    "pp_code": "vs5jokerhs",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs5jokerhs/vs5jokerhs_en.png"
  },
  {
    "id": 2811,
    "name": "Mahjong Wins - Gong Xi Fa Cai",
    "game_code": "022f71df2642ce42cec8d75be0ec4c59",
    "pp_code": "vs20mahjonggxfc",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20mahjonggxfc/vs20mahjonggxfc_en.png"
  },
  {
    "id": 2834,
    "name": "Mahjong X",
    "game_code": "00ff9f1ce40c2c951ef34b0a2bcad07c",
    "pp_code": "vs20mahjongx",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20mahjongx/vs20mahjongx_en.png"
  },
  {
    "id": 2798,
    "name": "Cyber Pup Megaways",
    "game_code": "7c080c332ba04058f1cc1abd3d55c5c2",
    "pp_code": "vswaysbigpuppy",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysbigpuppy/vswaysbigpuppy_en.png"
  },
  {
    "id": 2809,
    "name": "Sweet Cherry Blossom",
    "game_code": "ce6fefa0eb82fd4a3f069827ce4f5e25",
    "pp_code": "vs20sweetcb",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20sweetcb/vs20sweetcb_en.png"
  },
  {
    "id": 2817,
    "name": "Mahjong Wins 2",
    "game_code": "ab3782682b0ef188abf062c90ac72e55",
    "pp_code": "vs20mahjong2",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20mahjong2/vs20mahjong2_en.png"
  },
  {
    "id": 2813,
    "name": "Archer Gold",
    "game_code": "76aa54bc79dd32e576b2b52b41ae4103",
    "pp_code": "vs20archergold",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20archergold/vs20archergold_en.png"
  },
  {
    "id": 2831,
    "name": "Sea Fantasy",
    "game_code": "a980bf2816f706eaa7c5b6ca2dab1ff3",
    "pp_code": "vs20seafantasy",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20seafantasy/vs20seafantasy_en.png"
  },
  {
    "id": 2816,
    "name": "High Flyer (Crash Game)",
    "game_code": "95c391563f83181c52c5de366a89b9b9",
    "pp_code": "vs1highflyer",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs1highflyer/vs1highflyer_en.png"
  },
  {
    "id": 2799,
    "name": "Sweet Bonanza 2500",
    "game_code": "d208e055b5c61b94ede0a695a7ee3033",
    "pp_code": "vs20fruitsw2500",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20fruitsw2500/vs20fruitsw2500_en.png"
  },
  {
    "id": 2815,
    "name": "Anime Mecha Megaways",
    "game_code": "38eb6f8133b79c0915e5e101dd70536d",
    "pp_code": "vswaysanimemecha",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysanimemecha/vswaysanimemecha_en.png"
  },
  {
    "id": 2818,
    "name": "Wukong Rush",
    "game_code": "a6503e7ed7688aeff856f14f91057c0e",
    "pp_code": "vs20wukongrush",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20wukongrush/vs20wukongrush_en.png"
  },
  {
    "id": 2821,
    "name": "Gates of Gatot Kaca 1000",
    "game_code": "33ec04f802880123694d7a223542ed6c",
    "pp_code": "vs20gokaca1000",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20gokaca1000/vs20gokaca1000_en.png"
  },
  {
    "id": 2822,
    "name": "Casino Heist Megaways",
    "game_code": "03ffa428a8f2a22197068532ff4ed786",
    "pp_code": "vswaysdcheist",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysdcheist/vswaysdcheist_en.png"
  },
  {
    "id": 2807,
    "name": "Big Bass Football Bonanza",
    "game_code": "ccdec9db1e92c069e10173b46cbc1d8d",
    "pp_code": "vs20bigbassfootball",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20bigbassfootball/vs20bigbassfootball_en.png"
  },
  {
    "id": 2869,
    "name": "Bubble Pop",
    "game_code": "d21f365eb011f93df8639ac49283d9a7",
    "pp_code": "vs25bubbles",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25bubbles/vs25bubbles_en.png"
  },
  {
    "id": 2837,
    "name": "888 Bonanza",
    "game_code": "8d35c74db4cc910c4a608f694f0ac2c9",
    "pp_code": "vs20888bonanza",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20888bonanza/vs20888bonanza_en.png"
  },
  {
    "id": 2851,
    "name": "5 Rabbits Megaways",
    "game_code": "908f3b21263818f283e3c2b6c57bea25",
    "pp_code": "vswaysfiverabbit",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysfiverabbit/vswaysfiverabbit_en.png"
  },
  {
    "id": 2868,
    "name": "Hockey Attack",
    "game_code": "8137613b01b1a4bfe67e59ec9c915eac",
    "pp_code": "vs20hockeyattack",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20hockeyattack/vs20hockeyattack_en.png"
  },
  {
    "id": 2843,
    "name": "Joker Race",
    "game_code": "3a33ab169b2200f7820a4159c7268c31",
    "pp_code": "vs20jokerrace",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20jokerrace/vs20jokerrace_en.png"
  },
  {
    "id": 2845,
    "name": "Frogs & Bugs",
    "game_code": "972eba0227e1b37d5faba91f714f5d8e",
    "pp_code": "vs20frogsnbugs",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20frogsnbugs/vs20frogsnbugs_en.png"
  },
  {
    "id": 2848,
    "name": "Fruits of the Amazon",
    "game_code": "20a5902cf138c5ebdfaa313677a0369f",
    "pp_code": "vs20fruitsamazon",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20fruitsamazon/vs20fruitsamazon_en.png"
  },
  {
    "id": 2853,
    "name": "Gates of Gatot Kaca",
    "game_code": "4344bf39cbeaafca9edfbd724330d284",
    "pp_code": "vs20gatogkaca",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20gatogkaca/vs20gatogkaca_en.png"
  },
  {
    "id": 2855,
    "name": "Old Gold Miner Megaways",
    "game_code": "90746f39bdca21a346389573de57f9d8",
    "pp_code": "vswaysoldgoldminer",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswaysoldgoldminer/vswaysoldgoldminer_en.png"
  },
  {
    "id": 2840,
    "name": "Saiyan Mania",
    "game_code": "09427b3980780ea41a9f15dda6b2726c",
    "pp_code": "vs20saiyanmania",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20saiyanmania/vs20saiyanmania_en.png"
  },
  {
    "id": 2838,
    "name": "Gemstone",
    "game_code": "9f6631b1861423dd72b422669f0e5e60",
    "pp_code": "vs20gemstone",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20gemstone/vs20gemstone_en.png"
  },
  {
    "id": 2856,
    "name": "Legend of Heroes Megaways",
    "game_code": "ffe1a4449dbac923e59d43d203ba8140",
    "pp_code": "vswayslegendheroes",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vswayslegendheroes/vswayslegendheroes_en.png"
  },
  {
    "id": 2866,
    "name": "Emperor Caishen",
    "game_code": "e539ca804c0c6dbb78b5589d2b147b73",
    "pp_code": "vs25empcaishen",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25empcaishen/vs25empcaishen_en.png"
  },
  {
    "id": 2863,
    "name": "Disco Lady",
    "game_code": "140a4920ece136f2d064355cfb16d309",
    "pp_code": "vs20discolady",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20discolady/vs20discolady_en.png"
  },
  {
    "id": 2861,
    "name": "Koi Pond",
    "game_code": "1e71c96079cd48c3fedd3420837231e1",
    "pp_code": "vs20koipond",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20koipond/vs20koipond_en.png"
  },
  {
    "id": 2859,
    "name": "Coffee Wild",
    "game_code": "5fa3eef2f06120b976e71f938c6dd2e4",
    "pp_code": "vs20coffeewild",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20coffeewild/vs20coffeewild_en.png"
  },
  {
    "id": 2902,
    "name": "Spire+",
    "game_code": "e738af151ad6507118ca0bc24f3ffb1c",
    "pp_code": "vs1spireplus",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs1spireplus/vs1spireplus_en.png"
  },
  {
    "id": 2906,
    "name": "Spellmaster",
    "game_code": "9c8e8f4cac4abe35810dbc12e2874cc6",
    "pp_code": "vs20spellmaster",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20spellmaster/vs20spellmaster_en.png"
  },
  {
    "id": 2911,
    "name": "Argonauts",
    "game_code": "404466af539c16b9d0d27dce3995c688",
    "pp_code": "vs25argonauts",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25argonauts/vs25argonauts_en.png"
  },
  {
    "id": 2878,
    "name": "Golden Ox",
    "game_code": "c527f165ed3533c67100f891ca4cb401",
    "pp_code": "vs20goldenox",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20goldenox/vs20goldenox_en.png"
  },
  {
    "id": 2879,
    "name": "Bonanza Gold",
    "game_code": "45b73bc24d304f030808d138bf1a824e",
    "pp_code": "vs20bonanzagold",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20bonanzagold/vs20bonanzagold_en.png"
  },
  {
    "id": 2913,
    "name": "Code of Cairo",
    "game_code": "1a666cb5a0c05d483b1a137dea542dde",
    "pp_code": "vs20codocairo",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20codocairo/vs20codocairo_en.png"
  },
  {
    "id": 2915,
    "name": "Fortune Ace Super Scatter",
    "game_code": "3fa8affb9baf4dffa777a4971433d34c",
    "pp_code": "vs20fortuneacess",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20fortuneacess/vs20fortuneacess_en.png"
  },
  {
    "id": 2904,
    "name": "Fire Stampede 2",
    "game_code": "ade62c616477b0ac209cfef318e49f39",
    "pp_code": "vs20firestampede2",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20firestampede2/vs20firestampede2_en.png"
  },
  {
    "id": 2901,
    "name": "777 Rush",
    "game_code": "1f455e7ee7ba58d116e9aebeac6b4c5a",
    "pp_code": "vs1rush",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs1rush/vs1rush_en.png"
  },
  {
    "id": 2903,
    "name": "Jackpot Blaze",
    "game_code": "18af359ac7f6f5cccadb98202f02ddb1",
    "pp_code": "vs20jackpotblz",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20jackpotblz/vs20jackpotblz_en.png"
  },
  {
    "id": 2899,
    "name": "You Can Piggy Bank On It",
    "game_code": "d0b900ab22674260a2a3b34d98c34dc8",
    "pp_code": "vs25piggyw",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs25piggyw/vs25piggyw_en.png"
  },
  {
    "id": 2910,
    "name": "Big Bass Reel Repeat",
    "game_code": "c1db164bcccbd85224c3dfc5f525613c",
    "pp_code": "vs20bigbassrr",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20bigbassrr/vs20bigbassrr_en.png"
  },
  {
    "id": 2916,
    "name": "Wrath of Nezha",
    "game_code": "d0a7fff5510eb6183713e563746b3471",
    "pp_code": "vs20nezha",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20nezha/vs20nezha_en.png"
  },
  {
    "id": 2917,
    "name": "Kadita Ocean Fury",
    "game_code": "388f449a4f840a018bfc84e5a84db5cd",
    "pp_code": "vs20kadita",
    "original_url": "https://static.pragmaticplay.net/game_pic/square/vs20kadita/vs20kadita_en.png"
  }
];

function dlBuffer(url, redirects=0) {
  return new Promise((resolve, reject) => {
    if (redirects > 6) return reject(new Error('Too many redirects'));
    const lib = url.startsWith('https') ? https : require('http');
    const chunks = [];
    const req = lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location)
        return dlBuffer(res.headers.location, redirects+1).then(resolve).catch(reject);
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function main() {
  let ok=0, fail=0;
  for (let i=0; i<games.length; i+=3) {
    const batch = games.slice(i, i+3);
    await Promise.all(batch.map(async g => {
      try {
        const buf = await dlBuffer(g.original_url);
        if (buf.length < 1000) throw new Error('Too small');
        // Upload to GitHub
        const url = 'https://api.github.com/repos/' + REPO + '/contents/pp/' + g.game_code + '.jpg';
        const check = await fetch(url, { headers: ghH });
        const body = { message: 'fix: PP image ' + g.pp_code, content: buf.toString('base64') };
        if (check.status === 200) body.sha = (await check.json()).sha;
        const r = await fetch(url, { method: 'PUT', headers: ghH, body: JSON.stringify(body) });
        if (r.status !== 200 && r.status !== 201) throw new Error('GitHub ' + r.status);
        // Update DB
        const jsUrl = 'https://cdn.jsdelivr.net/gh/ccorryxx-bot/game-assets@main/pp/' + g.game_code + '.jpg';
        await fetch(SUPABASE_URL + '/rest/v1/game_cards?id=eq.' + g.id, {
          method: 'PATCH', headers: { ...sbH, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ image_url: jsUrl })
        });
        ok++;
        console.log('✅ [' + (ok+fail) + '/' + games.length + '] ' + g.name);
      } catch(e) {
        fail++;
        console.log('❌ ' + g.name + ': ' + e.message);
      }
    }));
    await new Promise(r=>setTimeout(r,400));
  }
  console.log('Done: OK=' + ok + ' Failed=' + fail);
}
main().catch(console.error);
