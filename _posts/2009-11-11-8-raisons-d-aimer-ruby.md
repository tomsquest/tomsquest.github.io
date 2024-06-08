---
title: "8 raisons d'aimer Ruby"
lang: fr
---

<img src="/assets/images/posts/ruby_logo.png" style="float:right"/>
Ruby est un langage qui évolue vite, qui monte fortement et qui est utilisé pour faire de vraies choses (même en prod !). Cet article contient 8 points qui font de Ruby un très bon langage et une plateforme de choix pour réaliser ses futurs projets.

## Plus productif

Martin Fowler a fait une synthèse de l’utilisation de Ruby chez ThoughtWorks.

La conclusion est une impression très forte d’une meilleure productivité. La majorité des projets ont ressenti un doublement de leur productivité (une impression car la productivité n’est pas mesurable).

Je vous encourage à lire l’article sur le site de Martin Fowler : "[Ruby at ThoughtWorks](http://martinfowler.com/articles/rubyAtThoughtWorks.html)"

## Meta-Programming

Le meta-programming c’est la génération de code par le code. Cela permet par exemple d’écrire des DSL et de simplifier son code. C’est aussi une arme puissante à utiliser modérément.

L’équivalent de la génération d’une méthode au Runtime en Java serait la possibilité d'écrire le code suivant :

```java
void genereUneMethode() {
    /* cette méthode sera ajouté à la classe appelante */
    void nouvelleMethode() {
        // Les commentaires de Chuck Norris sont compilés
    }
}
```

## Duck Typing

Le static typing s’oppose au duck typing. En Ruby, il n’y a pas de notion de type vérifié à la compilation.

Cela veut dire, qu’il est possible d’appeler une méthode avec un Array à la place d’une String. Tant que l’autre objet répond aux méthodes de l’objet attendu, le code est valide.

Le Duck Typing permet d’avoir du code beaucoup plus souple. La forte orientation vers les tests de Ruby en est la conséquence.

Il y a eu beaucoup de débats sur au sujet de « Static typing » contre « Duck typing ». Les auteurs de « Programming Ruby 1.9 » expliquent que le typage statique ne rend pas forcément un code plus fiable et peut diminuer la productivité. (Non, pas de Troll)

Plus d’info sur le [duck typing sur Wikipedia](http://en.wikipedia.org/wiki/Duck_typing).

## Closures

Les Closures ont fortement animé les débats autour de leur inclusion (ou pas) dans Java.

Elles font partie de la syntaxe de base de Ruby.

Les Closures sont des méthodes dont l’exécution peut être retardée tout en retenant le contexte quand elles ont été créées. Elles ont plein d’usages mais ne sont pas pourtant pas évidentes à appréhender.

## JRuby

[JRuby](http://jruby.org) est une implémentation de Ruby pour la JVM. Avantages : un super garbage collector (merci Java), des threads efficaces, multi-plateformes… Il fait tourner des projets Rails sans problème.

L’avantage est également de pouvoir faire du Ruby sur nos serveurs d’app Java, comme Glassfish 3 qui supporte JRuby.

## Frameworks novateurs

Rails, Capistrano ou encore Cucumber sont les fers de lance de Ruby et montrent ce que le langage permet de construire.

- [Rails](http://rubyonrails.org/) : c’est le Framework Web qui a donné de la visibilité à Ruby. Rails permet de produire des sites Web très rapidement et de manière simple
- [Capistrano](http://www.capify.org/) simplifie fortement le déploiement de projets Ruby et permet par exemple de se brancher sur un SVN pour faire de la mise en production en continue
- [Cucumber](http://cukes.info/) est un framework de BDD simple à prendre en main. Le Meta-Programming apporte beaucoup aux frameworks de tests en permettant l’écriture de DSL de tests

## GEM : le packaging facile

Les [GEM](http://www.rubyfrance.org/documentations/rubygem---introduction/) sont des archives de projet Ruby. Un peu comme nos JAR/WAR/EAR mais en mieux. Une Gem permet de packager son code, ses tests et ses scripts selon un format normé.

On installe une Gem en ligne de commande, idem pour la mettre à jour ou en rechercher d’autres.

Il est également très simple de pousser une Gem sur les repos (voir par exemple l’impressionnant de simplicité [Gemcutter](http://gemcutter.org/))

## Une communauté riche (et aussi en France)

Ruby bouge beaucoup et sa communauté est importante. Comme avec Java, il y a des sites de news, des podcasts, des screencasts...

- Des news : [RubyInside](http://www.rubyinside.com/), [About Ruby](http://ruby.about.com/)
- Des podcasts : [RailsEnvy](http://railsenvy.com/)
- Des screencasts : [Learnivore](http://www.learnivore.com)
- Des challenges de programmation : [RubyLearning ](http://rubylearning.com/blog/)

Les [Apéros Ruby](http://www.rubyfrance.org/) ressemblent à nos JUGs. Le prochain a lieu ce jeudi 12. Ils sont moins cadrés que les JUGs mais tout aussi intéressants : Coding Dojo, Lightning talk…

## Conclusion

Ruby dispose de nombreux atouts pour plaire, même face à ses concurrents dynamiques ou statiques (Scala par exemple).

Une des principales qualités de Ruby est sa communauté vivante et innovante. Découvrir une plateforme comme Ruby donne un nouvel élan et permet de faire fonctionner ses neurones sur d’autres paradigmes.

J’ai choisi Ruby pour toutes ces bonnes raisons et il y en a encore bien d’autres à découvrir.
