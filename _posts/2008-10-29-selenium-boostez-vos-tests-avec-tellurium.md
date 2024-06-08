---
title: "Selenium : Boostez vos tests avec Tellurium"
lang: fr
---

<img src="/assets/images/posts/2008/10/tellurium.png" style="float:right"/>

Au commencement, vous écriviez vos tests Selenium en HTML. Mais cela posait des problèmes : aucune factorisation possible, pas de setUp()/tearDown()...

Puis, vous avez commencé à [écrire vos tests en Java](http://www.tomsquest.com/blog/2008/09/selenium-en-java-demarrage-rapide/) et la vie fut plus belle. Mais cela devint verbeux et vous développiez de plus en plus de code custom pour améliorer vos tests. Et vous vous demandiez comment faire encore mieux...

Enfin, vous découvrez l'arme ultime, ce projet nommé Tellurium qui ne vous rendra certainement pas plus riche ni plus beau mais qui améliorera vos tests Selenium.

Vous l'avez compris, [Tellurium](http://code.google.com/p/aost) est un projet qui vise à améliorer l'écriture de tests Selenium.

Ils le disent eux-mêmes :

> Tellurium is more robust, flexible, modularized, easier to maintain and refactor

Qu'est-ce qu'il y a dans la boite ?

## La possibilité de structurer ses tests

Tellurium offre la possibilité de décrire la structure des éléments d'une page. C'est ce qui est appelé OLM pour « Object To Locator Mapping ».

Sans rentrer trop dans les détails, vous décrivez votre page en associant des identifiants et vous les utilisez ensuite dans vos tests. La séparation de la structure d'une page de ses tests permet de mieux faire évoluer ces derniers en cas de changement d'UI. Je pense qu'il est plus aisé de maintenir des tests écrits de cette façon que de la façon classique qui revient à mettre « tout au même endroit. ».

Exemple de description de la page d'accueil de google.fr :

```
ui.Container(uid: "google_start_page"){
    InputBox(uid: "inputbox", locator: "//input[@title='Google Search']")
    Button(uid: "button", locator: "//input[@name='btnG' and @type='submit']")
}
```

Le TestCase associé :

```java
public class GoogleStartPageJavaTestCase extends TelluriumJavaTestCase {
    protected static NewGoogleStartPage ngsp;
    @BeforeClass
    public static void initUi() {
        ngsp = new NewGoogleStartPage();
        ngsp.defineUi();
    }
    @Test
    public void testGoogleSearch(){
        connectUrl("http://www.google.com");
        ngsp.doGoogleSearch("tellurium selenium Groovy Test");
   }
}
```

## Un DSL pour écrire ses tests en Selenium

Tellurium permet d'écrire les cas de tests directement en utilisant la syntaxe de Selenium.

Exemple :

```
openUrl "http://www.google.com"
type "google_start_page.searchbox", "Tellurium Selenium"
pause 500
click "google_start_page.SubmitButton"
waitForPageToLoad 30000
```

Les avantages sont :

- Une lecture et maintenance plus aisée ;
- Une écriture facilitée, y compris par une personne qui ne connait pas Java. On pourrait un jour imaginer la MOA nous fournir des cas de tests dans ce format. Mais je rêve, non ?

## Support des données de tests

Tellurium propose d'associer des données aux tests. C'est ce que les auteurs nomment « Data Driven Test ». Le moteur se charge de lire les données et les injectent dans les tests. C'est en quelque sorte ce que l'on fait dans les tableaux [FitNesse](http://fitnesse.org/) mais directement intégré au TestCase.

Un jeu de données de test ressemble à ça :

```
# TEST | CATEGORY | SIZE
checkBookList|Fiction|8
checkBookList|SciFi|3
```

## Par où commencer ?

Tellurium posséde un projet de référence pour Eclipse (mais aussi pour IntelliJ Idea et Netbeans) : [http://code.google.com/p/aost/wiki/TelluriumReferenceProjectEclipseSetup](http://code.google.com/p/aost/wiki/TelluriumReferenceProjectEclipseSetup)

Le projet est également mavenisé : [http://code.google.com/p/aost/wiki/MavenHowTo](http://code.google.com/p/aost/wiki/MavenHowTo)

Le plugin Groovy pour Eclipse peut être utile. Il est trouvable ici : [http://dist.codehaus.org/groovy/distributions/update/](http://dist.codehaus.org/groovy/distributions/update/)

## Conclusion

Les quelques tests que j'ai effectués ont parfaitement fonctionné. Je suis parti d'un projet Eclipse vide et en 20 minutes, j'ai pu ajouter les dépendances, déclarer ma première structure de page (en [groovy](http://groovy.codehaus.org/)) et écrire mon premier TestCase. Donc mission accomplie pour moi. Je suis convaincu des avantages de ce projet (DSL, Data Driven, Groovy). Mais il reste un doute sur sa maturité. Donc à tester à petite échelle en premier.
