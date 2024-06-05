--- 
title: "JPA : les illusions sur les NamedQueries"
slug: jpa-les-illusions-sur-les-namedqueries
date: 2010-03-28T00:00:00Z
---

Un certain nombre d'idées reçues existent sur les NamedQueries. On les dit plus performantes car mises en cache, on les dit plus sûres car validées au chargement. Etudions ces points et regardons quels sont les réels avantages des NamedQueries.

## Rappel sur les NamedQueries

Une NamedQuery est une requête nommée. Ce n'est pas une nouveauté de la norme JPA car elles existaient dans Hibernate bien avant. Une namedQuery est un moyen de donner un non à une requête JPQL et de la rappeler par ce nom par la suite.

Création :

```java
@Entity
@NamedQuery(name = "findAllCustomers", query = "Select c From Customers c")
public class Client {
  ...
}
```

Utilisation :

```java
public List findAll() {
  return entityManager.createNamedQuery("findAllCustomers").getResultList();
}
```

## Une NamedQuery est plus performante

La rumeur dit qu'une NamedQuery est plus performante car elle est mise en cache.

Techniquement, au démarrage, le moteur JPA va compiler la NamedQuery puis la mettre en cache dans le statementCache des Connections. Cela rappelle fortement les PreparedStatement, non ? Or, Hibernate utilise de toute façon des PreparedStatements si le driver Jdbc le permet. Une NamedQuery ne fait donc pas mieux qu'une requête dynamique, même s'il y a le coût de parsing de la requête si celle-ci est dynamique.

Je n'ai pas trouvé de benchmark entre les deux approches (NamedQuery versus requête dynamique). La principale variable en jeu est le driver Jdbc et donc la base de données utilisée.

## Une NamedQuery est validée

Une NamedQuery est validée au lancement de l'application avant d'être soit placée dans le statementCache. Cela permet théoriquement de contrôler la syntaxe JPQL, que le mapping est correct, que les entités utilisées sont annotées et que les colonnes ont bien un attribut (ou un getter/setter) dans les entités.

Dans les faits, cette phase de validation est très limitée (testée avec Hibernate 3.3 et mysql) :

* Pour une entité inexistante ("From EntiteInexistante"), une erreur est remontée
* Pour une colonne inexistante ("From Client where colonneInexistante is null"), aucune erreur n'est soulevée

Aujourd'hui, je ne vois donc pas en quoi cette phase de validation apporte de la valeur. Si la conversion JPQL vers SQL n'est pas complète, elle n'empêche pas de valider les requêtes sur [la base de données cible](http://www.tomsquest.com/blog/2009/10/tests-d-integration-quid-de-la-base-de-donnees/).

## NamedQuery, alors pourquoi ?

Une fois éliminées ces illusions, il ne reste pas grand-chose d'attrayant aux NamedQueries. On sait qu'elles ne sont pas systématiquement pas plus performantes et que la validation n'est pas complète. Il leur reste cependant trois petits avantages :

* Les NamedQueries sont réutilisables en plusieurs endroits. Ce cas est principalement utile quand l'entityManager est injecté dans la couche de service (et donc qu'il n'y a pas de couche de DAO) ;
* Elles sont chargées au démarrage ce qui permet de diminuer la réponse de l'application au premier accès, mais c'est au détriment du temps de chargement de l'application ;
* Les requêtes sont regroupées avec le mapping (@Column...), ce qui permet de faciliter leur écriture.

Pour conclure, je pense que les NamedQueries résultent plus d'une question de goût et de convention d'écriture que d'un réel intérêt technique et factuel.
