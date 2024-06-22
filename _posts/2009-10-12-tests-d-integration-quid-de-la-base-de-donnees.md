---
title: "Tests d'intégration : quid de la base de données ?"
lang: fr
image: /assets/images/posts/serveur.jpg
---

La base de données est un élément important des tests d'intégration. Les deux questions à se poser sont :
- Puis-je utiliser une base de données embarquée ?
- Puis-je désactiver les contraintes d'intégrité ?

## Base de données embarquée ou non ?

C'est Rod Johnson qui en parlait sur InfoQ : "[System Integration Testing using Spring](http://www.infoq.com/presentations/system-integration-testing-with-spring)" : une base de données embarquée est inutile dans la plupart des cas.

L'argument majeur en faveur d'une base embarquée est le travail en mode déconnecté. Dans une équipe disséminée (télétravail, multiples bureaux, déplacement fréquent), ce type de base fait l'affaire.

Mais il y a certains inconvénients importants :

- Moteur SQL différent de la cible : il est possible de certaines requêtes s'exécutent sur la base embarquée, mais pas sur le type de base utilisée en Prod (différences d'implémentation SQL par exemple, expérience vécue avec SQL Server) ;
- Debugage difficile : si la base meurt à la fin des tests, il devient difficile d'étudier les opérations faites et d'étudier pourquoi une requête ne fonctionne pas.

Je vois peu d'intérêt aujourd'hui à utiliser une base de données embarquées si c'est pour se rendre compte qu'on ne valide pas un comportement similaire à celui de production. Créer une base par développeur sur Oracle ou autre, n'est pas si difficile.

Un inconvénient d'une base standard est qu'elle nécessite d'être maintenue (passage des scripts), mais cela est automatisable grâce à des outils comme DBMaintain ou LiquiBase.

## Contraintes d'intégrité actives ou non ?

Filip Neven, le créateur d'Unitils et de DbMaintain, pointe le problème sur son blog (traduction libre) :

> Les gens pensent que la désactivation des contraintes produit une sérieuse dévaluation des tests, car le code qui a été validé avec succès par les tests unitaires pourrait ne pas fonctionner avec une base de données normales - [Filip Neven](http://filipneven.blogspot.com/2008/02/disable-constraints-on-your-test.html)
> La chose à retenir est : "il faut limiter au maximum les données de test".

Autrement dit : le moins de données de test, il y a, le plus maintenable sont les tests.

Filip Neven résume parfaitement la situation :

- Les tests doivent valider un fonctionnement et non vérifier l'intégrité de la base
- Les tests unitaires ne sont pas le bon outil pour découvrir des problèmes de contraintes
- Dans la plupart des cas, d'autres tests, comme les tests fonctionnels, permettront de découvrir les problèmes de contraintes
- Désactiver les contraintes est un gain de temps important pour l'écriture des tests

En effet, les jeux de données ne font généralement que croitre. Une fois qu'une donnée est ajoutée à un jeu de tests, il devient laborieux de savoir si cette donnée est utilisée d'une manière ou d'une autre et donc de la retirer.

En désactivant les contraintes d'intégrité, il devient possible que les jeux de données ne contiennent que les données utilisées dans les Where et dans les jointures ; c'est-à-dire les données **réellement utiles**. Cette façon de voir les choses simplifie énormément la maintenance des jeux de tests. Finis les fichiers DBUnit.xml qui contiennent 80% de données dues aux colonnes `not null` donc inutiles pour le test courant.

[Unitils/DbMaintain](http://www.unitils.org/tutorial.html#Automatic_test_database_maintenance) propose une méthode rapide pour désactiver ces contraintes (not null et foreign key).

## Une fausse sensation de sécurité

Il faut se poser la question : est-ce que l'on nuit à la qualité de nos tests si nous touchons à l'intégrité de la base de données par la désactivation des contraintes ?

En effet, si les tests passent sur une base qui sera identique à la production (colonnes non nulles, clés étrangères, utilisateur non privilégié), alors nous validons en totalité le fonctionnement cible. Au contraire, si nous avons désactivé les contraintes, alors nous risquons de rencontrer des erreurs plus tard dans la vie du projet, et donc que cela soit plus dur à corriger.

La réponse est double :

- Oui, nous nous écartons du fonctionnement cible (like "Prod") en modifiant le comportement de la base de données ;
- Non, cela ne nuit pas à la qualité des tests.

Pourquoi ?

Tester "comme en prod" donne un **faux sentiment de sécurité**. Les erreurs susceptibles de ne pas être détectée avant la production ne sont pas des problèmes récurrents. Ok, vous allez détecter qu'il manque un "GRANT select" mais cette erreur ne se reproduira pas.

D'autant plus que les tests d'intégration seront complétés par les tests fonctionnels et que détecteront les erreurs de not-null/foreign key laissées derrière.

## Conclusion

Je suis aujourd'hui pour une gestion "Agile" de la base de données utilisée pour les tests. La bonne voie est pour moi d'éviter l'usage d'une base embarquée car il y a trop de différences entre moteurs SQL, mais de désactiver certaines contraintes sur la base de test afin de faciliter le vrai travail : l'écriture de test qui valident les requêtes (le DML) et non les restrictions SQL (le DDL).

Et vous, avez-vous d'autres recommandations pour vos tests d'intégration ?
