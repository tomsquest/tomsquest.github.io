---
title: "Rencontre avec Jérôme Louvel, auteur de Restlet"
lang: fr
image: /assets/images/posts/2008-11-11-rencontre-avec-jerome-louvel-auteur-de-restlet/restlet-logo.gif
---

Suite au dernier JUG, Jérôme Louvel, l'auteur de Restlet, a bien voulu répondre à mes questions. Les sujets incluent les apports de REST, à qui il est destiné, JAX-RS et l'intégration à un existant.

## Interview

#### Tout d'abord, Jérôme, pourquoi tant d'intérêt dans REST ?

À la base, j'ai une véritable passion pour le Web, son architecture, ses protocoles, le W3C. Je suis admiratif de la vision des fondateurs dont Tim Berners-Lee et Roy T. Fielding.

Ensuite, pour le besoin d'un projet interne, j'ai voulu exploiter au mieux les standards du Web. Je n'avais aucune contrainte technique, juste d'utiliser Java. REST m'avait marqué et je me suis dit qu'il était possible d'en appliquer les concepts plus concrètement en Java qu'à travers l'API Servlet et les multiples frameworks MVC. Restlet était né! :)

#### Dans quels buts as-tu fondé la société Noelios Technologies ?

![Noelios Technologies](/assets/images/posts/2008-11-11-rencontre-avec-jerome-louvel-auteur-de-restlet/noelios-logo.jpg)

