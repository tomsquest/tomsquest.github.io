--- 
title: "Présentation et retour sur GreenPepper"
slug: presentation-et-retour-sur-greenpepper
date: 2008-12-21T00:00:00Z
---

<img src="/assets/images/posts/2008/12/greenpepper-logo.png" style="float:right"/>

Au boulot, nous évaluons [GreenPepper](http://www.greenpeppersoftware.com) de la société [Pyxis](http://www.pyxis-tech.com/fr/). GreenPepper est un outil de test fonctionnel et nous souhaitons à terme que les MOA l'utilisent afin de rédiger les spécifications et les tests associés.

Nous ne sommes qu'en phase de POC technique et nous avons rencontré quelques soucis. Je vous fais mon retour au bout d'une semaine avec GreenPepper.

## Spécification exécutable

La base de GreenPepper est le concept de spécification exécutable. Une spec est dite exécutable quand elle fournit directement les cas de tests qui permettent de la valider et que ceux-ci sont exécutables afin de déterminer si les règles sont bien implémentées. Le site du projet héberge une [vidéo de présentation](http://www.greenpeppersoftware.com/greenpepper-whatsin-videos/whatis-es/index.html).

Dans la pratique, la création d'une spécification exécutable avec GreenPepper prend la forme suivante :

* La MOA se connecte au Wiki et exprime sa règle métier en bon français ;
* Elle décrit également comment tester la fonctionnalité. La syntaxe se fait à base de tableaux qui permettent au système d'extraire les méthodes et données de test à utiliser ;
* L'équipe de développement écrit ensuite le liant entre la page de test et le code réel. Ce branchement est appelé « fixture ».

### Exemple de spécification fonctionnelle

![](/assets/images/posts/2008/12/gp-test2.jpg)

Chaque page GreenPepper dispose d'un bouton « Execute » qui permet d'appeler les fixtures avec les paramètres du tableau. L'appui sur ce bouton invoque le système testé qui récupère dans la page les classes à créer et invoque les méthodes avec les données.

Dans l'exemple ci-dessus, GreenPepper instancie la classe Cart et invoque deux fois la méthode « add » avec en paramètre « Persian Cat » puis « Dalmation » et enfin invoque la méthode numberOfItems. Celle-ci doit retourner 2. Si ce n'est pas le cas, la case du tableau sera coloriée en rouge ou en vert si le résultat est valide.

## Le coin de la technique

<img src="/assets/images/posts/2008/12/logo-confluence.gif" style="float:right"/>

GreenPepper est en réalité un plugin pour [Confluence](http://www.atlassian.com/software/confluence/), le wiki édité par Atlassian.

C'est LA différence avec [FitNesse](http://fitnesse.org/), un autre outil très populaire de test fonctionnel. FitNesse embarque son propre serveur Web et son propre Wiki. Chez Pyxis, il a été décidé de s'appuyer sur un outil existant, réputé et fiable.

GreenPepper se contente donc de rentre les pages du Wiki Confluence testables en leur ajoutant des macros et le fameux bouton « Execute » vu plus haut.

## Qualités de GreenPepper

GreenPepper, c'est avant tout Confluence. Ce dernier apporte une plateforme puissante permettant à tous les acteurs de communiquer autour du logiciel. C'est un wiki donc il apporte des notions de collaboration, de versionning et de partage.

GreenPepper s'intègre également avec Jira, un autre produit Atlassian permettant de faire du bug tracking. On peut donc imaginer avoir un rapport de bug lié à une page de spécification qui contient le test permettant de reproduire le bug.

L'écriture des fixtures peut se faire en Java et en .Net. Une fixture est une simple classe et GreenPepper ne pose aucune contrainte à ce niveau. Le produit propose aussi de créer un SUD (System Under Developement) permettant de réaliser des actions quand une fixture est instanciée/libérée (sorte de « setUp/tearDown »), d'enregistrer des convertisseurs (par exemple, convertir un numéro de client en Client) et d'importer des packages de fixture par défaut. Dans notre SUD actuel, nous démarrons également le contexte Spring afin d'injecter les beans dans les fixtures.

## Problèmes rencontrés

Nous avons rencontré plusieurs problèmes avec GreenPepper. Nous étions très confiants pour un produit « packagé » comme GreenPepper, mais la machine fut difficile à démarrer.

### La documentation

Le plus gros point noir du produit est sa documentation. Elle forme un patchwork difficile à ingérer. On trouve des exemples mais pas toujours le code associé. Certaines fixtures sont détaillées, mais je n'ai pas trouvé les exemples simples ni percutants.

La courbe d'apprentissage n'est donc pas basse. C'est laborieux. La documentation est difficilement compréhensible à la première lecture, voir à la deuxième. Après quelques jours, je commence enfin à en comprendre certaines sections.

Un exemple vécu lors de l'installation : le « step by step » est simple à suivre mais rien ne fonctionnait à la fin. Nous avons du désinstaller le plugin GreenPepper et le réinstaller différemment de ce qui est précisé dans la documentation. Pour cela, il a fallu chercher dans les forums afin de voir qu'il était conseillé d'installer le plugin directement dans WEB-INF/lib (plutôt que par l'installateur Confluence comme indiqué dans la doc).

### Le plugin Eclipse

Le plugin permet de rapatrier les pages de tests et de les exécuter localement. Il offre la possibilité de générer le squelette des fixtures à partir des pages.

Beaucoup d'options sont proposées et on a du mal à savoir quoi mettre. Il faut un répertoire de spécs que je n'ai pas. Un SUT ? Non, je n'en ai pas (encore). Et le classpath, j'ai celui d'Eclipse, pourquoi j'en utiliserai un autre ?

Au bout de quelques heures, ça fonctionne à peu près. Entre temps, on a essayé toutes les options dans tous les sens. C'est rigolo 5 minutes.

A titre d'info, voilà la procédure :

* Ecrire sa page dans Confluence et la marquer comme « Implemented » ;
* Rafraichir la vue « Repository » dans Eclipse : la page apparaît ;
* Executer une première fois la page depuis le menu de cette vue ;
* Ouvrir avec le WebBrowser d'Eclipse le HTML de la page crée plus haut (répertoire /greenpepper) ;
* Executer la page une deuxième fois mais depuis le menu Run d'Eclipse ;
* La page doit enfin montrer les résultats (du jaune si les fixtures n'exisente pas) ;

### Autres points :

* Le plugin Eclipse n'est pas stable. La vue se freeze de temps en temps ;
* Il est en version bêta depuis un moment ;
* Eclipse 3.4 n'est pas supporté mais il s'est installé sans soucis.

### Capture du lancement depuis Eclipse

![](/assets/images/posts/2008/12/gp-runeclipse.jpg)

### Le classpath et Maven
Je n'ai pas mis en place cette partie là sur notre projet actuel donc j'ai peu à en dire. Ah si, une chose : beaucoup de sueur.

Le plugin Maven permet de construire le classpath contenant l'ensemble des dépendances pour permettre à GreenPepper d'appeler les fixtures qui utilisent les classes de votre projet.

Comme pour le plugin Eclipse, il a fallu batailler pour comprendre la doc, savoir quels paramètres saisir et comment configurer le SUT dans le plugin GreenPepper de Confluence (ne cherchez pas de définition de SUT dans la doc, il n'y en a pas).

Et quand ça ne fonctionne pas, il est difficile de trouver les erreurs et les exceptions remontées.

## Quelques conseils autour de GreenPepper

Eric Pantera, d'[Octo Technology](http://www.octo.com/), est venu nous faire un retour sur GreenPepper. Il l'utilise depuis 10 mois chez un de ses clients.

Comme nous, l'équipe a eu beaucoup de mal à mettre en place l'outil. Mais dès les premières itérations, ils ont commencé à sentir d'énormes gains : leur communication s'est largement améliorée, tous les acteurs y voient plus clair, les MOA produisent les tests permettant d'éprouver le système et le logiciel est au final beaucoup plus fiable.

Pour accélérer la mise en place de GreenPepper, Eric nous a conseillé de :

* Soigner la HomePage. Au début du projet, il faut donner envie. La MOA va devoir se former à un nouvel outil et un Wiki est toujours un peu complexe. Il faut lutter contre la résistance au changement et montrer les avantages de cette solution ;
* Laisser libre la MOA pour les premières pages, puis repasser derrière et compléter les tests avec les noms des fixtures, par exemple. La MOA voit ensuite les modifications et utilisent celles-ci pour les tests suivants. Il faut donc éviter un maximum de restreindre la MOA à ses débuts.
* Regarder les plugins Confluence. Certains sont très utiles comme le plugin Office permettant d'éditer ses pages depuis Word ;

## Conclusion

Pour résumer, GreenPepper est un produit très intéressant, mais qui souffre d'une documentation défaillante. Il offre de nombreux avantages comme l'intégration à Confluence, le plugin Eclipse et le support de Maven. La mise en place est déroutante car elle est laborieuse.

D'autre part, le produit évolue lentement. Les pages de documentation datent pour une bonne partie de 2007 et la dernière news du site concernant GreenPepper date de janvier 2008.

Une question reste : est-ce que son concurrent direct, [FitNesse](http://fitnesse.org/), fait mieux ?
