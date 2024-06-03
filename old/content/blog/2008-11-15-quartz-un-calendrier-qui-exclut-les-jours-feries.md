--- 
title: "Quartz : un calendrier qui exclut les jours fériés"
slug: quartz-un-calendrier-qui-exclut-les-jours-feries
date: 2008-11-15T00:00:00Z
---

<img src="/img/posts/2008/11/quartz_logo.jpg" style="float:right"/>

L'idée part d'un besoin simple : lancer un job [Quartz](http://www.opensymphony.com/quartz/) toutes les heures ouvrées, hors week-end et jours fériés.

Pas très compliqué, mais il y a quelques `trucs` à savoir, notamment sur l'enchainement des calendriers.

## Les jours fériés

Il existe différents algorithmes pour calculer les jours fériés et ils sont moyennement compliqués. Mais il faut quand même un calendrier pour tester l'algo. Et bien sûr, si le client veut exclure un jour férié (pourquoi pas ?), il faudra maintenir une liste des jours exclus.

La méthode retenue : mettre en dur les jours fériés pour les 20 prochaines années ! `Si l'application survit jusque là, ça sera une sacré prouesse.`

La liste des jours fériés est "hardcodées" dans un fichier de conf du projet. Ce fichier est lu par la conf Spring à l'aide d'un [PropertyPlaceHolderConfigurer](http://static.springframework.org/spring/docs/2.0.x/api/org/springframework/beans/factory/config/PropertyPlaceholderConfigurer.html).

Cela donne quelque chose comme ça pour 2008 :

``` js
workingDays.legalHolidays=2008-01-01,2008-03-21,2008-03-24,2008-05-01,2008-05-08,2008-05-12,2008-07-14,2008-08-15,2008-11-11,2008-12-25
```

## Configuration Spring

Au total, il y aura trois calendriers :

* Un qui exclut les week-ends (fourni avec Quartz) ;
* Un qui exclut une plage horaire (fourni avec Quartz) ;
* Un "fait-maison" qui exclut une plage de dates fournie en paramètre.

Ces calendriers sont configurés pour être enchainés les uns aux autres. Techniquement, chaque calendrier se voit injecter dans son constructeur un autre calendrier. Ainsi chacun demande à son suivant si la date actuelle doit être exclue ou non. C'est une fonctionnalité de base des calendriers Quartz.

Dans la config Spring, cela donne :

``` xml
<bean id="excludeWeekendsCalendar" class="org.quartz.impl.calendar.WeeklyCalendar" />

<bean id="workingDaysCalendar" class="com.tomsquest.quartz.MultiDateCalendar">
    <constructor-arg ref="excludeWeekendsCalendar" />
    <constructor-arg value="${workingDays.legalHolidays}" />
</bean>

<bean id="workingHoursCalendar" class="org.quartz.impl.calendar.DailyCalendar">
    <constructor-arg ref="workingDaysCalendar" />
    <constructor-arg value="09:00" type="java.lang.String" />
    <constructor-arg value="18:00" type="java.lang.String" />
    <!-- include hours between start and end -->
    <property name="invertTimeRange" value="true" />
</bean>
```

## Le calendrier "multi-dates"

Cette classe est un calendrier au sens Quartz. Il exclut une liste de dates passées en paramètre sous la forme d'une String, comme celle spécifiée plus haut (ie. 2008-01-01,2008-03-21).

Il est utilisé dans la config Spring pour exclure les jours fériés.

``` java
package com.tomsquest.quartz;

import java.util.Date;
import java.util.TimeZone;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;

import org.quartz.Calendar;
import org.quartz.impl.calendar.HolidayCalendar;

import com.tomsquest.DateConverter;
import com.tomsquest.Assert;

/**
 * Manage a list of excluded Dates
 */
public class MultiDateCalendar extends HolidayCalendar {

    public MultiDateCalendar() {
    }

    public MultiDateCalendar(Calendar baseCalendar) {
        super(baseCalendar);
    }

    public MultiDateCalendar(TimeZone timeZone) {
        super(timeZone);
    }

    public MultiDateCalendar(Calendar baseCalendar, TimeZone timeZone) {
        super(baseCalendar, timeZone);
    }

    /**
     * Construct a calendar which exclude the specified dates
     *
     * @param dates
     *            a list of dates separated by comma. The string format should be
     *            {@link DateConverter.ISO_DATE_PATTERN}. For example : 2008-31-01,2009-31-01
     */
    public MultiDateCalendar(String dates) {
        this(null, dates);
    }

    /**
     * Construct a calendar which exclude the specified dates
     *
     * @param baseCalendar
     *            the base calendar which will be linked to this one. Can be null
     * @param dates
     *            A list of dates separated by comma. The string format should be
     *            {@link DateConverter.ISO_DATE_PATTERN}. For example : 2008-31-01,2009-31-01.
     *            Required (non empty).
     */
    public MultiDateCalendar(Calendar baseCalendar, String stringDates) {
        super(baseCalendar);

        Assert.isNotBlank("stringDates", stringDates);

        // Parse the strings as dates
        String[] stringDatesArray = StringUtils.split(stringDates, ",");
        Date[] dates = DateConverter.getDatesFromStrings(stringDatesArray,
                DateConverter.ISO_DATE_PATTERN, DateConverter.DEFAULT_LOCALE);

        if (dates != null && dates.length == stringDatesArray.length) {
            if (logger.isDebugEnabled())
                logger.debug("Excluded dates : " + ArrayUtils.toString(dates));

            addExcludedDates(dates);
        } else {
            // Some dates were invalids (unparseables)
            throw new IllegalArgumentException(
                    "Some configured dates were invalids (not parseable as "
                            + DateConverter.ISO_DATE_PATTERN + "). Full list of configured dates{"
                            + stringDates + "} valid dates" + ArrayUtils.toString(dates));
        }
    }

    /**
     * Read legalHolidays variable and add all found dates to the list of excluded dates in
     * excludeLegalHolidays. Will not try to add an unparseable date, instead skip it.
     */
    private void addExcludedDates(Date[] dates) {
        for (int i = 0; i < dates.length; i++) {
            Date legalHoliday = dates[i];
            addExcludedDate(legalHoliday);
        }
    }
}
```