[Noelios Technologies](http://www.noelios.com/) a été créé pour accompagner nos clients dans la réalisation de leurs idées Web, au sens large. Nous apportons bien sûr notre expertise autour de REST et de Restlet avec différentes sortes de prestations, du support technique au développement spécifique en passant par la vente de licences commerciales au cas où la LGPL pose un problème.

Nos clients sont de taille très variable, de la start-up parisienne RunMyProcess pour du conseil et du support, à l'éditeur de logiciel américain Rapt (racheté par Microsoft) pour une licence commerciale en passant par de l'assistance en architecture pour Mikros Image, leader dans la post-production en Europe, dans le cadre d'un projet de R&D du pôle de compétitivité Cap Digital.

L'essentiel de nos clients possède une forte dimension technologique, édition logicielle, conseil en systèmes d'information ou activité R&D logicielle significative. Au vu de la vitesse de diffusion de REST, je pense que nous allons pouvoir servir prochainement des clients dans d'autres secteurs d'activité ou avec des profils moins techniques.

#### Qui a besoin de faire du REST ?

Je dirais que l'on peut appliquer REST à toute application Web, du simple site Web au service Web en passant par un client Web et une combinaison des trois. Une application Restlet peut en effet être les trois à la fois, de façon unifiée, c'est notre gros point fort. Avec Restlet, on peut dire stop à la multiplication des APIs, des frameworks et les soucis d'intégration.

Un exemple classique est l'exposition d'une API REST au-dessus d'un système d'information existant. Concevoir correctement cette API n'est pas trivial, il faut comprendre la conception orientée-ressource. Nous proposons une méthodologie maison baptisée ROA/D (Resource-Oriented Analysis & Design) dans la ligne droite d'OOA/D, mais adaptée à REST.

#### Quels sont les avantages de REST et ses inconvénients (il doit bien en exister ;-) ) ?

Les avantages de REST sont nombreux, mais le premier de la capacité à s'intégrer proprement au Web et à tirer la meilleure partie des fonctionnalités des standards comme HTTP.

> REST tire parti des standards comme HTTP

L'inconvénient vient du fait qu'il faut accepter un changement de paradigme, l'orienté-objet s'applique mal au Web. Il faut changer de perspective, passer de l'objet distribué aux notions de ressource, de représentation et d'hypermedia promus par REST. Cela requiert une remise en question assez profonde et une formation à de nouvelles façons de modéliser, à de nouveaux outils.

#### Est-ce que c'est un moyen de faire de l'architecture orientée service (SOA) ?

Faire du SOA avec REST, c'est un grand débat... SOA a été tellement associé à SOAP qu'il est difficile de faire la part des choses. Je préfère parler d'architecture orientée Web (WOA = REST appliqué à HTTP, URI, XML, JSON, etc.) que certains positionnent comme un sous-ensemble de SOA.

Ce qui est certain, c'est que le Web exerce désormais une telle force d'attraction sur les systèmes d'information des entreprises, qu'il est indispensable de savoir s'y intégrer. Le Web est le nouveau centre de gravité, donc autant s'appuyer sur son style architecture (REST) pour cela. REST est également adapté aux architectures distribuées à l'intérieur d'une organisation. En fait, il est adapté dès que l'on souhaite distribuer, découpler des clients et des serveurs sur un réseau.

#### Restlet, a-t-il des concurrents ?

Restlet était le premier framework REST pour Java, et probablement même tous langages confondus. Evidemment, le succès de REST a entraîné l'apparition d'alternatives, dans les autres langages (RoR pour Ruby, Django pour Python pour exemple). Ensuite, on peut comparer chaque solution, notamment par rapport à sa couverture des fonctionnalités de HTTP ou à son support direct des concepts de REST.

> Restlet a une sacrée longueur d'avance sur ses concurrents (voir [http://www.restlet.org/about/features](http://www.restlet.org/about/features)), tout en ayant réussi à conserver sa simplicité d'usage, à travers son API Restlet unifiée.

#### Tu as parlé de JAX-RS et tu es membre Expert de la JSR. Qu'apporte JAX-RS à REST ?

[JAX-RS](http://jcp.org/en/jsr/detail?id=311) est une API standardisée par le JCP, issue d'un prototype de Sun visant à utiliser les annotations Java pour exposer des services Web de façon RESTful. Nous leur avons apporté notre expérience dans le cadre du groupe d'experts et nous implémentons cette API dans la dernière version 1.1 de Restlet.

L'approche orientée-annotation n'est qu'une des approches possibles pour proposer un framework REST en Java. Avec notre API Restlet "originale", nous avons préféré une approche classique orientée-classe, plus extensible et puissante à notre avis. Après, il y a aussi une question de style et de goût.

En tout cas, avec le projet Restlet, vous avez accès à ces deux approches qui peuvent même être combinées si besoin.

#### Puis-je réutiliser mon modéle de domaine en tant qu'objets REST ?

Le modèle de votre domaine reste la base d'une bonne conception REST. Cela dit, il est indispensable de dériver ce modèle métier de haut niveau en un modèle orienté-ressources (ie. une API REST). C'est tout le rôle de notre méthodologie ROA/D que nous couvrons dans notre prochain livre (<http://book.restlet.org>).

> Au-delà de l'implémentation de votre API REST métier dans un framework ou un autre, l'avantage est que cette API métier est réellement interopérable, quel que soit le langage ou le type de client. Après, tout est question de productivité et de qualité de conception.

Annoter des POJOs métier pour en exposer une API REST est une vue de l'esprit. En pratique, la granularité entre ressources REST et objets métier n'est pas la même. Donc, on finit toujours par créer des classes Java pour chaque ressource. Que ces classes héritent d'une classe de base (org.restlet.resource.Resource en Restlet) ne pose aucun problème. Au contraire, cela impose la définition d'un vrai modèle de ressources.

#### Si je veux faire du REST sur mon projet, est-ce qu'il me faut un serveur REST à côté de mon serveur d'application ?

Avec Restlet, vous avez toutes les options possibles. Faire tout en Restlet (qui devient votre serveur d'application), déployer votre application Restlet dans un conteneur de Servlet classique ou dans d'autres conteneurs (autonome/pure JVM, Spring, OSGi, Mule, etc.).

#### Quels sont les impacts pour les équipes de production pour que mon application puisse offrir des services REST ?

Pas d'impact particulier, une application Restlet peut tourner dans Tomcat ou similaire si besoin. Mais en Restlet d'autres options de déploiement sont possibles. Une étude d'architecture peut être nécessaire pour faire le bon choix.

#### Tu as également parlé de WADL, la javadoc du REST. À quoi cela sert-il ? Peux-tu donner un exemple ?

Le plus simple, c'est de voir un exemple: <http://www.mnot.net/webdesc/>. Vous verrez sur cette page le service de recherche REST de Yahoo! décrit en WADL/XML et en HTML. Avec Restlet pour pouvoir obtenir exactement ce format de sortie, nous embarquons la feuille de style de Yahoo! pour le rendu HTML.

#### Tu m'as convaincu, demain, je veux faire du REST sur mon application, par où dois-je commencer ?

![Couverture Oreilly Restful Web Services](/assets/images/posts/2008-11-11-rencontre-avec-jerome-louvel-auteur-de-restlet/oreilly-book-restful-web-services.jpg)

La bible REST est le livre chez O'Reilly, auquel nous avons d'ailleurs contribué une partie sur Restlet ([voir les livres](http://www.restlet.org/documentation/books)).

#### Merci

Merci beaucoup à Jérôme d'avoir répondu avec simplicité à ces questions. Vous pouvez retrouver l'actualité de Restlet sur le [blog de Noelios](http://blog.noelios.com) et sur le site <http://www.Restlet.org>.
