--- 
title: "A la découverte des Components Hibernate"
slug: a-la-decouverte-des-components-hibernate
date: 2008-11-28T00:00:00Z
---

<img src="/assets/images/posts/2008/11/hibernate_logo.gif" style="float:right"/>

Plusieurs années avec Hibernate et j'apprends une de ses fonctionnalités de base : les [Components](http://www.hibernate.org/hib_docs/v3/reference/en/html_single/#mapping-declaration-component). Ceux-ci permettent de mapper plusieurs objets dans une même table.

## Exemple 

Prenons ces deux classes :

![](/assets/images/posts/2008/11/diag_classes2.jpg)

Et mappons-les dans une même table :

![](/assets/images/posts/2008/11/diag_db2.jpg)

Le mapping Hibernate devient :

``` xml
<hibernate-mapping package="com.tomsquest">
    <class name="Person" table="t_person">
        <id name="id" column="id">
            <generator class="identity" />
        </id>

        <property name="lastname" />
        <property name="firstname" />

        <!-- le fameux Component -->
        <component name="address" class="com.tomsquest.Address">
            <parent name="person"/>
            <property name="street" column="street" />
            <property name="city" column="city" />
        </component>
    </class>
</hibernate-mapping>
```
## Trois points à voir :

* Côté code, si toutes les colonnes du Component sont nulles alors **l'objet n'est pas créé**. C'est-à-dire que `Person.getAddress()` retournera null ;
* Un component peut contenir des données plus complexes comme des collections ou des références à d'autres objets ;
* Il n'est pas possible pour plusieurs objets de pointer vers un même Component. Dans notre cas, ce serait plusieurs personnes pointant vers une même adresse.

Si vous voulez aller plus loin, il existe les Dynamic Component. Hibernate offre la possibilité de mapper des colonnes dans une Map. C'est à voir sur [cette page](http://www.hibernate.org/hib_docs/v3/reference/en/html_single/#components-dynamic).
