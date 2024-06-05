---
title: 30 secondes avec Glassfish v3
slug: 30-secondes-avec-glassfish-v3
date: 2009-01-15T00:00:00Z
---

<img src="/assets/images/posts/2009/01/glassfish_logo.jpg" style="float:right"/>

[Glassfish](https://glassfish.dev.java.net/), le serveur d'app dont on entend parler [un peu partout](http://www.touilleur-express.fr/2009/01/14/compte-rendu-de-la-soiree-du-paris-jug-sur-jee6-et-glassfish/).

## 1. Intégration avec Maven : semi-Echec

Glassfish n'a apparemment pas de support de Maven officiel. Il existe quelques plugins Maven mais d'après [cet article](http://eskatos.wordpress.com/2008/03/28/maven-plugins-for-glassfish-ecosystem/), rien de vraiment fonctionnel à part le plugin de l'auteur.

J'ai donc essayé le plugin Maven « [Asadmin ](http://code.google.com/p/asadmin-maven-plugin/)» qui m'a permis de déployer un War Wicket dans Glassfish. Pour info, seule la version 0.3-snapshot » de Asadmin a fonctionné.

Une autre solution serait de démarrer soi-même un Glassfish via l'[API Embedded](https://embedded-glassfish.dev.java.net/) (voir ce [ce commentaire](http://www.tomsquest.com/blog/2008/09/jetty-demarrage-rapide/#comment-11) d'Alexis MP). Mais apparemment, il s'agit toujours de déployer un War. Il faut donc générer à chaque changement de code.

Pour résumer :

- Pas de plugin Maven pour Glassfish aussi facile d'accès que celui de Jetty ;
- Mais possibilité de déployer un War en ligne de commande facilement.

## 2. Installation : succès

Le site du projet a plusieurs liens vers différents guides de démarrage qui donnent à peu près les mêmes infos.

- Dézipper le zip ;
- Lancer $GLASSFISH_HOME/bin/asadmin start-domain ;
- Pour tester, copier l'application hello.war dans le répertoire autodeploy ;
- En quelques secondes, l'application devient accessible ainsi que la console d'admin.

Aucun problème d'installation, Glassfish est très rapidement mis en place.

Le démarrage est très rapide mais si on suppose vite que plein de choses se passent en tâche de fond (comme le précise la console au lancement).

## 3. Intégration à Eclipse : succès

L'ajout d'un serveur dans le WTP d'Eclipse propose de télécharger des « server adaptor » additionnels, chose requise pour utiliser Glassfish. Ici encore, la [documentation](https://glassfishplugins.dev.java.net/eclipse34/index.html) est détaillée avec des captures d'écran.

Mon impatience a failli me coûter cher. La liste a mis plusieurs minutes pour trouver le connecteur Glassfish. Si ça vous arrive, allez prendre un café en attendant.

Une fois le serveur ajouté, le déploiement sur Glassfish d'un projet Web prend quelques secondes, démarrage du serveur compris. Une modification d'une classe Java est prise en compte quasiment immédiatement.

## Conclusion

Glassfish est facilement installable. Sa mise en place dans un projet est rapide au travers d'un IDE. Il démarre en quelques secondes, aussi vite que Jetty.

Pourtant sur l'aspect configuration et intégration à Maven, [Jetty est encore imbattable](http://www.tomsquest.com/blog/2008/09/jetty-demarrage-rapide/) (plugin Maven au Top et simple fichier de config pour les dataSources).

Il m'a manqué du temps pour tester le rechargement à chaud des classes et la persistance des sessions mais si c'est aussi facile que le reste, je l'adopte pour mes dév.
