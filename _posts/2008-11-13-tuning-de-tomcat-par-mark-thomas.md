---
title: Tuning de Tomcat par Mark Thomas
slug: tuning-de-tomcat-par-mark-thomas
lang: fr
---

<img src="/assets/images/posts/2008/11/tomcat-logo.gif" style="float:right"/>

Ce matin, aux [Rencontres Spring](http://www.rencontres-spring.com/), Mark Thomas a parlé du tuning de Tomcat en production. J'y ai appris plusieurs choses intéressantes que je résume ici.

Saviez-vous que 80% du temps de traitement d'une requête est faite dans l'application et non dans Tomcat.

Les logs devraient être configurés :

- De manière asynchrone :
  - Ils sont synchrones par défaut,
  - Attention à la taille des buffers qui pourraient conduire à des OutOfMemory,
  - Mettre les loggers en fallback synchrone si les buffers sont pleins ;
- Ne pas logger tout et n'importe quoi :
  - Remonter le niveau de log au maximum (selon la politique locale),
  - Ne pas logger dans la console.

Il est possible de cacher du contenu statique :

- Par défaut, 10Mo de contenu sont retenus pendant 5 secondes. A changer si on a de la RAM et du contenu vraiment statique ;
- Il existe la fonctionnalité « SEND_FILE » des connecteurs NIO et APR permettant d'indiquer à l'OS d'envoyer directement le contenu statique du disque dur vers la carte réseau.

Côté JVM, Mark rappelle que trop de mémoire est néfaste pour les performances : les GC seront plus longs. Il faut donc avoir les valeurs de XMS/XMX les plus faibles possibles. Pour cela, il faut étudier les besoins de l'application et mettre les valeurs en fonction.

Pour le load-balancing et la réplication des Sessions, le frontal sait qu'une session est affectée à un noeud tout simplement par l'usage d'un cookie spécial qui est reconnu par le frontal (mod_proxy_http par exemple).

Pour configurer le FailOver, Il suffit d'une ligne de conf. Mais la conf est plus complexe pour la Prod où il faut par exemple que les noeuds découvrent les autres membres du cluster.

Faire du load balancing avec du clustering demande un minimum de 3 instances. Mark conseille de tester cette configuration en dév et non la réserver pour la prod.
