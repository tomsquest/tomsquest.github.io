---
title: Les limites de Wicket
slug: les-limites-de-wicket
date: 2009-05-03T00:00:00Z
---

<img src="/assets/images/posts/wicket_logo.png" style="float:right"/>

Connaître un framework, c'est aussi reconnaître ses limites et ses points faibles. Pour [Wicket](http://wicketframework.org/), il m'a fallu creuser profondément. J'ai interrogé les pros de Wicket présent à cette soirée, Carl Azoury, un des boss de Zenika et Martin Dashort, committer Wicket.

Quelles sont les limites de Wicket ? Quelles sont leurs solutions ?

**Mise à jour le 02/06/2010 :** [une discussion intéressante sur les limites de Wicket](http://www.developpez.net/forums/d908584/java/developpement-web-java/frameworks/wicket/limites-wicket-commentaire-texte/) a eu lieu sur les forums developpez.com. Il y a des arguments intéressants et des retours d'expérience.

## Un mot sur la conférence Wicket/Zenika

<img src="/assets/images/posts/zenika_logo.gif" style="float:right"/>

L'invité de la soirée [Zenika](http://www.zenika.com/) du 29 avril était [Martin Dashorst](http://wicketinaction.com/), un des committers principaux de Wicket et coauteur du livre « Wicket In Action », dont vous trouverez [la critique ici-même](http://www.tomsquest.com/blog/2008/12/critique-du-livre-wicket-in-action/).

Martin a réalisé une introduction d'une heure à Wicket en montrant ses principaux avantages et les façons de faire les choses. La présentation a été convaincante mais j'aurai aimé plus de détails et d'exemples sur le futur de Wicket.

La soirée a encore été une nouvelle belle réussite pour Zenika, après les très bonnes sessions Terracotta et Lean.

## Le markup n'est pas toujours prévisualisable

Quand votre application commence à être découpée en composants (et c'est le but final de Wicket), le markup HTML est lui aussi scindé en différents fichiers. Adieu pré-visualisation, le Designer peut recommencer à s'arracher les cheveux comme avec ces bonnes vieilles JSP.

Un designer intervient principalement au début du projet. C'est donc à ce moment-là que la pré-visualisation est importante. Wicket n'est pas un frein dans cette situation, car il offre trois choix pour gérer son markup. Quand le nombre de pages est inférieur à dix, les auteurs conseillent tout simplement de dupliquer le code dans toutes les pages (hé oui, pour moins de 10 pages, le R.O.I. nous dit : « fais-le avec tes mains »). Au-delà, Wicket propose d'utiliser le Markup inheritance qui est simplement une hiérarchie de classes et de markup qui composent le layout final. Finalement, il est possible de créer un ensemble de Panels pour découper ses écrans, mais la pré-visualisation devient difficile (inclusion de code HTML entre les balises Wicket qui sera ignoré au runtime).

## Wicket ne tient pas la charge

Wicket stocke beaucoup d'informations en session et il est donc trop lourd pour gérer plusieurs milliers d'utilisateurs simultanés. Le versionning des pages qui conserve l'historique de l'état des pages ouvertes par l'utilisateur en est le principal responsable. Martin a quelques références de sites à fort trafic, mais un vide se fait sentir à ce sujet.

Oui, Wicket stocke beaucoup d'infos en session mais celles-ci sont nécessaires pour les fonctionnalités avancées comme la gestion du back button et les requêtes Ajax. Wicket propose un tas d'optimisation et un modèle de programmation qui permettent d'alléger cette charge. Par exemple, les LoadableDetachableModel permettent d'attacher et de détacher les objets à chaque affichage plutôt que de maintenir la donnée dans la session.

Certes certaines pratiques recommandées par Wicket sont assez dures à comprendre. Dans mon cas, je me pose souvent la question : si je mets mon attribut là, est-ce qu'il sera sérialisé en session avec ses dépendances ? Pour s'en convaincre, l'article suivant illustre certains de ces cas : « [Wicket Anti-Patterns: Avoiding Session Bloat](http://letsgetdugg.com/2009/04/19/wicket-anti-patterns-avoiding-session-bloat/) ».

## Tester une application Wicket est difficile

Le projet WicketTester est intégré au framework même s'il n'a pas été développé par l'équipe principale. D'après Martin, il s'écarte un peu du modèle du framework lui-même et souffre de certaines limitations. Parmi celles-ci, il faut connaître le chemin complet d'un composant dans la hiérarchie pour y accéder (exemple : pour tester un lien d'un form d'un panel, il faut connaître cette hiérarchie pour cliquer sur le lien).

En réalité, ces limitations ne sont pas bloquante, juste gênantes. Certains projets Wicket utilisant WicketTester ont une couverture de code importante. Martin nous a montré après la conférence des exemples de tests réels assez convainquant. Ca reste proche de l'API Selenium (sans ses bugs aléatoires, j'espère).

Wicket 1.5 devrait apporter un framework de test plus complet et basé sur une partie du travail accomplit sur JDave. JDave est un framework de BDD (Behavior Driven Development) qui permet de spécifier par l'exemple les comportements des objets. Plus d'infos sur : [http://www.jdave.org/bdd-wicket/](http://www.jdave.org/bdd-wicket/).

L'article « [Testing Wicket with FitNesse](http://blog.xebia.com/2008/07/06/testing-wicket-with-fitnesse/) » illustre également certains problèmes rencontrés et leurs solutions pour l'écriture de fixture FitNesse.

## Les URLs générées sont moches

Wicket génère par défaut des URL de type : http://cheer.com/shop?wicket:interface=:0:detail1::ILinkListener::

Moche, non ? Et surtout pas facile à retenir et pas terrible pour le référencement. Ces URL contiennent de plus un numéro de version propre à la session courante. De ce fait, il sera impossible de la bookmarker.

Problème récurrent des frameworks Web, la génération des URL par Wicket peut être configurée par pas moins de six stratégies d'encodage. Un exemple tiré du livre, la stratégie « IndexParamUrlCodingStrategy » est Restful car elle génère une URL de type : http://cheesr.com/cheeses/edam, où « edam » est le paramètre d'indice 0. D'autres exemples figurent sur le [Wiki](http://cwiki.apache.org/WICKET/url-coding-strategies.html).

## Spring Security s'intègre mal à Wicket

Intégrer SpringSecurity/Acegi à une application Wicket n'est pas une sinécure. SpringSecurity réalise ses contrôles essentiellement à partir d'URLs (par exemple : « l'utilisateur Hadopi est-il autorisé à accéder à www.thepiratebay.com »). Hors les URL de Wicket contiennent toutes par défaut un identifiant de version, ce qui limite fortement l'usage de SpringSecurity.

Wicket dispose de son propre framework de sécurité orienté composant (au lieu d'être orienté URL) donc il est plus granulaire. Avec ce système, Martin nous explique qu'il est très simple de ne pas afficher un lien si l'utilisateur n'a pas accès à sa destination. Illustration :

```java
Link adminPage = new Link("admin") {
    @Override
    public void onClick() {
        setResponsePage(AdminPage.class);
    }

    @Override
    public boolean isVisible() {
        UserSession userSession = UserSession.get();
        return userSession.getUser().isAdmin();
    }
};
```

Pour aller plus loin et centraliser les autorisations, Wicket propose d'autres projets. Wicket-auth-roles couvre des besoins simples et Wicket-security-wasp/Wicket-security-swarm émule JAAS. L'article suivant compare ces solutions : « [Security Framework comparison](http://wicketstuff.org/confluence/display/STUFFWIKI/Security+Framework+Comparison) ».

Au passage, il est même possible de développer ses propres annotations et de les poser sur les composants à protéger. Wicket, ce n'est que du Java après tout :-)

## Wicket n'est pas un framework managé

Avec Wicket, vous allez réapprendre à utiliser les mots-clés « new » et « extend » pour lier vos composants. Il n'y a pas d'injection de dépendances natives entres les composants.
Et c'est tant mieux car on n'en a pas besoin ! Avec Wicket, il y a pas de Xml pour pseudo-découpler vos composants. Et franchement, vous en avez eu souvent besoin ?

Côté Injection de dépendances, Wicket s'intègre très bien avec Spring et Guice. Notamment, il propose pas moins de trois solutions pour utiliser des beans Spring (service locator, proxy et annotation). Plus d'infos sur la page du [Wiki dédiée à Spring](http://cwiki.apache.org/WICKET/spring.html).

## Wicket n'est pas outillé

Même si Wicket enlève sa part de Xml, il nous reste quand-même les pages en Java avec leur markup Html et leurs ressources Xml. Il peut devenir vite fastidieux de manipuler ces fichiers séparément alors qu'ils ne forment en réalité qu'une seule page.

En réalité, il n'y a pas vraiment besoin d'outils pour manipuler Wicket. La plupart des choses se passent en Java. Le markup doit être valide (bons identifiants) sinon Wicket refusera de se lancer ce qui permettra de valider son code.

Si vous cherchez vraiment un outil, Wicket est assez bien supporté par les IDE. Pour Eclipse. [WicketBench](http://www.laughingpanda.org/~inhuman/wicket-bench/docs/features-0.5.html) propose quelques fonctionnalités intéressantes, mais il n'est pas toujours stable.

## L'intégration avec des frameworks JavaScript est difficile

A l'usage, on se rend compte que l'intégration manuelle avec le JavaScript n'est pas évidente. Toujours ces histoires d'Id générés qui rendent plus compliqué un framework orienté Composants qu'un bon vieux Struts.

Comme toujours, un framework Javascript est d'un grand secours et Wicket ne fait pas l'impasse là-dessus. Wicket s'intègre aux principaux frameworks JavaScript : YahooUI, Dojo, Scripaculous ou encore JQuery.

L'exemple suivant montre l'usage de [WiQuery](http://code.google.com/p/wiquery/) qui intègre Jquery/JQueryUI à Wicket au travers des Behaviors, qui permettent d'ajouter des comportements à des objets existants (dont des attributs JS ou Ajax) :

```java
public MyWebPage() {
    Label example1 = new Label("example1", "Example 1");

    example1.add(new WiQueryEventBehavior(new Event(MouseEvent.CLICK) {
        @Override
        public JsScope callback() {
            return new JsScope() {
                @Override
                protected void execute(JsScopeContext scopeContext) {
                    scopeContext.self().chain(CssHelper.css("border", "1px solid red"));
                }
            };
        }
    }));

    add(example1);
}
```

## Conclusion

Ah Wicket. Quand l'utiliser ou s'en passer ? Une chose est sûre : aucun framework n'est « One size fits all ». Ainsi connaître les limitations de Wicket et leurs solutions est un bon moyen de mieux l'utiliser et de l'apprécier. Et moi, j'adore.

Vous aussi, vous avez certainement rencontré des problèmes et touché les limites de Wicket. Lesquelles ? Les avez-vous trouvées bloquantes ?
