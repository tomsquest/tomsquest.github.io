---
title: 'Présentation du livre "The Mythical Man Month"'
lang: fr
image: /assets/images/posts/2008/10/the_mythical_man_month_cover.jpg
---

Le livre "The Mythical Man Month" figure dans le TOP 10 des livres à avoir lu. Revue du livre.

## Pourquoi lire ce livre ?

Premièrement, si vous ne connaissez pas ce livre, même de nom, vous connaissez peut-être la célèbre expression : "ajouter des hommes à un projet en retard, ne fait que le retarder encore plus". Cette idée a donné son titre à cet ouvrage. Et si cette expression ne vous a rien dit, peut-être que celle-ci vous parlera : "Malgré les nouveaux outils, il n'y a pas eu de gain significatif de productivité depuis les années 90" (chapitre "No silver bullet").

Ce livre a été écrit en 1975 par Frederick Brooks et réédité en 1995 pour son 20ème anniversaire. Il s'est vendu à 250.000 exemplaires, donc un beau succès. L'auteur a été chef de projet pour la plateforme IBM/360 puis pour l'OS/360. Il a l'expérience des équipes de taille importante au niveau organisationnel et gestion de projet.

Deuxièmement, si vous êtes passionné d'informatique et si vous voulez vous détacher un peu du code, je vous conseille de regarder autour de vous. Comment s'organise votre équipe ? Comment planifiez-vous vos développements ? Comment documentez-vous ? Comment réagit le management après un glissement du planning ? Que peut-on y faire ?

Troisièmement, restons plus terre à terre. C'est un livre en anglais, mais assez facile à lire. Si vous avez cherché des listes de lectures qui recommandent quels livres d'informatique lire, "The Mythical Man Month" figurera certainement en tête. Si vous regardez du côté d'[Amazon](http://www.amazon.com/Mythical-Man-Month-Software-Engineering-Anniversary/dp/0201835959), c'est 127 avis et quasiment 5 étoiles sur 5. Bien qu'écrit il y a des dizaines d'années, il est toujours d'actualité et plein de bon sens.

## Pourquoi ne pas lire ce livre ?

- Si vous cherchez de la technique, il n'y a pas un seul petit bout de code ;
- Si vous cherchez des recettes toutes faites pour améliorer la vie de votre équipe, il n'y en a pas. L'auteur pose les bases, il constate ce qui a fonctionné ou non selon son expérience, il conseille certaines manières de fonctionner et soumet quelques idées, mais ce n'est en rien un manuel détaillé ;
- Certains points sont discutables et d'autres vieillissants, notamment celui qui parle des optimisations et du partage des ressources entre équipes. C'était l'époque des gros systèmes où le temps machine était divisé entre les équipes. Mais cela ne concerne qu'une infime partie du livre, heureusement.

## Dois-je conseiller ce livre à mon chef de projet/manager ?

Oui, ce livre est intéressant pour les chefs de projet et les managers. Certains chapitres ont plus d'intérêts que d'autres. Parmi ceux-ci, les parties documentation, planification et communication fournissent des thèmes récurrents dans les projets. Cet ouvrage permet également d'ouvrir les yeux sur certains sujets. Par exemple :

- En cas de retard sur votre projet, est-ce qu'ajouter une personne me permettra de rattraper ce retard ;
- Est-ce que je gère un planning qui me permet de gérer les priorités en cas de retard ;
- Comment je gère ma documentation, comment je la maintiens et comment la partager entre ceux qui l'écrivent et ceux qui la lisent.

## Contenu

Ci-dessous, je vous liste certains chapitres qui m'ont le plus intéressé, je ne les ai pas tous listés.

### The Tar Pit (chap 1)

J'aime développer et si vous lisez ce blog, c'est certainement que vous aussi. Mais pourquoi aime-t-on ça ? On aime la programmation, car c'est un acte de construction et d'assemblage et parce que c'est souvent utile aux autres. Pourtant, le développement est une tâche difficile : les priorités sont fixées par d'autres, l'autorité (faire) diffère de la responsabilité (décider) et il n'y a pas de perfection possible.

### The Mythical Man Month (chap 2)

