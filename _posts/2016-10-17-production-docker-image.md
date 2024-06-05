---
title: "My attempt at building a production grade docker image"
slug: production-docker-image
date: 2016-10-17T00:00:00Z
---

![Book cover](/assets/images/posts/docker.png)

As I am self-hosting a couple of services, mainly for keeping my data for myself (Sorry Google, Facebook), I tried to build a "production-grade docker image". Here's my attempt and what I learnt along the way.

## Radicale

The first service I dockerized is [Radicale](http://radicale.org/), a calendar/contact server (CalDav/CardDav).

Radicale is a good choice for a start due to its simplicity:

* written in python
* filesystem database
* single config file
* runnable directly with `radicale`
* available in PyPI (`pip install radicale`)

If we wanted to stop here, this Dockerfile is sufficient:

```dockerfile
FROM debian:jessie

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update \
    && apt-get install -y python2.7 python-pip \
    && rm -rf /var/lib/apt/lists/*
    
RUN pip install radicale

CMD ["radicale"]
```

## Easy: Use a smaller base image

I started with a Debian base image, then switch to an Alpine image, then found there are even alpine+python images.

The official Python images have an Alpine version: https://hub.docker.com/_/python/

I did not set a specific image version (eg. `python:3.5.2-alpine`) in the hope that it could ease upgrades and 
that a rebuild could be automatically fired by Docker hub using a configured dependency. Forget repeatable builds !

Let's go for `python:3-alpine`:

```Dockerfile
FROM python:3-alpine

RUN pip install radicale

CMD ["radicale"]
```

## Easy: Process management

It seems a good practice to use a process manager to handle PID 1 and reaping subprocesses.
As I don't know if Radicale handles signals properly, nor if it would create new subprocesses and handle them well, 
let's use a process manager (this is more cargo-cult than scientific evidence).

I started with [Yelp's Dumb Init](https://github.com/Yelp/dumb-init) but:

* I got strange messages when stopping the container
* Dumb Init is in `PyPI` but requires a C compiler installed, which needs to be added to the Alpine image

Alternative: use [Tini](https://github.com/krallin/tini), a `tiny but valid 'init' for containers`. 
Tini has the advantages of _just_ working and installable in Alpine with `apk add --update tini`.

Here is our image with Tini:

```Dockerfile
FROM python:3-alpine

RUN pip install radicale

ENTRYPOINT ["/tini", "--"]
CMD ["radicale"]
```

## Hard: Volumes and permission

Next best practices: Never Run As **Root**. 
We don't do that for hosted services since decades, so don't do that inside containers, 
especially publicly opened containers. The Docker Security team does not recommend it either 
(https://www.youtube.com/watch?v=LmUw2H6JgJo).

That means: use the `USER` instruction or switch user when the container is run. 
Combined with a volume, that's were I started having **permission problems**.

What seems to occur is that mounting a host volume (eg. `docker run ... -v /path:/data/radicale`) 
overwrites the permission **in** the container. What was owned by `radicale:radicale` became owned by `root:root` in the container.

The reason is that the Docker daemon runs as `root`, so the mounted volume became root (UID=0) **in** the container, in which, UID=0 is also root. Note that, when the `radicale` user in the container has the UID 1000, which is my user on the host. Complete detail here: https://denibertovic.com/posts/handling-permissions-with-docker-volumes/
 
I first found a solution from [Stack Overflow](https://stackoverflow.com/questions/23544282/what-is-the-best-way-to-manage-permissions-for-docker-shared-volumes) and 
in the book [Using Docker](http://shop.oreilly.com/product/0636920035671.do) by Adrian Mouat (excellent book btw).

The [Redis docker image](https://hub.docker.com/_/redis/) handles the permission problem this way:

* First, use a custom entrypoint:

```Dockerfile
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
```

* Then, `chown $user` the mounted volume in the entrypoint script:

```shell
if [ "$1" = 'redis-server']; then
    chown -R redis .             # Fix permissions
    exec gosu redis "$0" "$@"    # Run as `redis` and not `root`
fi
```

I reproduced the same behavior in my Radicale image with Tini:

```Dockerfile
COPY docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["/sbin/tini", "--", "docker-entrypoint.sh"]
CMD ["radicale", "--config", "/radicale/config"]
```

[docker-entrypoint.sh](https://github.com/tomsquest/docker-radicale/blob/master/docker-entrypoint.sh):

```shell
if [ "$1" = 'radicale' -a "$(id -u)" = '0' ]; then
    chown -R radicale .
    exec su-exec radicale "$@"
fi
```

I used [Su-exec](https://github.com/ncopa/su-exec), a lightweight alternative to Gosu and more importantly, 
su-exec is available in Alpine repositories.

## S6, the alternative

[S6-Overlay](https://github.com/just-containers/s6-overlay) contains the [S6](http://skarnet.org/software/s6/overview.html) series of scripts. As `overlay` they means a tgz to unpack in the image.

S6-Overlay is a complete alternative, it provides:

* An init system; it could replace Tini.
* A script to fix permissions (custom scripts in `/etc/fix-attrs.d`); replace the `chown radicale`
* Dropping privileges; replace Su-Exec

I did not had the time to play with S6. The thing is quite complex and powerful, maybe more that what I need.

## Next

There are still many things to do **outside** the image itself. I have yet to:

* [x] Manage/Restart the container with Systemd
* [ ] Limit the number of automatic restart in Systemd
* [ ] Monitor the process in the container
* [ ] Limit the container capabilities
* [ ] Limit the container networking
* [ ] Limit the container resources
* [ ] Test automatically the process when rebuilding the image (the Python version is not enforced)
* [ ] Put the log in their own file and rotate them

My Radicale image is available at:

* Docker Hub: https://hub.docker.com/r/tomsquest/docker-radicale/
* Github: https://github.com/tomsquest/docker-radicale
