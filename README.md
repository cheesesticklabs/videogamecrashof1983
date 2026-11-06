# The Video Game Crash of 1983

Open `index.html` through a static web server or upload this folder's contents to the existing lesson hosting. The new wordmark replaces the header text at 154px wide. Oz replaces the old 66px logo at 78px, with the existing Cheesestick site’s black organic border and offset shadow. `template.css` is copied verbatim from the supplied modular lab; additions live in `lesson.css`.

## What works

- English/Spanish toggle for student content, navigation, questions, glossary, dialogs, status messages, and player wrapper; light/dark themes.
- The specified Do Now wording, two pre-play questions, three box covers, confirmation, persistent single purchase, and post-play reflection.
- Do Now: Fire Fly, Super Breakout, Karate. Later brand check-in: Spider-Man, Superman, Ghostbusters, with a separate purchase lock. Ghostbusters includes Finish Shopping, mapped to Javatari's F4 control.
- Good-game comparison: Yars’ Revenge, River Raid, H.E.R.O., Pitfall!, and Star Wars: The Arcade Game. E.T. has its own later gameplay page. All these URLs were supplied by the teacher.
- Direct Wix loading in a responsive modal with the original Atari panel beneath the screen, supplied Start/Pause/Reset images on the right, and X to return. Closing destroys the player so it cannot keep running; written responses and choices persist.
- Teacher-paced navigation. Default pacing/setup code: `cheesestick`. It unlocks the next page only, even if a later tab was clicked. Code is configurable in `config.js`.
- Passwords are listed by the page you leave in PASSWORDS.md. Each page has its own code; spaces, hyphens, and capitalization are ignored. The code on page 6 locks earlier games.
- Autosave on every written change, vocabulary drawer, response review, TXT/JSON downloads, and printing.
- Students can choose games and continue without answering questions. Teacher pacing is separate. The final page lists each page's answered/total count and provides return buttons; blank lesson answers do not disable submission. Name and class identify the work.
- Page 6 asks why the market crashed and provides a freewrite box. Submit saves that response in the browser for the final Sheet submission. Continue opens the same password popup used at other checkpoints; centipede opens page 7, which holds the explanation box, and locks earlier games. Written answers remain available.
- Source boxes and citation links have been removed from student pages. The inflation calculation remains as plain text. Brands & Licensing remains; the E.T. What Happened box has been removed.
- The 2026 page follows the outline's Roblox class discussion, with optional notes and a 1983/2026 comparison. The exit ticket asks how to spend $100 using a more informed decision than the original box-art purchase.

## Still awaiting your choices

The arcade contains 30 games with local front-cover images. Its top section combines the five comparison games with 18 additional reward games; below the divider are Fire Fly, Super Breakout, Karate, Spider-Man, Superman, Ghostbusters, and E.T. Repeated titles are not duplicated. All are freely selectable after freeplay; earlier purchase locks still apply on their original pages. Kaboom! uses paddle mode. The latest Frogger link is used, and the malformed Galaxian link is corrected to end at .zip. The Sheet connection, GitHub publication, and teacher-selected clips still need setup.

The shared link labeled Ghostbusters and E.T. identifies as Ghostbusters in the player. Ghostbusters uses that link; E.T. retains the earlier verified E.T. file. Local loading checks passed for all 30 games. See PLAYTESTS.json for displayed cartridge titles and ASSET-SOURCES.md for cover-image provenance; those source notes do not appear in the student lesson.

Add final media in `config.js`. Teacher setup can preview overrides in the current browser and download a class `config.js` to distribute. Browser overrides do not configure other student devices. See `TEACHER-GUIDE.md` for the 60-minute teaching sequence, the slides-only monoculture discussion, and chronology notes. Gameplay comparisons are an Atari retrospective; later games are not portrayed as purchases available in 1983.

## Submission

Students submit directly to a Google Sheet through the included `google-apps-script/Code.gs` receiver. There is no Google Form or Firebase integration. `SETUP-GOOGLE-SHEETS.md` explains the one-time Apps Script deployment and GitHub Pages publication; neither has been performed on the teacher's account yet. Configure the deployed `/exec` URL and classroom code in `config.js` under `sheets`.

The browser POSTs work, then checks for a matching receipt to confirm the save. The separate freeplay password opens the reward page. A click, iframe redirect, or unconfirmed network request never counts as success. Retries of the same request are idempotent; the Sheet stores one row per unique submission ID. The receiver returns no student names or answers to the website. Downloads and printing remain available as backups. See `VALIDATION.md` for checks and remaining verification limits.

## Teacher testing

Open Teacher and enter the pacing code. You can unlock the next page, restore games after the crash, or reset choices without deleting written responses. Do not distribute a browser's saved testing state as student work. The client-side purchase and pacing controls are classroom conveniences; clearing site data, private browsing, another device, or editing browser code can bypass them. Autosave is local to the same browser and origin. The crash's disabled games are a classroom simulation; it does not claim working cartridges stopped functioning in 1983.

## Sources

- [Federal Reserve Bank of Minneapolis CPI table](https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-price-index-1913-): 1983 CPI 99.6; 2026 estimated CPI 333.2; $30 × 333.2 / 99.6 ≈ $100.36. The savings and one-game limit are a scenario, not equal historical retail prices.
- [Smithsonian: E.T. and the landfill](https://americanhistory.si.edu/explore/stories/landfill-smithsonian-collections-et-extra-terrestrial-atari-2600-game).
- [The Henry Ford: Atari burial collection](https://www.thehenryford.org/collections/explore/articles/detail/articles/2015/07/01/atari): 1983 burial and 2014 excavation, including multiple game titles.
- [Steamworks Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey): AI content disclosures. AI use and poor quality are separate questions.

School network access to Wix and video/Steam hosts must be checked on a student device. No ROM files, Ghidra exports, Firebase submission settings, or third-party account credentials are part of this package.
