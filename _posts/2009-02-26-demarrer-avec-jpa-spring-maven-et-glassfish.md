---
title: "Démarrer avec JPA, Spring, Maven et Glassfish"
lang: fr
image: /assets/images/posts/2009/02/screenshot_06.jpeg
---

Je vous propose un projet qui permettra de démarrer avec [Spring](http://static.springframework.org/spring/docs/2.5.x/reference/), de déployer sous [Glassfish v3](https://glassfish.dev.java.net/) et de lancer les tests d'intégration sans serveur d'application, le tout avec le pom [Maven](http://maven.apache.org/) qui va bien.

## JPA

Le projet contient deux configurations de JPA : l'une pour le déploiement, utilisée par Glassfish, l'autre pour les tests d'intégration.

Les PersistentUnits sont configurés par :

- le fichier "persistence.xml" pour Glassfish, l'attribut transaction-type doit valoir "JTA", sinon Glassfish refuse de démarrer ;
- le fichier "orm.xml" pour les test. L'Attribut transaction-type vaut "RESOURCE_LOCAL"

Spring est lui aussi configuré en deux fois (déploiement et test). Grâce aux classpath de Maven, le bon fichier est sélectionné.

![](/assets/images/posts/2009/02/screenshot_05.jpeg)

Le fichier JPA pour le serveur est le suivant :

```xml
<jee:jndi-lookup id="dataSource" jndi-name="jdbc/springify" />
<jee:jndi-lookup id="entityManagerFactory" jndi-name="persistence/springify"/>
<tx:jta-transaction-manager />
```

Le fichier JPA pour les tests d'intégration est le suivant (un peu plus copieux) :

```xml
<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource"
    p:driverClassName="com.mysql.jdbc.Driver" p:url="jdbc:mysql://localhost:3306/springify"
    p:username="root" p:password=""/>

<bean id="entityManagerFactory" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"
    p:dataSource-ref="dataSource" p:persistenceXmlLocation="META-INF/orm.xml"
    p:persistence-unit-name="springify" p:jpaVendorAdapter-ref="jpaAdapter" />

<bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager"
    p:entityManagerFactory-ref="entityManagerFactory" />

<bean id="jpaAdapter" class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter"
    p:database="MYSQL" p:showSql="true" />
```

## Glassfish

Côté Glassfish, il suffit de créer une nouvelle DataSource. Rien de très compliqué.
Si vous utilisez MySQL, veillez à utiliser le moteur InnoDb afin que les transactions soient activées (sinon pas de rollback). Par exemple :

```sql
CREATE TABLE Tag (
    id      INT NOT NULL AUTO_INCREMENT
    ,label  VARCHAR(256) NOT NULL
    ,PRIMARY KEY (id)
) Engine=InnoDB;
```

### NoClassDefFoundError: javax/interceptor/InvocationContext

Cette erreur est visible au lancement de Glassfish mais elle n'impacte pas le fonctionnement de l'application. Apparemment, un Glassfish v3 n'aurait pas les Jars EJB par défaut, comme dit dans [ce message](http://markmail.org/message/j3p4jj4o6q27wfhn). Je n'ai pas poussé plus loin, "if it works, don't try to fix it".

Détail de l'erreur pour info :

```java
SEVERE: Class [ javax/interceptor/InvocationContext ] not found. Error while loading [ class org.springframework.ejb.interceptor.SpringBeanAutowiringInterceptor ]
WARNING: Error in annotation processing: java.lang.NoClassDefFoundError: javax/interceptor/InvocationContext
```

## Maven

Les dépendances dans le pom.xml ont été limitées au maximum. Pour démarrer, il faut :

- Spring et Spring-test pour les tests d'intégration JPA ;
- Hibernate entity manager, c'est l'implémentation JPA utilisé pour les tests d'intégration. Elle fournit aussi un lien vers le package javax.persistence ;
- J'ai ajouté Spring-MVC pour monter une stack complète avec un Controleur Web annoté.

## Améliorations

Le "petites" choses à faire :

- Utiliser la même implémentation JPA que le serveur (EclipseLink avec Glassfish) pour les tests d'intégration (Hibernate) pour éviter d'éventuels écarts de comportement ;
- Configurer les transactions de manières déclaratives en utilisant Spring-AOP plutôt que des @Transactional un peu partout ;
- Séparer les tests d'intégration des tests unitaires comme conseillé dans Better Builds With Maven ;
- Utiliser DBUnit pour ré-initialiser la base de données au démarrage des tests, ou passer à Unitils pour faire tout ça et encore plus.

## Le projet

Le code source est disponible sur Github : <https://github.com/tomsquest/spring-jpa-maven-glassfish>
