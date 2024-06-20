---
title: "Selenium en java : Démarrage rapide"
lang: fr
image: /assets/images/posts/2008/09/selenium_small.jpg
---

L'article est un guide de démarrage rapide pour l'écriture de tests Selenium en Java. Nous allons voir ce qu'il faut configurer dans le pom.xml de Maven et comme lancer l'ensemble des tests.

## Présentation

[Selenium](http://selenium.openqa.org) est l'outil idéal pour tester une application Web. L'enregistreur de test, le fameux Selenium IDE, permet d'enregistrer des scénarios de tests rapidement et directement en simulant le test depuis son navigateur Firefox. Les tests sont ensuite rejoués depuis les fichiers HTML générés par l'éditeur. Il est important de noter que l'éditeur propose d'enregistrer les scénarios directement dans différents langages : Java, C#, Ruby... mais il ne sait alors plus les relire. Seul le format HTML est supporté pour la lecture.

### Inconvénients des tests HTML

L'utilisation de fichiers HTML comme script de tests a les inconvénients suivants :

- Impossible de factoriser le code pour, par exemple, répéter une vérification ;
- Impossible de mettre la base de données dans un état spécifique avant un test ;
- Difficile d'intégrer les tests HTML avec Maven. Des solutions existent mais elles ne fonctionnent pas à tous les coups ;
- Difficile à maintenir : les tests sont monolithiques, peu compréhensibles sans commentaire.

## Solution

Afin de pallier tous ces problèmes, une solution est d'utiliser l'IDE pour enregistrer les tests en Java puis d'intégrer ces scénarios comme tests JUnit à part entière. Les tests ainsi créés feront partis des tests fonctionnels de l'application. Les développeurs Java voient tout de suite les avantages : création de méthode de tests, factorisation, lancement de script SQL avant et après un test.

Place au concret, nous allons voir comme intégrer ces tests à un projet Maven et comme faire en sorte que celui-ci puisse les exécuter et rapporter les éventuelles erreurs.

## Mise en place

Maven 2 ne supporte pas les tests d'intégration de manière native, mais cela est prévu pour la version 2.1, voir la 3. Il est donc conseillé de créer un projet spécifique pour les tests d'intégration. Le détail de la création de ce module annexe n'est pas présenté ici. Nous allons nous concentrer sur ce qu'il faut pour le configurer.

Tout d'abord, commençons par éditer le `pom.xml` du module de test.

### 1 - Ajout des repos OpenQA (l'éditeur de Selenium)

```xml
<repositories>
    <repository>
        <id>openqa.org</id>
        <name>Openqa Release Repository</name>
        <url>http://archiva.openqa.org/repository/releases</url>
        <layout>default</layout>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
        <releases>
            <enabled>true</enabled>
        </releases>
    </repository>
    <repository>
        <id>openqa.org</id>
        <name>Openqa Snapshot Repository</name>
        <url>http://archiva.openqa.org/repository/snapshots</url>
        <layout>default</layout>
        <snapshots>
            <enabled>true</enabled>
            <updatePolicy>daily</updatePolicy>
            <checksumPolicy>ignore</checksumPolicy>
        </snapshots>
        <releases>
            <enabled>false</enabled>
        </releases>
    </repository>
</repositories>
```

### 2 - Dépendances

```xml
<dependency>
    <groupId>org.openqa.selenium.client-drivers</groupId>
    <artifactId>selenium-java-client-driver</artifactId>
    <version>1.0-SNAPSHOT</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>3.8.2</version>
    <scope>test</scope>
</dependency>
```

Les dépendances devraient ressembler à celles-ci sous Eclipse :

![](/assets/images/posts/2008/09/libs1.jpg)

### 3 - Configuration de la phase de test

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>selenium-maven-plugin</artifactId>
            <executions>
                <execution>
                    <phase>pre-integration-test</phase>
                    <goals>
                        <goal>start-server</goal>
                    </goals>
                    <configuration>
                        <background>true</background>
                        <!--
                            To capture the logs from Selenium to a file, enable logOutput.
                            This will create a server.log that captures all of the output.
                            <logOutput>false</logOutput>
                        -->
                    </configuration>
                </execution>
                <execution>
                    <id>stop</id>
                    <phase>post-integration-test</phase>
                    <goals>
                        <goal>stop-server</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <configuration>
                <!--
                    Skip the normal tests, we'll run them in the integration-test
                    phase
                -->
                <skip>true</skip>
            </configuration>
            <executions>
                <execution>
                    <phase>integration-test</phase>
                    <goals>
                        <goal>test</goal>
                    </goals>
                    <configuration>
                        <skip>false</skip>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## Premier test Java

Un test Selenium hérite de la classe `com.thoughtworks.selenium.SeleneseTestCase` dont nous avons inclus le Jar dans les dépendances. Celle-ci offre un objet `selenium` permettant de piloter le navigateur et étend également la classe `TestCase` de JUnit, permettant de faire des assertions comme dans un test classique.

Je vous mets ci-dessous un test basique qui se connecte à une adresse locale (test.jsp) puis saisit un login, soumet le formulaire et enfin vérifier que la connexion a réussie.

```java
package com.tomsquest.selenium;

import com.thoughtworks.selenium.SeleneseTestCase;

public class SimpleTest extends SeleneseTestCase {
    @Override
    public void setUp() throws Exception {
        setUp("http://localhost:8080/", "*iexplore");
        selenium.open("/tomsquest/test.jsp");
    }

    public void testLogin() {
        selenium.type("login", "tom");
        selenium.click("submit")
        selenium.waitForPageToLoad("5000");
        assertTrue(selenium.isElementPresent("welcome"));
    }
}
```

Le test a besoin du serveur Selenium pour interagir avec l'application. Il faut lancer le serveur avant de lancer un test. Le serveur est nécessaire afin que le code Java puisse passer des commandes au navigateur, tel que cliquer sur un bouton ou obtenir le code HTML.

La commande de lancement du serveur est :

```bash
$ mvn selenium:start-server
```

## Lancement de tous les tests

Maven est configuré pour lancer tous les tests lors de la construction du module. Il n'y a cette fois pas besoin de lancer le serveur Selenium car Maven s'en charge tout seul. La commande pour lancer tous les tests est :

```bash
$ mvn clean install
```

Une fenêtre du navigateur est ouverte pour chaque test et vous verrez que le rapport de fin sur la console.

## Astuce

Pour éviter de fermer et rouvrir le navigateur à chaque test, il est possible d'utiliser l'option : `browserSessionReuse.` Un seul navigateur est alors ouvert pour l'ensemble de tests.

Exemple de démarrage du serveur avec l'option `browserSessionReuse` :

```bash
$ mvn selenium:start-server -DbrowserSessionReuse=true
```

Cela améliore grandement la vitesse de passage des tests, mais peut influencer sur ceux-ci car le navigateur pourrait conserver des élements dans sa session. Donc à utiliser à bon escient.

## Conclusion

Nous avons vu :

- L'intégration de Selenium à un projet Maven ;
- Le lancement d'un test Java/Selenium seul ;
- Le lancement de tous les tests par Maven.

N'hésitez pas à me faire un retour si vous aussi, vous utilisez Selenium en passant par des tests Java. Sur notre projet, c'est un réel succès. Nous avions atteint un nombre de tests HTML trop important pour pouvoir être serein sur leur maintenance. Dorénavant, depuis que nous avons migré en "full java", nous dormons mieux la nuit et nos utilisateurs aussi ☺️.
