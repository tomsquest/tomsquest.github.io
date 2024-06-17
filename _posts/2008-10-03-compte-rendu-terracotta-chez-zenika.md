---
title: "Compte-rendu de la présentation de Terracotta chez Zenika"
lang: fr
image: /assets/images/posts/2008/10/logo_terracotta.jpg
---

J'ai assisté hier à la présentation de [Terracotta](http://www.terracotta.org/) par son CTO et co-fondateur, Ari Zilka, organisé par la société [Zenika](http://www.zenika.com/).

Dés le début, le ton est donné dans la salle : 6 personnes lèvent la main en réponse à la question : "Qui a déjà essayé Terracotta ?". Terracotta bénéficie d'un bon buzz, au vu du monde présent à cette présentation. Malgré cela, la société ne croule pas sous le nombre de partenariat payant, une soixantaine d'après Ari Zilka. Beaucoup plus de monde s'intéresse à la partie gratuite et open source. La tendance qui se dégage est que les clients s'intéressent d'abord à la partie librement disponible et se transforme de temps en temps en client payant. Pourtant, le produit fonctionne et même très bien. Il se fait connaitre de plus en plus et marque des points. Il a beaucoup d'atout dans sa manche comme nous allons le voir.

## Terracotta, c'est quoi ?

Terracotta se propose de simplifier la vie des développeurs. Techniquement, il permet de partager la mémoire entre JVM. C'est une réduction simpliste mais l'idée est là. Je ne vais pas tenter de vous donner les détails techniques, on trouve beaucoup de ressources sur le Net à ce sujet. Le site propose des Patterns sur l'usage de Terracotta : qu'est-ce qu'il conseillé de faire avec ou non (pas de recherche par exemple).

Ari Zilka nous explique que les JVM utilisent une mémoire "réseau", appelé NAM (Network Attached Memory). Quand une JVM modifie une donnée, celle-ci est actualisée dans la NAM et elle est potentiellement mise à jour dans les autres JVM qui possèdent cette donnée. Les données ne sont pas partout à tout moment. Les Monitor (lock) sont également répliqués, une JVM pouvant indiquer qu'elle modifie cette donnée et que les autres ne doivent pas le faire. Cela est fait de manière transparente.

Simple, non ?

## Bénéfices

- clustering natif
- scalability : il suffit d'ajouter une nouvelle JVM pour que celle-ci utilise la mémoire partagée
- pas de messaging à écrire pour synchroniser les données
- simplicité de mise en place
- ...

J'entends déjà le soulagement de dizaines de développeurs qui ont du écrire des solutions similaires.

Mais il y a plus : un plugin Eclipse, apparemment bien conçu, qui vient assister le développeur : configuration, aide au codage, lancement du serveur Terracotta...

## Encore plus

Mais il y a encore plus : à l'image de Spring Source avec son serveur d'application qui bénéficie d'une console de monitoring avancée, Terracotta est dans la même veine. Il fournit une application permettant de visualiser l'ensemble des statistiques récolté sur l'ensemble des JVM. Les données sont, entres autres, le nombre de transactions et de locks en cours. En cas de problème, une session peut être enregistrée et rejouée afin de détecter un point de contention par exemple.

## Conclusion

Terracotta est donc un produit qui se veut simple dans ces principes mais il vise également les équipes de production qui auront à surveiller le fonctionnement des applications. Le slogan du produit est : Performance, Fiabilité et Simplicité. La société s'en donne les moyens en visant à la fois les développeurs et la production. C'est le modèle du serveur d'application de SpringSource que je citais plus haut. Dans les entreprises d'une certaine taille, l'un ne va pas sans l'autre.

Je me pose encore certaines questions sur le produit : pour quelle taille de projet est il destiné, est-ce que la version gratuite est suffisante et est-ce que ça marche vraiment bien ?

J'espère avoir l'occasion de travailler avec ce produit dans une future mission, ce sera l'occasion de répondre à ces questions car Ari Zilka nous a mis l'eau à la bouche.

## Petits mots sur la soirée

- Suite à une question de Nicolas Martignole, Ari Zilka a dissipé les rumeurs de rachat de Terracotta par Spring. Le détail sur le [site du Touilleur Express](http://www.touilleur-express.fr/2008/10/02/springsource-rachete-terracotta-ou-pas/)
- L'évènement a permis de faire connaître la société Zenika. Celle-ci veut organiser ce genre d'évènement tous les trois mois en invitant des personnes influentes. Prochain tour : quelqu'un de chez Spring Source ? :-)
- Encore une fois, ces événements permettent d'échanger avec des personnes très intéressantes : Julien Dubois (Spring Source), Florent Ramière (Jaxio), Nicolas Marignole, Erwan Alliaume (Xebia), Jérôme Van Der Linden (Octo)

Merci à Ari Zilka pour sa présentation.

Merci à Zenika pour l'organisation.
