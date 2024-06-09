---
title: "Industrialisation des développements : automatisez votre base de données"
lang: fr
---

Le grand oubli dans l'industrialisation des développements est la base de données, cette chose monolithique et statique qui n'évolue pas aussi vite et aussi aisément que le code. Au même titre que l'intégration continue et les systèmes de gestion de version pour le code source, il existe des outils permettant de fluidifier et d'automatiser le travail autour du schéma physique des données. Travailler avec ces outils permet de compléter une démarche Agile en permettant une réactivité forte face aux changements.

Une première partie de cet article concernera les principes et pratiques autour de ces outils (partie "boss compliant"). La deuxième est orientée technique (partie "geek aware").

## Principes directeurs

Dans son article paru en 2003 intitulé "[Evolutionary Database Design](http://martinfowler.com/articles/evodb.html)", Martin Fowler pose les principes du design évolutif de base de données. Les points clés en sont :

- La base de données évolue en même temps que le code ;
- Il faut donc tester en continu la base de données pour permettre un refactoring sans conséquence, comme on le fait avec le code source ;
- Il faut outiller les processus autour de la base de données afin d'améliorer la productivité des développements et leur industrialisation.

Les outils existants reposent sur les principes suivants :

- Un schéma doit pouvoir être détruit et recréé de manière répétable ;
- La version du schéma doit être identifiable ;
- La montée et la descente de version doivent être automatisées ;
- Les changements appliqués doivent être connus ;
- Un changement doit pouvoir être défait ou annulé ;
- Un changement précédemment appliqué ne doit pas être modifié mais un nouveau changement doit être créé.

## Principes techniques

Sur le plan technique, le fonctionnement des outils de migration est simple. Ils se basent sur une table contenant la version de la base de données. La liste des scripts exécutés est conservée ainsi qu’une empreinte de chaque script afin de détecter une altération d’un script déjà exécuté.

A chaque lancement, l’outil de migration compare la version de la base et les scripts existants et propose la mise à jour le cas échéant.

Il est également possible de "descendre de version" le schéma (fonctionnalité disponible dans quasiment tous les outils). Il s’agit de remettre la base de données dans un état cohérent. Deux cas d’usage :

- développement d’une nouvelle fonctionnalité : il est ainsi possible de créer un script et de l’exécuter plusieurs fois (montée de version, test, modification, descente, puis nouvelle montée de version). La descente de version permet ainsi de faire revenir la base de données dans l’état précédent ;
- Ré-alignement automatique du schéma avec le code quand la version de la base de données n’est plus la bonne. Ce cas intervient quand il faut corriger un bug sur la version de production ou au passage à une autre branche de développement, ou encore quand un script a été exécuté puis modifié.

Même si la descente de version est utile, elle a néanmoins deux inconvénients. Le premier est que les instructions de descente doivent être écrites à la main. Les outils les plus simples fonctionnent sur le principe où chaque script contient une partie montée de version et une partie descente (voir l’exemple plus bas avec MyBatis). Seul Liquibase est capable de générer les instructions de descente de version grâce à son DSL.

Le deuxième inconvénient est que certaines montées de version ne sont pas réversibles (suppression de table ou de données). Dans ce cas, la descente ne sera possible que jusqu'à la version incluant ce type de modification. L'alternative est de recréer le schéma de zéro, une fonctionnalité que tous les outils proposent et qui est en fin de compte très rapide.

## Bonnes pratiques

Les bonnes pratiques poussées par ces outils sont :

- Scripts (SQL ou XML pour Liquibase) stockés avec le code source
- Une base de données par développeur (réaliste quand la gestion de la DB est automatisée, hors problème de coût de licence) ;
- Une base de données commune à l’équipe qui représente l’état complet et stable ;
- L’intégration continue déroule l’ensemble des scripts à chaque livraison ;
- Un script qui a déjà pu être exécuté ne doit plus être modifié. On risque sinon de désynchroniser les scripts et le schéma. La livraison d’un nouveau script est nécessaire dans ce cas. Ce script est un refactoring du précédent. La seule exception est un script buggé qui provoque la perte de la donnée. Il ne faut donc pas que ce script atteigne les autres environnements.

