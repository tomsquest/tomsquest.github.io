---
title: "MoreUnit : les tests plus vite sous Eclipse"
slug: moreunit-les-tests-plus-vite-sous-eclipse
lang: fr
date: 2009-07-29T00:00:00Z
---

<img src="/assets/images/posts/classDecoration.png" style="float:right"/>

J'ai découvert aujourd'hui le plugin [MoreUnit](http://moreunit.sourceforge.net) pour Eclipse. Celui-ci accélère grandement le passage code/test et la création de tests.

Il permet de :

- Passer d'une méthode à ses tests et des tests à la méthode testée (ctrl+j depuis une méthode)
- Montrer les méthodes et classes testées
- Créer un test pour la méthode en cours (ctrl+u) [même si ça ne remplace pas "Ctrl+3 &gt; New Junit test case"]
- Changer le nom et déplacer les tests lors d'un refactoring

Je le trouve vraiment pratique pour switcher d'une méthode aux tests et inversement. Il montre également les méthodes et classes qui ne sont pas testées et synchronise les tests quand je renomme une méthode. Un vrai gain de temps ! (c'est mon manager qui va être content).

## Quelques infos

MoreUnit est compatible avec Eclipse 3.5 (Galileo). Il fonctionne parfaitement avec un project Maven.

Le site : http://moreunit.sourceforge.net

L'update site : http://moreunit.sourceforge.net/org.moreunit.updatesite/

## Configuration

La configuration qui fonctionne pour un projet Maven et Junit est :

- Directory for test cases : src/test/java
- Test prefixes : `vide`
- Test suffixes : Test
- Enable flexible naming of tests : coché

![](/assets/images/posts/moreUnit_pref_maven.jpg)

Pour voir le marqueur sur les méthodes (caché par d'autres annotations Eclipse), il est intéressant d'activer le soulignement des méthodes ou :

- Préférences &gt; Editors &gt; Text Editors &gt; Annotations &gt; MoreUnit Marker &gt; Cocher "Test as Suiggly line"

![](/assets/images/posts/moreUnit_pref_annotations.jpg)

Il est possible de créer une nouvelle méthode de test en appuyant plusieurs fois sur ctrl+u depuis la méthode de test.

La vue qui montre les tests manquants fonctionnent partiellement donc je ne m'en sers pas.
