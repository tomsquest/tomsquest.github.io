--- 
title: "OSGI : oui mais non"
slug: osgi-oui-mais-non
date: 2008-10-15T00:00:00Z
---

<img src="/assets/images/posts/2008/12/parisjug-logo.jpg" style="float:right"/>

[Xebia ](http://www.xebia.fr/)a présenté hier soir « OSGI » au [Paris JUG](http://parisjug.org/). Ce fut une conférence très intéressante menée par Cyrille Le Clerc et Nicolas Griso. Tout leur discours a consisté à nous présenter honnêtement ce qu’est [OSGI](http://www.osgi.org/) et nous permettre de nous faire notre propre opinion.

Nicolas Martignole a fait une très bonne revue de la [soirée](http://www.touilleur-express.fr/2008/10/15/presentation-dosgi-au-paris-jug-naphtaline-et-peinture-fraiche). D’ailleurs, je nomme le [Touilleur Express](http://www.touilleur-express.fr/" target="_parent) comme reporter officiel des JUG parisiens pour ses comptes rendus complets et les annotations qu’il fait.

Je voulais revenir sur les points que j’ai découverts et qui m’ont surpris pendant la soirée.

## Des promesses, des promesses...

Regardez un peu cette page : [Why OSGI ?](http://www.osgi.org/About/WhyOSGi) et dites moi si après ça vous n’avez pas envie de vous y mettre. On dirait une page écrite par un commercial d’IBM. OSGI y est défini comme simple, transparent, sécurisé, non intrusif, utilisable partout, et je ne liste pas tous les autres adjectifs… Même si je le voulais, je n’arriverais pas à trouver quelque chose qui manque.

OSGI propose la Modularité avec un grand « M » : les modules (« bundles ») sont liés entre eux par des interfaces déclarées ayant des numéros de version et ayant un cycle de vie maitrisé. Ce framework propose une solution aux limitations des JAR : pas de réalité au runtime (uniquement au build), pas de versionning, pas d’interface externe, pas de gestion des dépendances, pas de cycle de vie. Donc oui, sur ce point, OSGI semble être LA réponse.

## La réalité

Je vais lister les points qui me titillent :

OSGI est fermé et payant :

* Plus fermé que le JCP, le « club » OSGI est composé de membres qui paient une adhésion (on parle de 20000 $ par membre, le JCP est, lui, gratuit) ;
* Les débats sont privés et réservés aux membres tandis qu’ils sont publics au JCP ;
* Les TCK (test compatibility kit) sont réservés aux membres payants.

Donc par rapport au JCP, le groupe OSGI se tient à l’écart et vit sur ces propres règles.

OSGI est complexe à mettre en œuvre. Techniquement, il n’y a pas d’injection des dépendances et pas de configuration par annotation (mais c’est en cours, voir [spring-dm](http://www.springframework.org/osgi)). Cyrille et Nicolas de Xebia nous ont fait quelques demos rondement menées. Conclusion : ça marche mais ce n’est pas magique. La réalité est dure de ce côté-là.

Chaque fournisseur de bundles est responsable de son packaging à la sauce OSGI. C'est-à-dire que si IBM a besoin de log4j, il va créer son bundle. Idem pour Eclipse. Et donc chacun va déclarer les méta-données qu’il veut : dépendances et numéro de version. Ainsi, IBM propose un bundle java7. Etonnant, non ? Ca risque de devenir un beau cauchemar si ce ne sont pas les équipes qui développent le JAR qui lui associent ses méta-données.

OSGI propose des fonctionnalités dont peu de monde a besoin. Par exemple, l’arrêt/relance de bundle à chaud. Qui a déjà rencontré ce cas d’utilisation ? Qui est prêt à l’essayer en prod ? Avez-vous vraiment besoin de gérer un cycle de vie ? Si oui, celui proposé dans les EJB ne vous convient pas ?

L’ensemble des RFC (request for comment) d’OSGI est très large et fait de l’ombre au JCP. Il vise à terme à couvrir l’ensemble des services proposés dans J2EE mais toujours ailleurs et indépendamment du JCP.

## Alors OSGI, c’est pour moi ?

A part dans l’embarqué, je ne vois que Eclipse et plusieurs serveurs d’application qui profitent d’OSGI. Eclipse est « osgifiée » depuis la 3.1 et son architecture de plugin repose dessus. Mais d’autres savent en faire autant et sans OSGI. Pour les serveurs d’app, il s’agit essentiellement de pouvoir réutiliser les modules au travers de plusieurs déclinaisons du produit.

## L’avenir

L’avenir concerne avant tout le mode distribué (communication des runtimes OSGI entre JVM), l’intégration à J2E (transaction, sécurité) et l’ouverture à d’autres langages. Alors oui, vous avez bien lu « transaction ». Actuellement, plusieurs choses courantes aujourd’hui sont des problématiques au niveau OSGI. Il y a des problèmes avec le ThreadLocal qui existe depuis des années en java. Un fichier dans le classpath (par exemple le log4j.properties) n’est plus partagé, il faut donc le gérer différemment. Idem pour les fichiers hbm.xml utilisés par Spring pour configurer Hibernate. Bref, de nouvelles choses à apprendre et le terrain est difficile.

## Conclusion

OSGI est à la fois mature et jeune, ou comme le dit Nicolas Martignole, c’est « naphtaline et peinture fraîche ». OSGI existe depuis 10 ans, il a pondu des standards respectés mais il manque cruellement de maturité concernant le monde J2E. C’est pour ça qu’il ne perce pas davantage dans l’informatique de gestion. Le framework va être amené à évoluer fortement dans les prochaines années, peut-être fortement tiré par [Spring DM](http://www.springframework.org/osgi) (suspense…).
