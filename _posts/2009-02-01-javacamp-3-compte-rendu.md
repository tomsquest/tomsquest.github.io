---
title: "JavaCamp 3 : Compte-rendu"
lang: fr
image: /assets/images/posts/2009/02/parisjavacamp3.jpg
---

J'ai assisté hier au [JavaCamp n°3](http://barcamp.org/JavaCampParis3) organisé par Valtech chez Sun. Une quinzaine de personnes étaient présentes et les sessions se sont rapidement organisées. Un compte rendu rapide des sessions auxquelles j'ai participées.

## Le TEST

Sujet général où nous avons parlé outils et méthodes.

[Eric Lefevre](http://ericlefevre.net/wordpress/) explique que le test est avant tout une question de retour sur investissement (ROI). Le test pour le test n'est pas une finalité, il faut tester ce qui est important et ce qui apporte de la valeur.

![Mike Cohn](/assets/images/posts/2009/02/cohn.jpg)

Il dessine rapidement la pyramide de Mike Cohn appliqué aux tests que je ne connaissais pas.

Il y a quelques années la majorité des projets faisaient peu de tests unitaires, plus de tests fonctionnels et une majorité de tests graphiques (ah les fameux dossiers de recette). Aujourd'hui, la tendance est à un maximum de tests unitaires et à beaucoup de tests graphiques (Selenium, robots). Hors ce type de test est coûteux en temps et dans la majorité des cas, on peut se contenter de tester les services plutôt que la couche graphique.

Eric conseille de renverser la pyramide afin d'avoir beaucoup de tests unitaires, un peu moins de tests fonctionnels (que l'on pourrait appeler tests d'intégration) et le moins possible de tests graphiques, servant uniquement à valider que la couche graphique soit fonctionnelle.

Nous avons parlé d'autres outils que [FitNesse](http://fitnesse.org/) et [GreenPepper](http://www.greenpeppersoftware.com). Sébastien Letélié a repris la liste sur [son compte rendu du JavaCamp](http://www.itaware.eu/2009/01/31/javacamp-iii-tdd-et-ddd/).

## DDD, quoi, qu'est-ce ?

Cette session fut animée par Sébastien que je viens de citer. Je fais un rapide passage ici, car il en a parlé sur [son blog](http://www.itaware.eu/2008/08/24/programmation-orientee-composite/) et Xebia en a fait un [article dernièrement](http://blog.xebia.fr/2009/01/28/ddd-la-conception-qui-lie-le-fonctionnel-et-le-code/).

Sébastien nous explique qu'en [DDD](http://en.wikipedia.org/wiki/Domain-driven_design), on ne parle plus de classe mais d'interface. Comme exemple, il cite un politicien qui a plusieurs rôles (Speaker, Décideur, Escroc). Chacun de ses rôles étant représentés par une interface qui seront combinées en Mixin qui sont en quelque sorte des classes d'interface. On imagine déjà les avantages de séparer les responsabilités (testabilité) et le fait de pouvoir les combiner dynamiquement (réutilisabilité, évolutivité, souplesse).

## Scrum is Evil

Réuni pour parler de Scrum en général et notre façon de le pratiquer sur nos projets, on échange rapidement nos points de vue... différents. Eric est une nouvelle fois très à l'aise pour discuter du sujet (voir [son article sur le sujet](http://ericlefevre.net/wordpress/2008/10/07/scrum-is-evil/)).

Une discussion est lancée sur la question "est-il possible d'affecter certaines tâches d'une itération plutôt que laisser l'équipe les choisir".

Pour [Tarik Filali](http://www.insideit.fr), il est possible que le ScrumMaster affecte une tâche à quelqu'un qui pourra la mener à bien, selon la criticité de celle-ci.

Pour Eric, ce n'est pas conseillé. Cette action a un effet bénéfique à court terme (tâche bien réalisée et finie à temps) mais elle a un mauvais effet à long terme. En effet, que doivent penser les développeurs à qui on n'a pas osé confier cette tâche ? Quel est l'effet sur leur moral ?

Je vous passe les détails de la discussion que nous avons eue sur le fait de rester travailler tard le soir. Quel est l'effet sur le moral de l'équipe si le Scrum Master reste tard ? Ne doit-il pas montrer l'exemple en prouvant que les estimations ont bien été faites et que tout va bien ?

Sur la partie "Scrum is Evil", Eric nous rappelle que Scrum a des mauvais côtés, mais ce n'est pas la méthode elle-même, c'est sa popularité. Il rappelle le système de certification pyramidal et le fait de mettre en oeuvre les pratiques de Scrum sans penser aux valeurs qui doivent venir avec (collaboration, individus & intéractions, logiciel fonctionnel, adaptation).

Moralité : tous les mauvais côtés de Scrum se retrouvent dans les autres méthodes, donc Scrum est autant Evil que les autres :-) .

## Mock ou pas Mock

Eric, très en forme ce jour-là, nous parle de trois approches :
l'approche Mock où on utilise un framework de Mock (EasyMock, JmockIt...) afin de vérifier le comportement de la classe en cours de test ;
l'approche Stub où l'on va soi-même mettre en place des fausses classes pour comparer les entrées/sorties ;
l'approche "je ne teste pas les interactions mais uniquement la partie intéressante".

Cette 3ème approche mérite d'être détaillée.
Imaginez que vous vouliez tester la méthode suivante :

```java
public calculeLaMoyenneDesSalaires() {
    List employésSousPayés = chargeLaListeSilTePLait();
    Pour chaque employé {
        ajoute à la moyenne;
    }
    return laMoyenne;
}
```

Dans ce cas, on peut voir que ce qui est important dans la méthode, c'est le comment on calcule la moyenne, non pas le chargement de la liste des employés. La 3ème approche consisterait à revoir le code pour avoir une méthode qui calcule la moyenne à partir d'une liste d'employés :

```java
public calculeLaMoyenneDesSalaires() {
    List employésSousPayés = chargeLaListeSilTePLait();
    moyenne = calculeMoyenne(employésSousPayés);
    return laMoyenne;
}
/* package */ calculeMoyenne(List employés) {
    Pour chaque employé {
        ajoute à la moyenne;
    }
    return laMoyenne;
}
```

Dans cette approche, le test se passe sur la méthode `calculeMoyenne(List employés)` et non sur la méthode appelante. L'avantage est de se concentrer sur le code utile et non pas sur la glue (qu'il faudrait mocker). L'inconvénient principal est qu'il faudra des tests d'intégrations plus complets que dans une approche Mock ou Stub.

L'approche Mock consiste à vérifier les appels de méthode de la classe testée. Mais nous avons tendance à tester que tous les appels sont faits, dans l'ordre, avec tous les bons paramètres. Eric pense qu'il ne faut pas procéder ainsi. Il vaut mieux vérifier les appels qui nous intéressent vraiment. Par exemple, vérifier que la donnée est bien chargée et sauvegardée, mais ignorer la méthode fait un appel à une autre méthode en plus (approche `NiceMock` plutôt que `StrictMock` chez EasyMock).

L'approche Stub ne permet pas de contrôler tous les appels. On est donc plus libre dans les vérifications, mais moins sévère. Dans ce cas, on utilise souvent une méthode Bottom-Up, c'est-à-dire qu'on va plutôt partir des DAO et remonter vers les services. C'est l'inverse de la méthode Mock où il est possible (et conseillé) de partir des services et de mocker les classes du dessous en attendant une vraie implémentation ("Top-Down"). Cela se rapproche du TDD et influence beaucoup le design des couches basses.

Nous avons comparé rapidement les différents frameworks de Mock. EasyMock est le plus populaire, mais pourtant pas le meilleur. Il n'est pas facile d'accès et il contraint à définir le comportement avant l'appel à la méthode testée, ce qui rebute au début (on s'attendrait à tester après).

## Une bonne journée

Mon premier JavaCamp ne sera pas le dernier. Plein de gens intéressants et motivés avec leurs expériences, cela donne un bon moment. Pas forcément de venir un samedi, mais c'est tant mieux : seuls les gens motivés se déplacent 😊.

Merci à tous pour ce que j'ai appris ce jour-là et à [Valtech](http://valtech.fr) pour l'organisation.