C'est la thèse la plus connue : ajouter des hommes à un projet en retard, ne le met que davantage en retard. Pourquoi ? Car il faut former les nouvelles personnes. Car la communication doit être encore plus large. Car la répartition du travail est plus dure. L'auteur explique également que le manque de temps est le premier facteur d'échec des projets. En effet, certaines tâches prennent du temps et les raccourcir se feront forcément au détriment d'autres tâches.

### The surgical team (chap 3)

Organiser son équipe comme dans un bloc opératoire : un chirurgien opère et les infirmières assistent. Est-ce que cela peut être appliqué à une équipe informatique ? L'idée est qu'il faut quelqu'un pour garder l'intégrité du projet et le reste pour suivre et l'aider dans ses tâches.
Je doute fortement que ce type d'organisation puisse fonctionner longtemps ; pour une raison simple : personne n'a envie d'avoir un rôle subalterne. Je n'imagine pas comment cela pourrait s'appliquer dans un projet informatique, car les rôles sont multiples et les tâches souvent transverses.

### Why did the tower of Babel fails (chap 7)

Le manque de communication est un risque majeur d'échec. Si cela se ressent déjà au sein d'une même équipe, cela est largement amplifié quand plusieurs équipes travaillent sur un même projet. Il faut donc des points de rencontre et d'échange pour permettre à l'information de passer. Comme outil, l'auteur propose d'utiliser un "workbook", un agrégat de toute la documentation du projet. Le workbook doit comprendre l'ensemble des documents, doit être accessible à tous les acteurs et les changements doivent être visibles pour permettre au système d'évoluer.

### Calling the Shot (chap 8)

L'estimation d'une tâche ne doit pas se faire uniquement sur la base du code à produire, car d'autres facteurs entrent en jeu. En effet, plus le programme est grand, plus le temps de développement s'allonge. Et un développeur ne passe au final que la moitié de son temps à coder, même si les langages de haut niveau permettent d'améliorer cela.

### The documentary hypothesis (chap 10)

Ecrire les spécifications force à prendre des centaines de micro-décisions qui permettent de préciser les choses telles qu'elles doivent l'être. Ne pas le faire garantit une mauvaise implémentation et laisse trop de liberté. La documentation doit bien sûr être maintenue, ce qui demande un effort supplémentaire.

### The whole and the parts (chap 13)

La plupart des problèmes viennent des choses qui n'ont jamais été réellement spécifiées. Cela rejoint le chapitre 10. L'approche Top/Bottom est recommandée par l'auteur, car elle permet de préciser les choses par couches, par itérations.

### Hatching a catastrophe (chap 14)

Comment un projet devient en retard ? Un jour à la fois. Comment savoir si on est en retard ? Il faut un planning avec des dates de fin estimées. Sans planning, les priorités ne sont pas fixées. L'auteur recommande de l'établir avec des étapes concrètes, spécifiques et mesurables. Celui-ci fournira un chemin critique permettant de savoir ce qui importe. La préparation du chemin critique est la principale raison de l'existence du planning, car elle permet de voir les dépendances, le réseau, l'estimation des étapes, et cela, très tôt dans le projet. L'auteur insiste également sur les revues techniques qui donnent un statut réel, connu de tous. Cette étape ferait partie du planning et pourrait être documentée.

### No Silver Bullet - Essence and accident (chap 16)

Fred Brooks avait prédit en 1986 qu'il n'y aurait pas de gain important de productivité pendant les 10 prochaines années. Il a apparemment eu raison (moi, je n'y étais pas 😜). Ce chapitre intègre les notions d'[accident](http://en.wikipedia.org/wiki/Accidental_complexity) et d'[essence](http://en.wikipedia.org/wiki/Essential_complexity) (difficile d'expliquer donc je renvoie vers Wikipédia).

## Note finale

J'ai apprécié ce livre, car il offre une vision de la gestion de projet basée sur l'expérience, écrite par une personne reconnue dans son domaine. Certains chapitres m'ont plus marqués que d'autres, mais je garde un trés bon souvenir de l'ensemble. Il est également appréciable de voir l'auteur publier les critiques faites sur certaines de ses idées et en disant "oui, j'avais tort sur...".

Si je devais faire une autre critique sur ce livre, je dirais que sa présentation n'est peut-être pas assez "fun" et qu'il manque de pratique, d'une vision au jour le jour. C'est une vision large, mais d'un peu plus haut que je l'aurai souhaité.
