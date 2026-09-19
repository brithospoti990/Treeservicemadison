# Entity map: homepage vs MarketMuse topic model

Source: `9_18_2026-topicModel-tree_service_madison.xlsx` (MarketMuse Topic Navigator, query "tree service madison", 50 topics).

Counts are exact-phrase, case-insensitive, punctuation-normalised (so "Madison, WI" counts as "madison wi"). "Main" is the homepage body; "Page" adds header and footer.

## Result

- Kept and placed: **45** of 50
- At or above the suggested minimum: **45** (none under)
- Inside the suggested range: **39**
- Above the suggested range: **6** (tree service, tree trimming, oak wilt, stump, professional tree, ash trees). These are core service terms. A page that sells two stump services and links six "Tree service in ..." area pages will exceed a range built from pages that don't. Density stays under 0.7% for each of them.
- Dropped on purpose: **5**

## Kept entities

| Entity | Suggested | Main | Page | Status | Where it's used |
|---|---|---|---|---|---|
| tree service madison | 1-2 | 2 | 4 | in range | Brand name: who-to-call ladder, estimate NAP block (header/footer logo alt and footer NAP sit outside main) |
| tree service | 3-10 | 14 | 18 | above range | H1, area links ("Tree service in Fitchburg" etc.), ladder intro, FAQ, brand name |
| tree trimming | 1-2 | 5 | 7 | above range | Hero deck, service row heading + link, "Professional tree trimming" |
| tree | 10+ | 99 | 114 | in range | Throughout |
| tree removal | 3-10 | 7 | 11 | in range | Hero deck, service row heading + link + body, FAQ |
| tree care | 10+ | 12 | 13 | in range | Hero deck, services intro, trimming row, rules intro, process intro, remove/prune/leave section, calendar H2 + intro + closing, areas paragraph, founder note, FAQ |
| tree pruning | 3-10 | 3 | 3 | in range | Trimming service row + its Madison note, winter calendar item |
| madison | 10+ | 30 | 37 | in range | Throughout (H1, H2s, rules, areas, FAQ) |
| arborist | 3-10 | 5 | 5 | in range | Trimming row, ash rule, calendar closing, founder note, FAQ |
| certified arborist | 1-2 | 2 | 2 | in range | FAQ question ("When do I need a certified arborist..."), ash rule |
| isa certified arborist | 1-2 | 1 | 1 | in range | Ash rule: treatment belongs to a certified pesticide applicator, ideally an ISA Certified Arborist |
| service | 10+ | 16 | 24 | in range | Throughout |
| tree health | 1-2 | 1 | 1 | in range | Summer calendar item on watering young trees |
| emergency tree service | 1-2 | 2 | 4 | in range | Service row heading + link (also header/footer menus) |
| tree services | 3-10 | 3 | 5 | in range | Services H2 + intro |
| certified arborists | 3-10 | 4 | 4 | in range | Terrace rule (the City's recommendation), remove/prune/leave closing (written risk assessment), calendar closing, FAQ answer |
| emergency tree removal | 1-2 | 1 | 1 | in range | Opening of the emergency service row |
| tree planting | 1-2 | 1 | 1 | in range | Spring calendar item |
| isa certified arborists | 1-2 | 1 | 1 | in range | FAQ answer: when to hire one and where to verify the credential |
| oak wilt | 1-2 | 4 | 6 | above range | Oak rule, DNR source link, summer calendar item, FAQ (plus the guide link in the menus) |
| trees | 10+ | 26 | 29 | in range | Throughout |
| tree care service | 1-2 | 1 | 1 | in range | Areas paragraph ("As a local tree care service...") |
| healthy trees | 1-2 | 1 | 1 | in range | Trimming row ("Healthy trees are built by what you leave on") |
| stump | 3-10 | 16 | 21 | above range | Two stump service rows, process, finished-job list, FAQ |
| professional tree trimming | 1-2 | 1 | 1 | in range | Opening of the trimming row |
| professional tree care | 1-2 | 1 | 1 | in range | Calendar intro ("Professional tree care is mostly timing") |
| urban tree management | 1-2 | 1 | 1 | in range | Rules intro, used generically (City vs owner responsibility) |
| tree disease | 1-2 | 2 | 2 | in range | Oak rule (oak wilt described as a fatal tree disease), FAQ |
| wisconsin | 3-10 | 6 | 7 | in range | DNR guidance, Wisconsin Arborist Association, Diggers Hotline law note, calendar intro, FAQ, footer |
| mature trees | 1-2 | 2 | 2 | in range | Construction rule, fall calendar item |
| tree cabling | 1-2 | 2 | 2 | in range | Remove/prune/leave section (twin trunks), calendar closing |
| tree preservation | 1-2 | 2 | 2 | in range | Construction rule (2026 tree protection ordinance), remove/prune/leave closing |
| professional tree removal | 1-2 | 1 | 1 | in range | Opening of the removal row |
| emergency tree services | 1-2 | 1 | 1 | in range | Step 4 of the who-to-call ladder |
| tree stump | 1-2 | 1 | 1 | in range | Opening of the stump grinding row |
| landscaping | 3-10 | 3 | 3 | in range | Removal row, stump grinding row, process step 3 |
| professional tree | 1-2 | 3 | 3 | above range | Covered by professional tree removal / trimming / care |
| great job | 1-2 | 1 | 1 | in range | Process step 4 ("We don't call it a great job until you have walked the yard with us") |
| tree removal services | 1-2 | 1 | 1 | in range | Closing sentence of the removal row |
| ash trees | 1-2 | 3 | 3 | above range | Removal row, ash rule heading + body |
| fallen trees | 1-2 | 1 | 1 | in range | Emergency row (trees tangled in wires wait for MGE) |
| skilled arborists | 1-2 | 1 | 1 | in range | Trimming row |
| planting | 3-10 | 5 | 5 | in range | Stump grinding row, spring + fall calendar items, FAQ |
| cottage grove | 1-2 | 1 | 1 | in range | Areas: Dane County list (also on the map and in schema areaServed) |
| madison wi | 1-2 | 2 | 3 | in range | H1, NAP address lines |

## Dropped entities

| Entity | Why |
|---|---|
| tree removal costs | Site rule: no prices or cost content anywhere. This topic is a pricing topic by definition, so it is left out rather than forced in. |
| san antonio | Geographic noise from the model's crawl set. Irrelevant to a Madison page. |
| maplewood tree care | A competitor's brand name. Naming competitors on your homepage helps them, not you. |
| houston | Geographic noise from the model's crawl set. Irrelevant to a Madison page. |
| heartwood tree company | A competitor's brand name (Madison). Same reason. |

## Credential entities: how they're handled

"Certified arborist", "ISA certified arborist" and their plurals are in the model because competitors claim them. This page mentions each one without claiming any of them for the business:

- The City of Madison recommends certified arborists for private trees (sourced to the City's page).
- Ash treatment belongs to a certified pesticide applicator, ideally an ISA Certified Arborist.
- Close calls on large trees near a house: get a written risk assessment from one of the area's certified arborists.
- FAQ: when you need an ISA Certified Arborist instead of a tree service, and where to verify the credential.
- Certified arborists' quarter-of-the-crown pruning rule.

If Quincy or a crew member holds an ISA credential, replace the third proof-strip item or add a line under the founder note: `ISA Certified Arborist on staff (cert. WI-0000A)` with the real number. Don't publish the claim without it.

## Local entities added (not in the model)

The model is national in flavour. These were added because they are what makes the page about Madison rather than about tree service in general:

Dane County, the Beltline, Seminole Highway, the isthmus, Lake Mendota, Warner Park, City of Madison Urban Forestry, MGO 23.40(7) oak work permit, terrace trees, right-of-way, Building Inspection, MGE, Diggers Hotline, Wisconsin DNR, Wisconsin Arborist Association, emerald ash borer, ANSI A300, the 2026 tree protection ordinance, the 2013/2022/2024/2026 event timeline, 21 Madison neighborhoods and 16 surrounding communities.
