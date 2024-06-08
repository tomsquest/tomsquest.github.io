---
title: Configurer Quartz sur un Cluster
lang: fr
---

<img src="/assets/images/posts/2008/11/quartz_logo.jpg" style="float:right"/>

[Quartz](http://www.opensymphony.com/quartz/) est un scheduler. Il permet de lancer des Job à intervalles spécifiés ou un jour donné. Par exemple, il peut être utiliser pour réaliser des calculs à une heure où la charge serveur est faible.

Nous allons pousser un peu l'usage de Quartz pour que celui-ci fonctionne sur un Cluster. Cette configuration a l'avantage de permettre de faire du Fail-Over : si un noeud du Cluster tombe, un autre prend le relais.

Cette configuration pourrait paraître facultative mais elle est en réalité obligatoire dés que votre application est déployée sur plusieurs noeuds. En effet, comment s'assurer que chaque JVM ne démarre pas son propre Quartz ? Ainsi les scheduler ne doivent pas tous démarrer mais un seul doit être actif au même moment.

Nous sommes passés par plusieurs problèmes avec cette configuration. Je détaille ci-dessous ce qui a fonctionné pour nous. Je n'explique pas les notions de base de Quartz (trigger, calendar et job).

## Principes et problèmes de Quartz en Cluster

Quartz s'intègre assez facilement dans une config Spring. Il faut indiquer à Quartz de s'enregistrer en base de données et de prendre le Lock afin d'empêcher un autre Quartz de démarrer.

Quartz a donc besoin de tables dans votre base de données pour qu'il puisse y mettre ses données. De cette façon si un noeud tombe, le suivant pourra reprendre là où l'autre s'est arrêté. Les scripts SQL sont livrés dans la distribution de Quartz.

Nous avons rencontrés les problèmes suivants :

### Impossible de sérialiser la config en base de données, erreur au lancement

Utilisez de bons drivers SQL ! Pour nous, c'était passage au driver JDBC de Microsoft (v1.2) car ceux fournis avec WebSphere plantent sur les Blobs.

### Impossible de modifier la config de Quartz, l'ancienne est toujours prise en compte même après redéploiement

Il faut repasser les scripts qui créent les tables Quartz pour vider entièrement la config sérialisée en base. Il faut faire cela à chaque modification des calendars ou des triggers Quartz.

### Quartz ne prend pas le Lock (donc plusieurs Quartz tournent...)

Bien vérifier s'il n'y a pas un problème avec la requête d'acquisition du lock. Un message sur le forum Spring nous a sauvé sur ce coup là. Cela semble corriger dans la version 1.6.1. Je vous conseille fortement d'utiliser la toute dernière version car il y a eu un nombre important de bugs corrigés entre la 1.6.0 et la 1.6.1 par exemple.

## Config Spring de Quartz

L'exemple est tiré d'une configuration dont la base de données cible est un SQL Server. Il y a quelques changements pour une autre base de données mais rien de très compliqué.

```xml
<bean id="schedulerFactoryBean" class="org.springframework.scheduling.quartz.SchedulerFactoryBean" >
    <property name="dataSource" ref="dataSource" />
    <property name="quartzProperties">
        <props>
            <prop key="org.quartz.scheduler.instanceName">AUTO</prop>
            <prop key="org.quartz.threadPool.class">org.quartz.simpl.SimpleThreadPool</prop>
            <prop key="org.quartz.jobStore.isClustered">true</prop>
            <prop key="org.quartz.threadPool.threadCount">2</prop>
            <prop key="org.quartz.jobStore.driverDelegateClass">org.quartz.impl.jdbcjobstore.MSSQLDelegate</prop>
            <!--
                Avoid Sql Server error 'FOR UPDATE clause allowed only for DECLARE CURSOR'
                http://forum.springframework.org/archive/index.php/t-14033.html
            -->
            <prop key="org.quartz.jobStore.selectWithLockSQL">SELECT * FROM {0}LOCKS UPDLOCK WHERE LOCK_NAME = ?</prop>
        </props>
    </property>
    <!-- During startup, will update existing jobs -->
    <property name="overwriteExistingJobs" value="true" />
    <property name="calendars">
        <map>
            <entry key="excludeWeekendsCalendar">
                <ref bean="excludeWeekendsCalendar" />
            </entry>
        </map>
    </property>
    <property name="triggers">
        <list>
            <ref bean="myTrigger"/>
        </list>
    </property>
    <!-- Register spring beans which will be injected in jobs -->
    <property name="schedulerContextAsMap">
        <map>
            <entry key="myService">
                <ref bean="myService"/>
            </entry>
        </map>
    </property>
</bean>

<!-- CALENDARS -->
<bean id="excludeWeekendsCalendar" class="org.quartz.impl.calendar.WeeklyCalendar" />

<!-- TRIGGERS -->
<bean id="myTrigger" class="org.springframework.scheduling.quartz.CronTriggerBean">
    <property name="name" value="myTrigger"/>
    <property name="jobDetail" ref="myJob"/>
    <property name="calendarName" value="excludeWeekendsCalendar" />
</bean>

<!-- JOBS -->
<bean name="myJob" class="org.springframework.scheduling.quartz.JobDetailBean">
    <property name="jobClass" value="com.tomsquest.quartz.MyJob" />
</bean>
```

## Pour conclure

Quartz est "intriguant". Sur une seule machine, il est simple à mettre en oeuvre, grâce à Spring. Mais dés qu'on a des contraintes plus importantes, comme le fonctionnement dans un Cluster, les difficultés surgissent. Nous avons beaucoup bataillé avec ce projet mais la solution actuelle fonctionne parfaitement. Comme quoi, un peu de sueur dans les rouages et ça schedule...
