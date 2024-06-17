---
title: "Gradle : vos builds aux petits oignons"
lang: fr
image: /assets/images/posts/gradle.jpg
---

[Gradle](http://www.gradle.org/) est un outil permettant d'écrire ses scripts de build en groovy.
Il nous a été présenté hier soir chez [Zenika](http://www.zenika.com/) par son créateur, Hans Dockter.

A première vue, c'est un outil puissant et extrêmement souple. Il apporte beaucoup de bonnes idées et on s'amuse vite à le comparer à Maven.

Alors, Gradle pour tous ou seulement pour votre pire ennemi ?

## Donner du sens à vos builds

Gradle, c'est avant tout un DSL en Groovy pour décrire ses builds. Il bénéficie donc des améliorations du langage comme les closures et d'une syntaxe épurée.

Hans Docker insiste sur ce point : un script de build qui épouse votre projet est beaucoup plus intéressant qu'un projet où la structure est imposée par l'outil de build (comme Maven).

Il fait un parallèle avec "l'[Anemic Object Model](http://martinfowler.com/bliki/AnemicDomainModel.html)" de Martin Fowler et le DDD dans le sens où votre build se décrit lui-même et ses buts se documentent eux-mêmes.

Gradle propose donc de donner du sens à nos builds en permettant d'améliorer la compréhension du système et des tâches réalisées.

Hans oppose les notions de "Langage de build" (Gradle) et de "framework de build" (Maven). L'un offre la flexibilité, l'autre pose un cadre défini.

## Attention, outil coupant

Vous avez déjà eu des projets complexes à construire, avec par exemple de la génération de code ou des fichiers à emboiter. Vous vous êtes battu avec Maven et vous avez souvent perdu (c'est mon cas, je n'ai pas encore ma ceinture noire de Maven).

Gradle vient directement répondre à ce besoin : simplifier les builds complexes.
C'est d'ailleurs son moto : "Make the impossible possible, the possible easy, and the easy elegant".

Discussion faite avec Florent Ramière de Jaxio, nous sommes du même avis : Oui, Gradle est adapté pour les builds complexes mais 80% ont des besoins simples, réalisables avec Maven.

Gradle est un outil puissant qui permet de faire précisément ce que vous voulez.
Cette flexibilité extrême permet aussi de faire n'importe quoi, y compris se tirer une balle dans le pied.
Maven a pris beaucoup d'ampleur en proposant des conventions et une structure commune (par exemple, les phases et les packages).

Franchement, c'est un bonheur de s'y retrouver entre différents projets. Malheureusement, ces conventions ne peuvent pas se conformer à tous les projets.

## Un peu jeune

Gradle est "production ready" comme le dit Hans. Il est utilisé par certains gros projets aux besoins complexes.
Pourtant, il est encore en fort développement, signe de bonne santé, mais aussi manque de maturité. Le projet n'a pas encore un an.

Il lui manque un certain nombre de fonctionnalités avant de devenir réellement complet, par exemple le support d'autres langages que Java ou encore celui de Netbeans (mais "Why bother ?" comme dirait Antonio Goncalves).

Bref, il y a du travail et ce n'est pas la crise comme l'indique la [Roadmap](http://docs.codehaus.org/display/GRADLE/Roadmap).

## Mon avis

J'aime :

- L'usage d'un DSL pour donner du sens à ses scripts de build ;
- La puissante de ce DSL pour faire des choses qui font rêver (par exemple, une tâche à accès à la liste des tâches suivantes afin de pouvoir modifier son comportement) ;
- La réutilisation des tâches Ant facilement, ce qui veut dire qu'on peut presque tout faire ;
- La flexibilité offerte. J'adore les outils coupants qui me permettent de faire ce que je veux comme je le veux. Mais je reconnais que je n'ai pas rencontré souvent de besoin très exotique ;
- Le Gradle Wrapper qui permet de dérouler un build Gradle sans aucune installation préalable (il télécharge ses dépendances automatiquement).

Je n'aime pas :

- Le fait de ne pas avoir une intégration/réutilisabilité complète avec Maven (la faute aux Plugins apparemment) ;
- Le trop peu de convention, même si c'est le but du projet, car les conventions permettent d'entrer dans l'entreprise pour éviter que chacun puisse faire ce qu'il veut. Adieu structuration et normalisation entre projets. Mais rien ne dit qu'on ne puisse pas poser une structure à respecter. Ce serait l'équivalent des normes de codages ;
- Il n'est pas à mettre entre toutes les mains. Gros risques de faire dans le non maintenable (quid du debugging, du diagnostique, des performances ?)
- La jeunesse du projet qui ne garantit pas encore une pérennité suffisante pour l'entreprise.

## Pour allez plus loin

Zenika a publié des articles à propose de Gradle ainsi que deux podcasts. Le deuxième podcast couvre bien les avantages et inconvénients de Gradle :

- Les [articles](http://blog.zenika.com/index.php?tag/gradle) ;
- Les [podcasts](http://blog.zenika.com/index.php?post/2009/05/29/Podcast-Gradle).

Nicolas Martignole du Touilleur Express a fait un [compte rendu de la présentation](http://www.touilleur-express.fr/2009/06/23/jazoon-gradle-la-presentation-qui-aura-lieu-jeudi-soir/) faite à Jazoon. Les commentaires sont également intéressants. J'aime beaucoup le "Gradle as the assembly language for builds" de Vincent Massol.
