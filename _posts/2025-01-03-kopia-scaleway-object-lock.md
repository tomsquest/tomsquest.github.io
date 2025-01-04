---
title: Ransomware-Resistant Backups with Kopia and Scaleway Object Lock
lang: en
---

With backups, the ultimate goal is to protect against **ransomware** attacks and for someone, even you, to prevent any deletion.  
This guide demonstrates how to set up secure backups with Object Lock. We will use [Kopia](https://kopia.io) as the backup tool and [Scaleway](https://www.scaleway.com) as the cloud provider. 

## What we will achieve

At the end of this guide, you will have:
- A [Scaleway](https://www.scaleway.com) bucket whose content cannot be deleted until a set period
- [Kopia](https://kopia.io) configured to use this bucket and leverage Object Lock

The base of this guide is the [Kopia Ransomware Protection page](https://kopia.io/docs/advanced/ransomware-protection/), adapted to Scaleway. This page is quite good to explain the risks and steps to protect against ransomware.

Estimated time: 1 hour

## Ransomware protection and deletion prevention

A hacker can gain access to your backup and drop them.  
The goal is to prevent this from happening.

We will use `Object Lock` and `Compliance` to prevent deletion of the backups.

### What is Object Lock?

From [Amazon S3 documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html):

> S3 **Object Lock** can help prevent Amazon S3 objects from being deleted or overwritten for a fixed amount of time or indefinitely.   
> Object Lock uses a write-once-read-many (WORM) model to store objects.  
> You can use Object Lock to help meet regulatory requirements that require WORM storage, or to add another layer of protection against object changes or deletion.

### What is Compliance mode?

> In **compliance** mode, a protected object version can't be overwritten or deleted by any user, including the root user in your AWS account.   
> When an object is locked in compliance mode, its retention mode cannot be changed, and its retention period cannot be shortened.  
> Compliance mode helps ensure that an object version cannot be overwritten or deleted for the duration of the retention period.

### Secure against everything?

**No**.

✅ We will protect against malicious or clumsy deletions.

❌ We will not protect against someone accessing the Scaleway account directly and either removing the policies to destroy files or resources or deleting the account.  

❌ Also, we cannot protect against silent encryption of your files, day after day.

As always, make scenarios and test your backups.

## Why Kopia?

[Kopia](https://kopia.io) is a modern backup tool that supports Object Lock, making it an ideal choice for creating secure, ransomware-resistant backup.

Kopia also provides:
- a UI if you prefer, and can be a good way to test it out
- a server if you want to offer backup as a service to your users
- notifications (e.g. summary email of snapshots, push...)
- actions before/after snapshots

### Why not keeping with Restic?

In the past, I have been using [Restic](https://restic.net/), but it lacks support for Object Lock. Technically, I would say that Restic is a really safe choice, with carefully designed features, where Kopia has more bells and whistles, but seems to be less actively maintained, with a smaller community.

## Why Scaleway?

[Scaleway](https://www.scaleway.com) checks all the boxes for me:
- Object Lock support
- Cheap
- Billing in euros

[Backblaze](https://www.backblaze.com/) B2 is also a good choice, but billing is in dollar.

## Prerequisites

- A Scaleway account
  - Scaleway will be used for Object Storage, storing the blobs of the backup
  - You can test Scaleway Object Storage with the 750 go offered for free
- AWS CLI installed (`brew install awscli`)
  - Needed to enable object lock on the bucket, as Scaleway does not (yet) provide a way to do it directly in the UI
- Kopia backup software
  - Kopia, compared to Restic, supports object lock

## Retention period

I personally keep my backup for **2 years**. Adapt the duration for your needs.

So you will see alot of `730d` in the commands (= 2 years).

## Global overview

1. Initial Setup on Scaleway
   1. Get an API Key
   2. Create a Bucket with Object Lock
   3. Configure Object Lock Retention
2. Kopia Setup
3. Make Backups with Kopia
4. Secure Scaleway side
5. Restore Options

## 1. Scaleway Configuration

![overview.png](/assets/images/posts/2025-01-03-kopia-scaleway-object-lock/overview.png)

### 1.1 Initial Setup

**Goal**: have an API Key to create the Bucket.

I initially did screenshots of all steps, but by following the steps, you should be able to do it without them, and it makes the steps clearer.

1. Create a new Project from the top menu
   - A `Project` is basically a way to group resources together. Nothing special here.
2. Create a new Application
   - An `Application` is a technical way to access the project
   - Go to `IAM > Applications` and create a new one 
3. Generate an API key for the application
   - The `API key` is used to authenticate the application
   - Set the `prefered project` to the project you created. This is mandatory as the Aws CLI has no notion of "projects," so we need a default one.
   - Keep the `SCW_ACCESS_KEY` and `SCW_SECRET_KEY` for later
4. Create an IAM Policy with `AllProductsFullAccess` permission initially attached to this application (the "Principal")
    - This broader access is **temporarily** needed to create and configure the bucket. We'll restrict the permissions after setup is complete

So far, we have an API Key allowed to do anything in the project.

### 1.2 Configure AWS CLI for Scaleway

**Gooal**: create a bucket with object lock and compliance mode.

**Note**: Scaleway does not provide a way to enable Object Lock directly in the UI, this is on the roadmap for 2025. So, we will use the AWS CLI to configure it.

Follow the [documentation to configure the AWS CLI](https://www.scaleway.com/en/docs/storage/object/api-cli/object-storage-aws-cli/).

Create `~/.aws/config` (note: I am using the Paris datacenter):
```ini
[default]
region = fr-par
output = json
services = scw-fr-par
s3 =
    max_concurrent_requests = 100
    max_queue_size = 1000
    multipart_threshold = 50 MB
    multipart_chunksize = 10 MB
[services scw-fr-par]
s3 =
    endpoint_url = https://s3.fr-par.scw.cloud
```

Create `~/.aws/credentials` and replace with the API key credentials:
```ini
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
```

### 1.3 Create Object Lock-Enabled Bucket

Create the bucket with Object Lock enabled:
```bash
aws s3api create-bucket \
    --object-lock-enabled-for-bucket \
    --bucket YOUR-BUCKET-NAME
```

Verify the configuration:
```bash
aws s3api get-object-lock-configuration --bucket YOUR-BUCKET-NAME
```

### 1.4 Configure Object Lock Retention

Configure Object Lock with 2-year retention in `COMPLIANCE` mode:

```bash
aws s3api put-object-lock-configuration \
    --bucket YOUR-BUCKET-NAME \
    --object-lock-configuration '{
        "ObjectLockEnabled": "Enabled",
        "Rule": {
            "DefaultRetention": {
                "Mode": "COMPLIANCE",
                "Days": 730
            }
        }
    }'
```

### Recap

1. We have an API Key with full access
2. We have a bucket with Object Lock enabled and a 2-year retention period

## 2. Kopia Setup

### 2.1 Create Repository

**Goal**: create a Kopia repository in the Scaleway bucket.

**Note**: We also declare the retention period in Kopia for it to extend the Object Lock retention.

```bash
kopia repository create s3 \
    --endpoint s3.fr-par.scw.cloud \
    --bucket YOUR-BUCKET-NAME \
    --access-key YOUR_ACCESS_KEY \
    --secret-access-key YOUR_SECRET_KEY \
    --retention-mode COMPLIANCE \
    --retention-period 730d
```

Validate the repository configuration:
```bash
kopia repository validate-provider
```

### 2.2 Configure Repository Settings

Enable object lock extension during maintenance:
```bash
kopia maintenance set --extend-object-locks true
```

Set maintenance ownership (required if the repository was created on a different host):
```bash
kopia maintenance set --owner=me
```

### 2.3 Configure Kopia

**Note**: Kopia used "policies" to configure itself. Those are stored in the repository.

**Note**: Maybe more convenient, the global policy can be exported, modified and re-imported:

```bash
kopia policy export --global --to-file policy.json
kopia policy import --global --from-file policy.json
```

Else, the policy can be changed using the command line:
```bash
kopia policy set --global \
    --keep-latest=28 \
    --keep-hourly=48 \
    --keep-daily=30 \
    --keep-weekly=16 \
    --keep-monthly=24 \
    --keep-annual=2 \
    --add-ignore "**/.cache" \
    --add-ignore "**/.local" \
    --add-ignore "**/.git"
```

Optional: Enable compression if desired:
```bash
kopia policy set --global --compression=zstd
```

Display the policy configuration:
```bash
kopia policy show --global
```

### 2.4 Kopia Maintenance (extend object lock)

Kopia needs to extend the object lock retention period. This is done with the `maintenance` command.

By default, Kopia will run the full maintenance every day, which is fine for me. 

You can adjust the schedule with the `kopia maintenance set` command if you wish.

### Recap

- We have a working Kopia repository, fully configured.
- Yet, we have not yet set up the backup itself.
- And we are still using the full-access API key.

## 3. Make Backups with Kopia

We follow [Restic's documentation for non-root backups](https://restic.readthedocs.io/en/stable/080_examples.html#backing-up-your-system-without-running-restic-as-root).

### 3.1 Create Dedicated User

Create a system user for Kopia:
```bash
useradd --system --create-home --shell /sbin/nologin kopia
```

### 3.2 Install and Configure Kopia Binary

**Note**: the version of Kopia, adapt to the latest version.

Download and set up the Kopia binary with appropriate permissions:
```bash
wget -O kopia.tgz https://github.com/kopia/kopia/releases/download/v0.18.2/kopia-0.18.2-linux-x64.tar.gz
tar xf kopia.tgz
mv kopia-0.18.2-linux-x64/kopia /home/kopia/
rm -rf kopia-0.18.2-linux-x64 kopia.tgz # cleanup
chown root:kopia kopia
chmod 750 kopia
```

Grant read access to all files without root privileges:
```bash
setcap cap_dac_read_search=+ep kopia
```
### 3.3 Systemd service and timer

**Note**: The snippets below are not the one I used. Mine are more complex and are adapted from my article [Backup with Restic](https://www.tomsquest.com/blog/2024/12/backup-restic-setup/#backup)

In `/etc/systemd/system/kopia-backup.service`:

```ini
[Unit]
Description=Kopia Backup Service
After=network.target

[Service]
Type=oneshot
User=kopia
ExecStart=/home/kopia/kopia snapshot create /path/to/backup
```

In `/etc/systemd/system/kopia-backup.timer`:

```ini
[Unit]
Description=Run Kopia Backup

[Timer]
# Run daily at 2 AM
OnCalendar=*-*-* 02:00:00

# If the system was off when the backup should have run, run it when the system starts
Persistent=true

[Install]
WantedBy=timers.target
```

Enable the timer:
```bash
systemctl daemon-reload
systemctl enable kopia-backup.timer
````

This should help you start with Kopia.

For reference, I use this backup script for Kopia (in `/home/kopia/backup.sh`):

```bash
#!/bin/bash
  
set -euo pipefail

BACKUP_DIRS=(
    "/data"
    "/etc"
)

function secondsToHuman {
  local startTime="$1"
  local now=$(date +'%s')
  local elapsed=$((now - startTime))
  echo "$(( elapsed / 3600 ))h $(( (elapsed / 60) % 60 ))m $(( elapsed % 60 ))s"
}

function connect {
  local startTime=$(date +'%s')
  echo "## Connecting... ➡️"
  /home/kopia/kopia repository connect s3 --endpoint "$ENDPOINT" --bucket "$BUCKET"
  echo "## Done connect in $(secondsToHuman "$startTime") seconds"
}

function backup {
  local startTime=$(date +'%s')
  echo "## Backup starting... ➡️"
  local dirs_string="${BACKUP_DIRS[@]}"
  /home/kopia/kopia snapshot create --json $dirs_string
  echo "## Done backup in $(secondsToHuman "$startTime") seconds"
}

function diff {
  local startTime=$(date +'%s')
  echo "## Computing diff of latest snapshots... ➡️"

  for dir in "${BACKUP_DIRS[@]}"; do
    LAST_SNAPSHOT="$(/home/kopia/kopia snapshot list "$dir" --show-identical --all --json --reverse | jq --raw-output '.[0] | .id')"
    PREV_SNAPSHOT="$(/home/kopia/kopia snapshot list "$dir" --show-identical --all --json --reverse | jq --raw-output '.[1] | .id')"
        
    if [ -n "$LAST_SNAPSHOT" ] && [ -n "$PREV_SNAPSHOT" ]; then
      /home/kopia/kopia diff "$PREV_SNAPSHOT" "$LAST_SNAPSHOT" | grep -v -e "modification times differ:" -e "sizes differ:" || true
    else
      echo "Warning: Couldn't find two snapshots for $dir to compare"
    fi
  done

  echo "## Done computing diff of latest snapshots in $(secondsToHuman "$startTime") seconds"
}

function listSnapshots {
  local startTime=$(date +'%s')
  echo "## Listing snapshots starting... ➡️"
  /home/kopia/kopia snapshot list --all --show-identical
  echo "## Done list-snapshots in $(secondsToHuman "$startTime") seconds"
}

function check {
  local startTime=$(date +'%s')
  echo "## Check starting... ➡️"
  /home/kopia/kopia snapshot verify --verify-files-percent=2 --file-parallelism=10 --parallel=10
  echo "## Done check in $(secondsToHuman "$startTime") seconds"
}

function main {
  local startTime=$(date +'%s')

  source /home/kopia/kopia-env.sh

  connect
  backup
  diff
  listSnapshots
  check

  echo "## All done in $(secondsToHuman "$startTime" ) seconds ✅"
}
```

### Recap

- Backups are not automated with simple service and timer
- A more powerful script is provided
- We still need to secure the bucket and restrict the permissions

## 4. Secure the Bucket

### 4.1 Restrict the API Key (IAM Policy)

**Goal**: restrict the API Key to only what is needed.

**Note**: Scaleway has two mechanisms in place: IAM Policies and Bucket Policies. We need both to secure the bucket.

We will change the IAM Policy we created earlier on Scaleway.

Go back to Scaleway and change the IAM policy to restrict the permissions.

The permissions needed are:
- `ObjectStorageReadOnly`
- `ObjectStorageBucketsRead`
- `ObjectStorageObjectsRead`
- `ObjectStorageObjectsWrite`
- `ObjectStorageObjectsDelete`

**Note**: we still need the `ObjectStorageObjectsDelete` permission, but that does not mean a real deletion. As Object Lock is enabled, deletion just means "put a deletion marker" on a version of a file. All the data remains in the bucket for the duration of the retention.

Scaleway provides a page ["Amazon S3 and IAM permissions equivalence"](https://www.scaleway.com/en/docs/storage/object/reference-content/s3-iam-permissions-equivalence/#objectstoragereadonly) to help you map the permissions.

Screenshot of the IAM Policy:

![iam_policy.png](/assets/images/posts/2025-01-03-kopia-scaleway-object-lock/iam_policy.png)

### 4.2 Bucket Policy

**Goal**: inside the bucket, restrict the permissions to only what is needed.

**Note**: Scaleway has a convenient policy editor, but it lacks the `s3:PutObjectRetention` action, so we will need the JSON editor. A way to work around this is to create the policy in the editor, then switch to JSON mode to add the missing action. See the full [list of supported action](https://www.scaleway.com/en/docs/storage/object/api-cli/bucket-policy/#action).

**Note**: Kopia needs the `s3:DeleteObject` action to be able to set deletion markers. This is not a real deletion, as the object lock is enabled.

Go to `Object Storage`, select your bucket and add a policy.

Here is the policy in JSON (adapt the ID and bucket):

```json
{
  "Version": "2023-04-17",
  "Id": "backup-restricted",
  "Statement": [
    {
      "Sid": "1",
      "Effect": "Allow",
      "Principal": {
        "SCW": "application_id:YOUR_APP_ID"
      },
      "Action": [
        "s3:AbortMultipartUpload",
        "s3:DeleteObject",
        "s3:DeleteObjectTagging",
        "s3:GetBucketTagging",
        "s3:GetBucketVersioning",
        "s3:GetBucketWebsite",
        "s3:GetLifecycleConfiguration",
        "s3:GetObject",
        "s3:GetObjectTagging",
        "s3:GetObjectVersion",
        "s3:GetObjectVersionTagging",
        "s3:ListBucket",
        "s3:ListBucketMultipartUploads",
        "s3:ListBucketVersions",
        "s3:ListMultipartUploadParts",
        "s3:PutObject",
        "s3:PutObjectRetention",
        "s3:PutObjectTagging",
        "s3:PutObjectVersionTagging"
      ],
      "Resource": [
        "YOUR-BUCKET-NAME",
        "YOUR-BUCKET-NAME/*"
      ]
    }
  ]
}
```

### 4.3 Lifecycle Policy

**Goal**: After the retention period, delete the files, else we will keep everything forever.

Create a lifecycle policy to clean up deleted files. The lifecycle deletion period must match the Object Lock retention period (730 days) to maintain consistency.

```json
{
  "Rules": [
    {
      "ID": "Delete old versions",
      "Status": "Enabled",
      "Filter": {},
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 730
      }
    }
  ]
}
```

### Recap

- We have restricted the permissions of the API Key using an IAM Policy
- We have restricted the permissions of the bucket using a Bucket Policy
- We have set up a lifecycle policy to delete old versions (> retention period)

## 5. Restore Options

**Goal**: test the restore options.

### 5.1 Restore latest snapshot

```bash
kopia snapshot restore --snapshot-time="latest" /my-backup-dir /destination
```

### 5.2 Restore specific Point in Time

In this scenario, something has deleted snapshots or ransomware, and we want to get back in time before the deletion. 

We need to connect to the repository at a specific point in time using the `--point-in-time` option.

```bash
kopia repository disconnect
kopia repository connect s3 \
  --endpoint $ENDPOINT --bucket $BUCKET \
  --point-in-time=2025-01-01T00:00:00Z
```

## Conclusion

Through this guide, we have set up a robust, ransomware-resistant backup system using Kopia and Scaleway's Object Lock feature. 

The combination provides several key security benefits:
- Object Lock with Compliance mode ensures backups cannot be deleted or modified, even by administrators, for a set period.
- Multiple layers of security through restricted IAM policies and bucket permissions

While no system is completely impenetrable, this setup provides strong protection for your critical data (think: your selfies 🤳, your collection of memes 😋).