--- 
title: Script de sauvegarde WordPress et MySQL
slug: script-de-sauvegarde-wordpress-et-mysql
date: 2008-09-01T00:00:00Z
---

Qui dit nouveau blog, plugins à gogo, tests et expérimentations, dit un jour ou l'autre : "si j'avais fait une sauvegarde, ça m'aurait évité de perdre mon blog et tout son contenu !".

Donc une des premières étapes de toute nouvelle installation de WordPress, il me fallait un script de backup digne de ce nom mais très simple (car "Simple is more" ;-) ).

## Mission accomplie !

Le script que je mets ci-dessous s'occupe de 3 choses :

* Faire une archive de l'installation de WordPress ;
* Sauvegarder la base de données ;
* Envoyer un mail de confirmation.

## Le secret

Le gros avantage de ce script est que nous n'avez pas à spécifier vos paramètres MySQL (nom de la base, machine, utilisateur, mot de passe). En effet, ils sont extrait du fichier wp-config.php situé dans le répertoire de WordPress.

Pour cela, j'ai utilisé un extrait du script de [AskApache.org](http://www.askapache.com), trouvable ici : [Encrypted WordPress / phpBB Backups](http://www.askapache.com/wordpress/encrypted-wordpress-site-backups.html). En particulier, le script utilise la commande `sed` pour extraire les variables MySQL et les créer en tant que variables dans le script. Une belle prouesse !

## Installation

1. Dézipper le script (unzip)
1. Le rendre exécutable : `chmod 700 wpbackup.sh`
1. Modifier les 3 lignes :
    * `EMAIL=monemail@mail.com` : email du destinataire
    * `WORDPRESS_PATH="/opt/wordpress"` : chemin de l'installation de WordPress
    * `BACKUP_PATH="/mnt/backups"` : chemin vers les sauvegardes

## Améliorations

Ce script peut être amélioré sur les points suivants :

* Sécuriser la création des archives : vérifier que ce qui est dans l'archive n'est pas corrompu. Le projet [VeriTAR](http://www.codetrax.org/projects/veritar) s'occupe de cette partie en comparant le checksum MD5 des fichiers à l'extérieur et à l'intérieur de l'archive. C'est un projet Python. Un exemple est trouvable sur le site [www.g-loaded.eu](http://www.g-loaded.eu/2007/12/01/veritar-verify-checksums-of-files-within-a-tar-archive/) ;
* Sauvegardes incrémentales : ne garder que les changements entre deux sauvegardes ;
* Copie sur un serveur distant : ne pas garder les sauvegardes uniquement sur la machine source. C'est le principe du "offsite backups" qui évite de perdre ses données en cas de panne ou de vol de la machine source.

## Planification

Je vous conseille fortement de planifier le lancement de ce script. Par exemple, toutes les semaines ou tous les jours si vous avez un peu d'espace disque.

## Contenu du script

```bash
#!/bin/sh

echo "### Backup running..."

#
# Customize these variables
#
EMAIL=monemail@mail.com
WORDPRESS_PATH="/opt/wordpress"
BACKUP_PATH="/mnt/backups"

# valid path ?
[ ! -d $WORDPRESS_PATH ] && echo "Not a valid directory : $WORDPRESS_PATH" && exit 1
[ ! -f $WORDPRESS_PATH/wp-config.php ] && echo "Cannot find wordpress config file 'wp-config.php'" && exit 1
[ ! -d $BACKUP_PATH ] && mkdir -p $BACKUP_PATH

#
# Script variables
#
NOW=`date +%Y-%m-%d_%Hh%Mm%S`
WP_PARENT=`dirname $WORDPRESS_PATH`
WP_DIR=`basename $WORDPRESS_PATH`
WP_BACKUPNAME="$WP_DIR-$NOW-wordpress.tar.bz2"
MYSQL_BACKUPNAME="$WP_DIR-$NOW-mysql.sql.bz2"

echo "Wordpress backup..."
cd $WP_PARENT
tar -jcf $BACKUP_PATH/$WP_BACKUPNAME $WP_DIR
cd $OLDPWD
echo "...done : $BACKUP_PATH/$WP_BACKUPNAME"

echo "Mysql backup..."

# read wordpress config
WP_CONFIG="$WORDPRESS_PATH/wp-config.php"
PROPS=$(sed -e "/define('DB_\(NAME\|USER\|PASSWORD\|HOST\)/!d" \
 -e "s/[^']*'DB_\(NAME\|USER\|PASSWORD\|HOST\)'[^']*'\([^']*\)'.*$/DB_\1='\2';/g" ${WP_CONFIG}) && eval $PROPS;

mysqldump --opt -h$DB_HOST -u$DB_USER -p$DB_PASSWORD --add-drop-table $DB_NAME | bzip2 -c9 > $BACKUP_PATH/$MYSQL_BACKUPNAME
echo "...done : $BACKUP_PATH/$MYSQL_BACKUPNAME"

# send emails
echo "Backup completed" | /usr/bin/mail -s "Wordpress and Mysql backups completed on `date`" $EMAIL

echo "### Backup done."
```

