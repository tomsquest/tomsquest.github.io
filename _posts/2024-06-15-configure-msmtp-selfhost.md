---
title: How to configure MSMTP for self-hosted email
lang: en
---

I recently reinstalled my server and configured `msmtp` to send emails to myself. It wasn't working right at first. Here's how to configure it properly.

## TL;DR

- Set `allow_from_override` to `off`
- Use an `aliases` file with a `default` alias

## MSMTP

MSMTP is the recommended tool to send emails from a server, much simpler than a full email solution like Postfix. It's also actively maintained, unlike SSMTP which I used before.

Install MSMTP with its `-mta` version:

```bash
apt install msmtp-mta
```

I use the service of [MailJet](https://www.mailjet.com/) to send emails. It's free for a few thousand emails per month. Working great for years!


## Goal

1. Allow services to send email to **myself and only myself**.
2. Ensure MailJet accepts emails only if they originate **from myself**. 

The `From` field must be set to me. And a `default` must be set.
Those were the main issues I had.

## Configuration

The main points :
- Set `allow_from_override` to `off` so that smtp can set the `From` field
- Set a `From` in MSMTP
- **AND** set an alias file (see below)

Config in `/etc/msmtprc`:

```bash
account default
host in-v3.mailjet.com
port 587
tls on
tls_starttls on
auth on
user 1234
password abcd
from tom@tomsquest.com
allow_from_override off
set_from_header on
aliases /etc/msmtprc_aliases
syslog LOG_MAIL
```

Aliases in `/etc/msmtprc_aliases`:

```bash
default: tom@tomsquest.com
```

This way, all conditions are handled:
- a service can set a `From` field (`root`, `@tom`...)
- Or no `From` field at all

## About self-hosting

I self-host most of my services, such as:
- [Calendar/Tasks using my custom Radicale image](https://github.com/tomsquest/docker-radicale/)
- qBittorent
- SearchX
- Backup with Restic
- Synchronization with Syncthing


### Self-hosting is an excellent way to learn 

There's always a risk when you colocate your data with services made by others.

That's why I read a lot on Docker and created my own Docker image for the calendar server Radicale! I wanted it to not run as root, be read-only, and avoid pid1 issues.

### Requires a Bit of Surveillance

For instance, I receive backup emails twice a day and check each time which files were backed up. That's part of my routine.

I also monitor Crowdsec and update emails.

### Cumbersome every few years

Yes, upgrades run automatically, but moving from one LTS version to another requires reinstalling. I've done it twice in 8 years.
No, I didn't go the Ansible route (it requires testing and thus time), and the same with NixOS.
I just have a partial documentation of high-level actions and backup my /etc files.
