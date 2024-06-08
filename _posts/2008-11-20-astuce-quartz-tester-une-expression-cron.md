---
title: "Astuce Quartz : tester une expression Cron"
lang: fr
---

<img src="/assets/images/posts/2008/11/quartz_logo.jpg" style="float:right"/>

Pour tester rapidement une nouvelle configuration d’un Cron, par exemple "0 \* \* \* \* ?", il suffit d’utiliser la classe CronExpression fournie par Quartz. Celle-ci fournit entre autre la prochaine date de lancement.

Exemple d'utilisation :

```java
import org.quartz.CronExpression;

public class QuartzExpressionTest extends TestCase {

       public void testCronExpression() throws Exception {
               String expression = "0 * * * * ?";
               CronExpression cronExpression = new CronExpression(expression);

               Date d1 = cronExpression.getNextValidTimeAfter(new Date());
               Date d2 = cronExpression.getNextValidTimeAfter(d1);

               System.out.println(d1);
               System.out.println(d2);
       }
}
```

Sortie :

```bash
Fri Nov 14 22:58:00 CET 2008
Fri Nov 14 22:59:00 CET 2008
```
