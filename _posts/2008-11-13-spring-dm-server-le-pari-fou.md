---
title: Spring DM Server, le pari fou ?
lang: fr
image: /assets/images/posts/2008/11/springsource_logo.png
---

Après les Rencontres Spring qui ont eu lieu aujourd'hui, nous avons eu le droit à quelques éléments de réponses à la question suivante :

Comment SpringSource va tenter de convaincre la Prod de l'intérêt de son serveur d'application, [Spring DM Server](http://www.springsource.com/products/suite/dmserver) ?

## Réponses

- Par son coût : l'achat du serveur donne droit à du support qui est mutualisé entre la production et les équipes de développement ;
- Par son outillage :
  - Console de monitoring du serveur et des applications Spring déployées,
  - Rechargement à chaud (OSGI est passé par là),
  - Partenariat avec Terracotta : garantir le fonctionnement du serveur avec ce produit, offir du support et de la formation,
- En certifiant son serveur d'application comme pouvant faire fonctionner les applications Spring d'ancienne génération (1.x par exemple). Encore merci à OSGI et ses classloaders ;-) ;
- En vendant des "Perf Packs" pour certains backends. Ainsi le "Perf Packs" Oracle permettra par exemple de réaliser du fail-over de connexion en gardant le contexte transactionnel.

Une phrase de Julien Dubois qui résume bien ce positionnement :

> SpringSource gèrera à la fois le développement et le déploiement

Peter Cooper-Elis, en charge de la gamme des produits SpringSource, a également distinctement montré l'implication de la société dans la partie "Deploy". La société n'est plus qu'un framework, mais propose un vrai triplet : développement, déploiement et support.

La roadmap de Spring DM est :

- v1.2 pour le 1er trimestre 2009
- v2.0 pour le 2ème trimestre 2009

## Pour ma part

Pour ma part, j'ai encore un peu de mal à croire à Spring DM Server. Certes un nouveau serveur d'application qui serait enfin "à la mode", qui serait compatible de facto avec les frameworks que j'utilise pour développer et avec qui viendrait du support pour l'équipe de prod et mon équipe de dév... Là, **oui**, je signe.

Mais je pense que convaincre le management passera essentiellement par la "voix du chéquier". Il ne devrait pas y avoir de coût par CPU (une rente pour le fournisseur) mais un coût uniquement de Support. Donc si SpringSource se bat sur les prix, je pense que là, ils ont une chance. Je ne doute pas que ça marchera chez certains. Maic combien de temps cela mettra-t-il ?

## Plus d'info

- sur les Rencontres Spring, sur le blog du [Touilleur Express](http://www.touilleur-express.fr/2008/11/13/compte-rendu-des-rencontres-spring-2008/)
- sur Spring DM Server sur le blog d'Olivier, [The Coder's Breakfast](http://olivier.croisier.free.fr/blog/index.php?2008/11/13/119-opensource-exchange-compte-rendu)