## Les outils existants

### Liquibase : puissant mais complexe

[Liquibase](http://liquibase.org/) est le plus connu des outils de migration de base de données. Il se base sur les patterns décrits dans le livre "Refactoring database". À ce titre, il est conçu autour d’une approche théorique par pattern de refactoring.

Le noyau de Liquibase est son DSL basé sur XML qui a les avantages :

- d’être compatible avec plusieurs moteurs SQL ;
- de donner une sémantique aux opérations (on écrira un &lt;renameColumn&gt; plutôt qu’un alter table) ;
- de générer automatique des instructions de rollback (par exemple, un &lt;createColumn&gt; sera compensé par un &lt;dropColumn&gt;).

Liquibase est complet. Il s’intègre à Maven, Grails, Spring et Hibernate et supporte la génération de documentation ou encore la création d’un diff entre schémas.

L’inconvénient principal de Liquibase est une certaine complexité qui ne se retrouve pas dans les autres outils (XML, notion de changelog et de changeset, versionning sur id/auteur/chemin). La courbe d'apprentissage est donc plus élevée que les autres outils se basant purement sur du SQL.

Exemple de changeSet Liquibase :

```xml
<changeSet id="1" author="bob">
 <createTable tableName="department">
  <column name="id" type="int">
   <constraints primaryKey="true" nullable="false"/>
  </column>
  <column name="name" type="varchar(50)"/>
 </createTable>
</changeSet>
```

### Les pragmatiques

D’autres outils ne vont pas aussi loin que Liquibase en termes de fonctionnalités et d'abstraction, mais leur approche est pragmatique et plus simple. Ils visent avant tout à automatiser la gestion des scripts SQL. Les principaux sont [MyBatis Schema Migration](http://www.mybatis.org/java.html), [DbMaintain](http://dbmaintain.sourceforge.net/) et [C5 DB Migration](http://code.google.com/p/c5-db-migration/).

Le principe de ces outils est assez simple et consiste à lancer une série de scripts stockés dans une arborescence répartie en version. Les actions sont tracées ce qui permet de connaître l’état du schéma.

Exemple d’arborescence organisée pour DbMaintain :

```
scripts/01_v1.0/01_products_and_orders.sql
                02_users.sql
        02_v1.1/01_add_barcode_column.sql
                02_drop_itemcode_column.sql
```

Le schéma de base de données est mis à jour en exécutant :

```bash
dbmaintain.sh update chemin/vers/les/scripts
```

Dans le cas de MyBatis, les instructions de montée et de descente de version sont écrites dans le même script SQL.
Exemple :

```sql
--// create product table
CREATE TABLE PRODUCT (ID INT, NAME VARCHAR(255));

--//@UNDO
DROP TABLE PRODUCT;
```

## Conclusion

Les outils de migration de base de données permettent une meilleure productivité en levant certaines barrières au changement du schéma des données et ils rendent l'industrialisation accessible.

Les points clés à retenir sont :

- Les outils de migration de bases de données nous permettent de gagner en efficacité lors de la manipulation du schéma de la base de données ;
- Ces outils fiabilisent les traitements en les automatisant et en les intégrants à l’usine de développement ;
- Ces outils apportent de bonnes pratiques permettant un travail en équipe plus efficace ;
- Ces outils sont disponibles, simples à mettre en place et OpenSource.

Par extension, on peut imaginer qu'une application puisse se mettre à jour d'elle-même. En effet, il s’agirait de permettre à l’application de lancer les migrations de schémas quand elle démarre. Cette fonctionnalité réduit le temps de mise en production en supprimant l’étape de passage des scripts par les DBA. Liquibase propose déjà cette fonctionnalité.
