---
title: Critique du livre "Wicket In Action"
lang: fr
image: /assets/images/posts/2008-12-09-critique-du-livre-wicket-in-action/wicket_in_action.jpg
---

Je lorgnais depuis un sacré moment sur [Wicket](http://wicket.apache.org/), ce célèbre framework Web orienté composant. Les exemples du site m'avaient fait saliver : découpage propre du HTML et du code Java, gestion des événements côté java (comme un onclick sur un lien), composants réutilisables, support Ajax natif, intégration à Spring et Hibernate... Beaucoup de qualités qui ont suscité ma curiosité.

Heureux possesseur du livre "Wicket In Action" depuis quelques semaines, je me suis plongé dedans pour voir si ce framework tient vraiment toutes ses promesses. Je précise que je n'ai pas fait de projet professionnel avec ce framework donc mon expérience se limite au livres, à ses exemples et au code que j'ai écrit à côté.

## Mais tout d'abord, pourquoi Wicket ?

Le framework a été conçu avec en tête :

### Découpage fort du HTML et du java

Wicket permet de séparer l'HTML et le code Java. Les pages HTML restent à 99% prévisualisables dans un navigateur. Essayer avec une JSP pour voir... En fait, le framework se sert du HTML comme d'un template en se permettant de modifier le source si le code Java le demande.

Voici un exemple d'un titre HTML, parfaitement valide au niveau HTML :

```html
<h1 wicket:id="message">Hello, World!</h1>
```

Et un peu de code Java, Wicket va utiliser l'ID "message" pour remplacer le texte par autre chose. Et cela peut s'appliquer à des éléments beaucoup plus complexe.

### Séparation avec le monde Stateless

Wicket gère lui-même le maintien de l'état et donc permet de s'abstraire du modèle stateless HTTP. C'est assez bien foutu de ce côté-là. Adieu HttpServletRequest. Pour l'instant avec mon usage, c'est 100% vrai.

### Simplicité/Productivité/Fun

Wicket se veut assez simple et rapide d'accès pour arriver à des fonctionnalités avancées (Ajax de partout, intégration à Spring, Hibernate...). Dans la réalité, tout n'est pas aussi simple. On voit vite qu'écrire un composant réutilisable a un coût de développement plus important. On est très très loin de JSF mais il faut le souligner quand-même.

Un aperçu et plus de détail sont directement dispo sur la page d'[introduction à Wicket](http://wicket.apache.org/introduction.html).

## Pourquoi se mettre à Wicket ?

- Pour comprendre ce qu'on entend par framework orienté composant ;
- Pour faire le pont entre le monde Swing et le Web ;
- Parce que Wicket est assez léger et simple à comprendre ;
- Parce que c'est un framework très populaire (mais moins que GWT ou Flex) ;
- Parce qu'il évolue vite et a un bon noyau de développement ;
- Pour ne plus jamais avoir envie de faire de JSF.

## Ce que j'ai aimé dans le livre

Le livre en lui-même est bien présenté et agréable à lire. Les chapitres sont courts et bien découpés, ce qui facilite son usage comme référence pour plus tard.

Il a été écrit par deux des principaux Core Developers de Wicket depuis qu'il est OpenSource. On peut donc leur faire confiance quand ils donnent des conseils ;-) . Les parties de code sont assez claires même si j'ai eu un peu de mal à comprendre où rattacher quoi à certains moments.

Les auteurs détaillent le framework progressivement même si l'application est déjà bien lancée au chapitre 3. Chaque partie est expliquée en détail mais pas trop. Je ne me lancerai quand-même pas dans la publication d'un composant sans y regarder à deux fois mais les principes et les bases sont évoqués.

Le chapitre sur Spring est bien présenté, on voit différentes façons de l'intégrer, y compris par les annotations. La partie sur "Aller en production" est vraiment intéressante car on y apprend que Wicket peut exposer des Mbeans pour se reconfigurer à chaud. Il est aussi expliquer comment tester ses composants et ses pages.

## Ce que je n'ai pas aimé

J'aurai aimé un chapitre sur les projets annexes que l'on retrouve côté [Wicket Stuff](http://wicketstuff.org/confluence/display/STUFFWIKI/Wiki).

Par exemple, dans le chapitre sur la sécurité, Acegi n'est pas évoqué. Certes, c'est un livre sur Wicket, mais quelques paragraphes pour montrer les extensions annexes auraient été la bienvenue.

De plus, le livre ne revient pas sur les changements qui ont eu lieu au fil des versions. Pourquoi ne pas parler de Wicket 2 qui est mort-né ? Et Wicket 1.4, quelles seront les nouveautés ? Allez, je demandais juste un bout d'introduction. Cette version est à peine évoquée au fil des pages.

## Le détail des chapitres

### 1. Ce qu'est Wicket

C'est l'habituel chapitre de présentation : d'où vient le nom du framework, ce qu'il fait et pourquoi il est si populaire.

Pour résumer :

- Le framework est construit autour de l'équation : "Just Java + Just HTML = Wicket" ;
- Il abstrait les notions HTTP derrière le langage Java permettant d'être plus souple et plus puissant ;
- Il permet de faire des interfaces Web au-delà des objets basiques comme les champs textes. Il apporte et permet de créer donc des composants évolués : Tab, panneaux, groupe d'objets ou composants métiers...

### 2. L'architecture

Ce chapitre démarre sur l'explication des objets de base de Wicket : Application, Session. Puis il explique le trio Composant, Model et Html qui forme la base du framework.

### 3. L'application-exemple "CheesR"

L'application du livre est une boutique de vente de fromage. Les auteurs expliquent qu'ils aimeraient vendre du fromage en ligne car ils ont du mal à trouver de bons fromages aux US. Le code produit à ce niveau est déjà assez complet : on itère les fromages puis on ajoute de la pagination côté serveur, on ajoute ou enlève des éléments à son caddie, on gère les premiers événements et on crée un premier formulaire avec de la validation.

Ce chapitre est simple à suivre et offre une bonne vue d'ensemble. Il permet de bien comprendre comment le tout fonctionne et quelle est la structuration choisie par le framework.

### 4. Les Models

Les Models sont une des pierres angulaires. Ils sont une indirection entre un composant et un objet du domaine. Par exemple, un Model permet à un Label d'afficher le champ "name" d'un User. Pourtant à aucun moment, Label ne dépend de User et vice versa.

Il existe différents Model qui permettent de peupler par réflexion un objet du domaine et l'inverse, donc de faire du binding, ou encore de recharger l'objet sous-jacent à chaque requête Web.

### 5. Les composants de base : label, lien et répéteurs

On se lance ici à la découverte des composants de base. C'est en fait une présentation du deuxième pilier du framework : les Composants (le 3ème étant le Html).

Je me suis rendu compte à ce niveau de la puissance des composants. Par exemple, cacher une partie entière d'une page HTML est aussi simple que "panel.setVisible(false)". Et ça se fait en java, fini les "&lt;c:if test=...&gt;".

### 6. Les formulaires

C'est une des parties les plus importantes à mon goût : qu'offre le framework pour me permettre de développer des applications de gestion plus rapidement ? Mon domaine est-il bindé facilement à un formulaire ? Quid de la validation ? Et si mon formulaire est très dynamique ?

Le chapitre répond à toutes ces questions et là encore, Wicket fait des merveilles avec les formulaires. J'aurai aimé que ce chapitre couvre également la validation en Ajax, chose qui ne sera pas traitée dans le livre. Idem pour la [JSR 303](http://jcp.org/en/jsr/detail?id=303) qui concerne la validation des beans : pas un mot là dessus.

### 7. Composer ses pages

Cette partie couvre :

- l'organisation d'une page en bloc, panneau et fragment ;
- l'organisation des pages :
  - en répétant la structure ;
  - en utilisant l'héritage pour ne redéfinir que certaines portions ("Markup Inheritance")
  - en construisant des Panels.

Parmi ces 3 derniers choix, lequel prendre ?

Pour les auteurs, cela dépend des besoins en termes de rendu, de duplication de code, de navigabilité et de bookmarkabilité. Faire des pages pleines est valide avec un petit nombre de pages. L'héritage permettra ensuite de simplifier le code une fois le design stabilisé. Enfin les Panels sont l'arme ultime mais plus coûteux à développer qu'une simple Page.

### 8. Développer ses propres composants

C'est le chapitre le plus compliqué à mon goût mais c'est normal. Comme l'expliquent les auteurs, développer un composant c'est du boulot en plus mais un gain en maintenance. Pour ceux qui connaissent, il est simple de développer des composants qui se comportent en quelque sorte comme des Portlets. Ils peuvent avoir leur propre ressource, offrir des écrans de configurations etc.

### 9. Les ressources dynamiques, Images, css et Javascripts

On continue sur les composants : comment ceux-ci embarquent leurs propres ressources (css, image, javascripts) et comment un composant propose du contenu téléchargeable.

### 10. Ajax et les composants riches

Wicket a son propre moteur Ajax. Celui-ci a l'avantage d'être simple et directement destiné et intégré, mais il est donc moins puissant que Dojo par exemple. Si vous voulez utiliser un de ces projets, le chapitre n'en parle pas. Il faudra donc se tourner vers les projets de Wicket-Stuff.

Les composants de base ont souvent leur alternative Ajax. Par exemple, on trouve des AjaxLinks à côté des Links traditionnels (ou mieux des AjaxFallbackLinks), ou encore des AjaxEditableLabels qui offre la possibilité d'éditer "In place".

### 11. La sécurité

Ce chapitre est dédié à l'intégration de l'authentification et de l'autorisation à son application. Rien de surprenant ici quand on connait un peu Acegi. Ou plutôt si justement : pourquoi le tenor du marché n'est pas évoqué ? Un encart élargit le sujet en parlant des projets "wicket-auth-roles" et "wicket-security-wasp/wicket-security-swarm" mais ça s'arrête là. Manque de place ?

### 12. Localisation et internationalisation

Un sujet des moins passionnants mais passage obligé. On y parle aussi de la gestion des fichiers de ressources qui poussent plus loin le fonctionnement que l'on peut en faire habituellement. La encore, l'approche composant pousse Wicket à offrir plus de puissance.

### 13. Spring et Hibernate

C'est "Spring Time" dans ce chapitre. On sort un peu de Wicket pour voir son intégration au monde extérieur car tout ne se fait pas côté Web (même si j'en connais certains qui aiment les scriplets). Le chapitre montre différentes façons d'intégrer Spring (par référence, par proxy, grâce à wicket-spring, puis par annotation). Hibernate fait partie du sujet couvert mais assez rapidement. S'il n'en parle pas beaucoup, c'est que c'est facile à intégrer, non ?

### 14. Tester ses pages, de belles URL et configuration de production + JMX

Le chapitre passe sur plusieurs sujets.

WicketTester permet d'écrire, comme son nom l'indique, des tests de ses pages et composants, y compris quand Ajax rentre en jeu.

Puis le montage d'URL est évoqué. Il permet de faire de belles URL dans le style Rest-like, par exemple : http://www.tomsquest/book/wicket.

Enfin, partie surprenante, Wicket fonctionne par défaut en mode Développement. Cela lui permet d'afficher de belles pages d'erreur avec de belles stacktraces et tout un tas d'autres choses pour le plaisir du développeur. Configurer en mode Prod, Wicket passe à la version boostée : cache des pages, compression Gzip, suppression des Id dans les pages...

Le chapitre explique également configurer Wicket à l'aide de Mbean JMX. Il est beau ce framework quand même, non ?

## Le mot de la fin

Le livre a répondu à beaucoup des questions que je me posais. Son spectre n'est pas très large (pas de Wicket Stuff) mais largement suffisant pour démarrer rapidement. Je le recommande à ce qui veulent tester Wicket et se lancer dans leur premier projet.

Mais d'ailleurs, vous devriez déjà être sur [Amazon](http://www.amazon.fr/Wicket-Action-Jonathan-Locke/dp/1932394982) pour commander votre exemplaire.

### A noter également

Si vous êtes radin (ou pas bête), le site de Manning propose les chapitres suivants :

- Chap. 1 : [Ce qu'est Wicket](http://www.manning.com/dashorst/ch01_dashorst.pdf) ;
- Chap. 8 : [Développer ses propres composants](http://www.manning.com/dashorst/ch08_dashorst.pdf) ;
- Un [chapitre supplémentaire](http://www.manning.com/dashorst/Wicket_Bonus-chapter15.pdf) pour démarrer avec Wicket - Ant et Maven y sont couverts.

Le [site du livre](http://wicketinaction.com/) est également intéressant et propose quelques articles intéressants.
