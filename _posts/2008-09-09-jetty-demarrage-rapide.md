---
title: "Jetty : démarrage rapide"
slug: jetty-demarrage-rapide
lang: fr
date: 2008-09-09T00:00:00Z
---

<img src="/assets/images/posts/jetty_logo.png" style="float:right"/>

[Jetty](http://jetty.mortbay.org) est un serveur d'application léger, très léger. Il est en plus rapide et complètement intégré à Maven 2. Si vous voulez déployer une application Web sans devoir installer un serveur séparément, suivez le guide.

## Avantages

Les avantages de Jetty sont :

- Lancement très rapide : sur ma machine : moins de 10 secondes au total (initialisation de la DataSource, contexte spring...) ;
- Rechargement de l'application ultra-rapide : moins de 4 secondes pour qu'une modification d'une classe java puisse être testée dans le navigateur ;
- Compilation à la volée des JSP ;
- Intégration directe dans le pom.xml avec peu de configuration.

## Lancement

Pour lancer Jetty, sans avoir fait aucune configuration préalable, il suffit de lancer la commande suivante depuis la racine de votre projet Web Maven :

```bash
$ mvn jetty:run
```

Cette commande démarre Jetty qui va utiliser la configuration de Maven pour savoir où est situé le code source et les ressources. Rendez-vous sur http://localhost:8080/ pour voir votre application déployée.

![](/assets/images/posts/2008/09/jetty_run2.jpg)

Il est impressionnant de voir que Maven télécharge les dépendances de Jetty, configure son contexte et permet d'avoir un serveur d'application fonctionnel en quelques secondes.

## Datasource, Mail Session, Url Resource

Maintenant, passons aux choses sérieuses. Si vous avez besoin d'une DataSource, d'une Session mail ou d'une URL (pour par exemple externaliser la configuration de votre application), il suffit de créer un fichier de configuration qui contient ces déclarations.

Pour cela, il suffit d'ajouter au pom.xml de l'application Web :

```xml
<profiles>
    <profile>
        <id>jetty</id>
        <build>
            <defaultGoal>jetty:run</defaultGoal>
            <plugins>
                <plugin>
                    <groupId>org.mortbay.jetty</groupId>
                    <artifactId>maven-jetty-plugin</artifactId>
                    <configuration>
                        <scanIntervalSeconds>2</scanIntervalSeconds>
                        <jettyEnvXml>
                            ${basedir}\jetty\jetty-env.xml
                        </jettyEnvXml>
                    </configuration>
                </plugin>
            </plugins>
        </build>
        <dependencies>
            <dependency>
                <groupId>com.experlog</groupId>
                <artifactId>xapool</artifactId>
                <version>1.5.0</version>
            </dependency>
        </dependencies>
    </profile>
</profiles>
```

Cette configuration fait référence au fichier `jetty-env.xml`. Ce fichier est placé dans le répertoire `jetty `à la racine du projet. Le fichier `webdefault.xml `peut être ignoré, il permet de configurer Jetty en profondeur.

![](/assets/images/posts/2008/09/fichiers_jetty.jpg)

Nous avons également ajouté une dépendance vers `com.experlog.xapool` qui offre les classes nécessaires à Jetty pour avoir un pool de connexion. Le driver JDBC doit être présent dans votre projet en tant que dépendance, il n'est pas montré ici.

Voici un exemple de fichier jetty-env.xml :

```xml
<Configure class="org.mortbay.jetty.webapp.WebAppContext">

    <New id="myDataSource" class="org.mortbay.jetty.plus.naming.Resource">
        <Arg>jdbc/myDataSource</Arg>
        <Arg>
            <New class="org.enhydra.jdbc.standard.StandardDataSource">
                <Set name="DriverName">com.microsoft.sqlserver.jdbc.SQLServerDriver</Set>
                <Set name="Url">jdbc:sqlserver://server:1433;databaseName=TOMSQUESTDB</Set>
                <Set name="User">tomsquest</Set>
                <Set name="Password">********</Set>
            </New>
        </Arg>
    </New>

    <New id="mySession" class="org.mortbay.jetty.plus.naming.Resource">
        <Arg>mail/mySession</Arg>
        <Arg>
            <Call name="getInstance" class="javax.mail.Session">
                <Arg>
                    <New class="java.util.Properties">
                        <Call name="setProperty">
                            <Arg>mail.smtp.host</Arg>
                            <Arg>mail.tomsquest.com</Arg>
                        </Call>
                    </New>
                </Arg>
            </Call>
        </Arg>
    </New>

    <New id="myConfig" class="org.mortbay.jetty.plus.naming.Resource">
        <Arg>url/myConfig</Arg>
        <Arg>
            <New class="java.net.URL">
                <Arg>file:////home/tom/projects/tomsquest/config.properties</Arg>
            </New>
        </Arg>
    </New>

</Configure>
```

## Conclusion

Quelques minutes de configuration pour avoir un serveur Web opérationnel qui se relance en quelques secondes ? Oui, c'est possible. Nous avons vu comment configurer Jetty de manière complète et sans douleur.
