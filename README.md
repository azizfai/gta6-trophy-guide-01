[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/azizfai/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/azizfai/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Trophy Guide — GTA VI Platinum Roadmap & Tracker

An offline, open-source guide and tracker for all **55 official PlayStation 5 trophies** of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver, 46 bronze. Static files, no build step, no network at run time — open it in a desktop browser and it just works.

Referral code: `p5tm223q`

## What it does

- **Tracker** — tick trophies off as you earn them. Progress is saved in the browser (localStorage), and can be exported to a JSON file and imported back.
- **Filters** — by kind (story, side quests, collectibles, activities, secrets), by grade, by missable, by earned, plus free-text search.
- **Spoiler-free mode** — hides the names and descriptions of story trophies until you have earned them.
- **Roadmap to the platinum** — four stages in order: story → heists & duo work → open-world grind → cleanup & 100%.
- **Missables flagged** — one trophy can be missed: *Positive Mental Attitude* (a Chapter 1 meditation spot that vanishes after Chapter 1). It is flagged in the list, in its guide, and on its own page.
- **Honest about the unknowns** — five trophies have official descriptions too vague to pin a method to. Those are marked **UNCONFIRMED** instead of inventing a method.
- **A guide to every trophy, in our own words, with sources** — each trophy's guide names its sources beside it.

## How to run it

```sh
node serve.ts
# open http://localhost:8080
```

Or open `app/index.html` directly from the files — no server, no install, no account.

## Files

- `app/index.html` — the guide
- `app/app.js` — tracker, filters, spoiler mode, export/import, roadmap
- `app/style.css` — the look (a Leonida sunset theme, drawn with CSS only)
- `app/data/trophies.json` — all 55 trophies: official name, description, grade, kind, roadmap stage, missable flag, guide, sources
- `main.ts` — hands the guide in: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`
- `serve.ts` — tiny static server for local use
- `screenshots/` — four renders of the running app

## Sources

- The official trophy list on Exophase (names, descriptions, grades, as reported by Push Square)
- PSNProfiles — GTA VI trophy list (PlayStation's progress counts, e.g. 42 Shooting Range challenges, 18 meditation spots, 52 areas)
- PowerPyx — GTA 6 Trophy Guide & Roadmap
- GTA Zone — GTA 6 trophy list

Guides may draw on other guides and cite them; they never copy their text. The official trophy names and descriptions are shown exactly as PlayStation publishes them.

## Disclaimer

Unofficial fan guide. Not affiliated with, endorsed by, or connected to Rockstar Games, Sony, or PlayStation. No Rockstar artwork, logos, or game screenshots are used anywhere.

## License

MIT — see `LICENSE`.
