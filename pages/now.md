---
layout: page
permalink: /now/
title: Now
class: now
---

## 2024

### December 2024

- <span class="tag">[blog]</span> Publish my full restic setup
- <span class="tag">[blog]</span> Publish my syncthing + restic backup setup
- <span class="tag">[selfhost]</span> Full Kopia setup in place on my server with object-lock, retention policy, permission-less apikey
- <span class="tag">[book]</span> Read the second book of the "Les Enquêtes de la 25e Heure". Enjoyed it (answers!).
- <span class="tag">[audiobooks]</span> Finished 3 audiobooks. 2 bad, 1 good. Running and biking help a lot. But no notes means less memory.
- <span class="tag">[selfhost]</span> Tweaked Crowdsec to not ban my mobile phone. I think it may be related to Firefox doing making queries for favicon (favicon-16, favicon-32 and so on) that all get blocked by http-auth, then Crowdsec bans the IP
- <span class="tag">[selfhost]</span> Manage to find the correct bucket permission for Kopia to be able to extend the object-locks. Need to wait a couple of days to see if the Lifecycle policy does not drop everything eventually.
- <span class="tag">[selfhost]</span> Switched from FreshRss to [Miniflux](https://miniflux.net/) because the responsive part of FreshRss never worked well
- <span class="tag">[code]</span> Played with [KuzuDB](https://kuzudb.com/), an embedded graph database. Tons of applications at work.
- <span class="tag">[selfhost]</span> Tried [Kopia](https://github.com/kopia/kopia/) to backup with Ransomware protection (ie. object-lock, retention policy, permission-less apikey). An article is coming.

### Novembre 2024

- <span class="tag">[code]</span> Discovered [DataChain](https://datachain.ai/) that could handle our ML datasets (products, image...)
- <span class="tag">[code]</span> Restarted [MediathequeRoubaix.ts](https://github.com/tomsquest/mediathequeroubaix.ts) and switched to [composable-functions](https://github.com/seasonedcc/composable-functions) (a kind of functional-programming library), using Bun, Biome and LeftHook
- <span class="tag">[selfhost]</span> Moved Restic backup from BackBlaze to Scaleway to be billed in euros.<br>Very smooth using `restic copy`
