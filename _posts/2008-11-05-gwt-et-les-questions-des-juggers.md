--- 
title: GWT et les questions des Juggers
slug: gwt-et-les-questions-des-juggers
date: 2008-11-05T00:00:00Z
---

<img src="/img/posts/2008/11/gwt.jpg" style="float:right"/>

Hier, le JUG parisien s'est retrouvé pour une présentation de [GWT](http://code.google.com/webtoolkit/) et de  [REST-GWT](http://code.google.com/p/gwt-rest/).

Didier Girard s'est occupé de la première partie. Je n'aurai jamais dû l'écouter ! Maintenant je suis presque triste d'écrire du Spring MVC. J'ai l'impression de me sentir hors du coup, passé de mode. Il m'a bien fait comprendre que je devais me mettre d'urgence au toolkit de Google. Si j'ai bien retenu, GWT c'est simple, pas cher, solide, efficace, ergonomique... le graal du Web ? Pas pour tous. Flex est également bien positionné côté Java. Mais c'est un autre débat.

Si vous voulez un résumé de la soirée, le Touilleur a écrit le [compte rendu de la soirée](http://www.touilleur-express.fr/2008/11/05/soiree-gwt-et-restlet-au-paris-jug/).

Pour revenir sur cette session, les juggers ont posé plusieurs questions intéressantes.

## Comment GWT s'intègre à une mise en page existante ?

L'outil de Google est dédié à la présentation. D'après Didier, il permet de coder 5 fois plus vite la couche graphique Web de son application. GWT repose sur un modèle en composant. Par exemple, il dispose d'objets Champ texte, Tableau... Chacun de ces composants supporte les CSS et est donc potentiellement skinnable.

Donc côté intégration à un modèle de page fourni par un WebDesigner, il n'y aurait aucun souci. Il suffit de partir du HTML et d'appliquer les styles au composant GWT.

## Et l'intégration avec Maven 2 ?

Didier est direct : « Ca marche mais ce n'est pas simple ». Les ingénieurs de Sfeir le font sur plusieurs de leurs projets, notamment pour lancer les tests fonctionnels dans leur processus d'intégration continue.

Petite recherche sur google avec « GWT maven » donne :

* En premier, un lien vers le projet GWT-Maven » qui permet d'intègre les deux projets (génération du War, lancement...)
* En second, un article nommé : [GWT and Maven2, Oh the pain !](http://rbtech.blogspot.com/2007/06/gwt-and-maven-2-oh-pain.html).

Donc oui, c'est possible, certains le font mais ce n'est pas « out of the box ».

## Et la testabilité ?

La question n'a pas été posée au JUG mais j'aurai aimé plus d'infos à ce sujet donc je la pose ici. Didier a évoqué la possibilité de tester son IHM grâce à [Selenium](http://www.tomsquest.com/blog/2008/09/selenium-en-java-demarrage-rapide/). Je suis un peu surpris car si GWT produit du javascript à la pelle, il sera sûrement dur à tester. Sur notre projet, on a connu ça avec le composant Auto-complete de Yahoo UI qui nous a donné un peu de mal.

En recherchant un peu, je vois que je me faisais des idées : oui, une interface GWT est testable sans soucis, ça reste du HTML avec une couche JS. J'imagine qu'il faut toujours rendre son code HTML testable (positionner des IDs et structurer son code).

Matt Raible a posté une vidéo à ce sujet : [Selenium User Meeting](http://raibledesigns.com/rd/entry/selenium_user_meetup_videos_posted).
