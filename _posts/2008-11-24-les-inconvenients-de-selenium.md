---
title: "Les inconvénients de Selenium"
slug: les-inconvenients-de-selenium
lang: fr
---

<img src="/assets/images/posts/2008/09/selenium_small.jpg" style="float:right"/>

Selenium est un très bon projet de test fonctionnel Web qui souffre de certains défauts.
Il a énormément de qualité mais tout n'est pourtant pas rose.
Je liste ses limitations et ses disfonctionnements afin que vous puissiez mieux le cerner.
A lire pour ceux qui veulent découvrir l'envers du décor.

## Selenium IDE

C'est l'outil de base que l'on découvre en premier grâce au plugin Firefox.

Quelques points à connaître :

- Les tests enregistrés dans un langage autre que le HTML ne peuvent être relus par l'IDE. L'IDE ne sait que générer dans un autre langage et ne sait pas faire l'inverse ;
- Impossible de factoriser du code en créant une méthode dans un test et en la réutilisant. A la rigueur, il est possible d'avoir des variables globales mais c'est tout. Par exemple, il est impossible de créer d'une méthode « login » qui permettrait de ne pas dupliquer le code de connexion dans chaque test (ouvrir la page, saisir le login, appuyer sur ok, vérifier que la connexion est ok) ;
- Il est assez buggé :
  - Le copier/coller qui fonctionne mal de temps en temps,
  - L'enregistrement qui plante de temps en temps, obligeant à fermer le navigateur ;
- La dernière version est en bêta depuis plusieurs mois, pourtant elle est obligatoire pour Firefox 3.

## Selenium RC

L'[intégration avec Maven2](http://www.tomsquest.com/blog/2008/09/selenium-en-java-demarrage-rapide/) n'est pas aisée. Avec quelques efforts et un peu de temps, on arrive à quelque chose de fonctionnel. Mais quelques bugs aléatoires surviennent/ IE refuse de s'ouvrir et des timeouts se produisent sans cause avérée.

L'intégration à [Hudson](https://hudson.dev.java.net/) a été également difficile. Mais comme pour Maven2, cela fonctionne avec un peu de travail. Il nous a fallu par exemple régler les paramètres de sécurité des droits de l'utilisateur utilisé sur l'intégration continue. De plus, à cause des bugs cités plus haut, il nous arrive régulièrement d'avoir des builds en erreur, chose relativement gênante.

## Faiblesses générales

Ce qu'il manque pour avoir un outil meilleur :

- Une gestion du l'upload et du download sans utiliser de gros hacks ;
- Une gestion simple des données de test séparées des tests eux-mêmes. C'est-à-dire pourvoir jouer plusieurs fois un test avec des donnés différentes. Des projets comme [Tellurium](http://www.tomsquest.com/blog/2008/10/selenium-boostez-vos-tests-avec-tellurium/) sont peut-être la solution ;
- Une meilleure performance. Au delà d'un certain nombre de tests, les temps de retour sont longs, trés longs. Il devient presque impossible de tous les passer depuis un poste de dév et d'avoir un retour en quelques minutes. D'où la mise en place de l'intégration continue. Sur le point des performances, il faudrait regarder du côté de [Selenium Grid](http://selenium-grid.seleniumhq.org/) qui permet de paralléliser les tests ;
- Une intégration à Internet Explorer pour utiliser Selenium IDE avec ce navigateur (si c'est le navigateur choisi comme cible par votre client par exemple).

Dit, Papa Noël, tu me fais un meilleur Selenium ?
