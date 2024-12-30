---
title: "Bulletproof Your Files in 2025: The Syncthing + Restic Setup"
lang: en
image: /assets/images/posts/2024-12-30-syncthing-restic-backup-setup-2025/full.png
---

Lost files? Outdated versions? A proper backup strategy eliminates these risks.  
Here's my battle-tested setup and the solution I recommend for 2025.

## TL;DR

- **Goal**: multiple copies of the files, and an offsite backup
- **Syncthing** copies the files between devices: laptop, desktop, mobile, tablet...
- **Restic** backups the files to a remote location

## Syncthing (sync files)

[Syncthing](https://syncthing.net) is an open-source solution that synchronizes files across devices without cloud dependencies. It's reliable, secure, and just works.

### Key Features:

- **Automatic Sync**: Changes are detected and synced in real-time between your devices
- **Ease of Setup**: Install, link devices, and select folders to sync.
- **Privacy**: Data is encrypted during transmission.
- **Cross-platform**: Linux, Windows, Android...

### Setup

1. Install Syncthing on all devices (phone, tablet, laptop, desktop, server)
2. Link devices via ID or QR code
3. Select folders to sync

There is no credential, no authentication, as devices need mutual authentication.

Pure magic!

### How I use it

Some folders are shared between devices, but not all. 

For example, the `music` directory is shared between all devices, but `documents` are not shared with my phone, as I fear it to be stolen or lost.

But it is just a matter of ticking a box and accepting the folder on the other side.

![syncthing.png](/assets/images/posts/2024-12-30-syncthing-restic-backup-setup-2025/syncthing.png)

## Restic (backup files)

[Restic](https://restic.net/) can be impressive but remains simple in concept. It’s designed for secure and efficient backups.

You can think of Restic as your personal vault, where data is encrypted and deduplicated for efficiency.  
You can back up your files to a variety of storage backends, a cloud provider or an external drive.

### Key Features

- Encryption: all data is secured and never leave your computer unencrypted
- Deduplication: Identical data blocks are stored only once, saving space and so, costs
- Incremental Backups: Only changes since the last backup are saved, reducing time and storage usage
- Cross-platform: Linux, Windows...

### My Setup

- Central `server` device collects all backup-targeted folders. This is my self-hosted server, which is always on.
- Automated backups to [Scaleway](https://www.scaleway.com) object storage (twice daily)
- Retention policy: 30 daily, 8 weekly, 12 monthly, 2 yearly snapshots

As per the provider, I went from [Backblaze](http://backblaze.com/) (aka "b2") to [Scaleway](https://www.scaleway.com), because I have fees paying in dollar with my French bank. It was a matter of using `restic sync` between the old and the new providers. I would recommend Scaleway if you pay in euros.

![restic.png](/assets/images/posts/2024-12-30-syncthing-restic-backup-setup-2025/restic.png)

## Next Up: Ransomware-Proof backups

My next article will be on how to enable [Kopia Ransomware protection](https://kopia.io/docs/advanced/ransomware-protection/) on Scaleway.

The goal here is to protect against someone accessing, deleting, or altering the backup.  
To achieve this level of protection, [Kopia](https://kopia.io/) is needed  
Kopia is an alternative to Restic and also offers great features and has a User Interface.  
For this article, I focused on Restic, because Restic is stable, maybe "less modern", but for backups, the reliable aspect is key.

## Conclusion

This **Syncthing + Restic** combo delivers bulletproof file management: seamless sync, encrypted backups, and peace of mind. 

[Syncthing](https://syncthing.net) keeps everything effortlessly in sync across your devices, while [Restic](https://restic.net/) ensures your data is safe and recoverable even in a worst-case scenario.

By the way, about the software point-of-view, the changelogs of Restic are awesome, with a summary then details about each point. A big shoutout to the maintainers!

See you soon for the next article about Ransomware protection.
