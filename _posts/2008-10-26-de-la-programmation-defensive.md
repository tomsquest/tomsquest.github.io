---
title: "De la programmation défensive"
slug: de-la-programmation-defensive
date: 2008-10-26T00:00:00Z
---

Vous aviez développé un nouveau service. Les interfaces et les données échangées étaient définies. Vous étiez optimiste, vous connaissiez bien le client. Malheureusement celui-ci utilisait de temps en temps mal votre API, vous fournissant des paramètres invalides. Vous voilà en train de corrompre l'intégrité de vos données. Pourtant même la Javadoc précisait le format des données. Avez-vous été trop optimiste ? Et votre code, comment aurait-il dû réagir ? Est-ce votre faute ou celle du client ?

Se prémunir de l'usage incorrecte de son code fait partie de ce que l'on nomme la **programmation défensive**. On pourrait parler de codage « pessimiste ». C'est une façon de penser son code de façon à éliminer le maximum de problèmes venant de l'extérieur. On retrouve ce concept en Java sous le terme « d'[Assertions](http://java.sun.com/j2se/1.4.2/docs/guide/lang/assert.html) ». Une assertion est une condition qui doit être vraie pour pouvoir continuer le déroulement du programme.

Exemple d'assertion en java :

```java
public void print(String message) {
    assert message != null : "Erreur : message est null";
    System.out.println(message);
}
```

## Pré et Post conditions

Les assertions peuvent servir de pré-conditions et de post-conditions.

Une pré-condition permet de garantir que le code ne se poursuivra pas si certaines conditions ne sont pas remplies. Elles sont placées au début de la méthode. C'est la manière la plus courante de programmer défensivement. Le mot d'ordre ici est de dire : « Je n'accepte que ce que j'ai définit. Je m'arrête si je suis victime d'un appel incorrect ».

Une utilisation beaucoup plus rare est l'usage des assertions en tant que post-conditions. Celles-ci permettent de garantir que vous remplissez votre contrat du point de vue du client. Elles sont souvent placées à la sortie de la méthode. Par exemple, vous assurez à votre client que votre méthode de retournera jamais une liste vide.

```java
public List<String> filter(List<Strin> mails) {
    assert myList != null : "Erreur : liste null";
    return myList;
}
```

## Mais les assertions sont désactivables !

En java, au moment de la compilation, la présence d'un flag permet de déclarer si oui ou non le code embarquera les assertions. Alors à quoi beau peaufiner ses assertions si elles ne sont pas actives tout le temps ?

<img src="/assets/images/posts/2008/10/thepragmaticprogrammerfromjourneymantomaster.jpg" style="float:right"/>

Dans le livre « [The Pragmatic Programmer](http://www.amazon.fr/Pragmatic-Programmer-Journeyman-Master/dp/020161622X/) », les auteurs expliquent que les concepteurs du langage Java ont permis de désactiver les assertions pour deux raisons :

- les assertions sont une fonctionnalité de débugage. Une fois que le code a été testé et livré, les assertions ne sont plus nécessaires ;
- les assertions ajoutent de la charge au programme car il faut vérifier des choses qui ne devraient jamais arriver.

Les auteurs pensent que ces idées sont fausses et trop optimistes car :

- Les tests ne permettent jamais de trouver tous les bugs ;
- Le monde extérieur est dangereux et vous ne maitrisez pas ce que font vos clients.

Conclusion : Laissez vos assertions activées !

## Des solutions

Les deux projets ci-dessous répondent au même problème. Ils offrent la possibilité d'écrire ses assertions de manière simple et puissante.

### FEST-Assert

[FEST-Assert](http://fest.easytesting.org/assert/) est mon projet préféré car :

- Il est très simple à comprendre;
- Il propose une interface « fluent ». Cela revient à écrire l'équivalent d'une phrase au lieu d'enchainer les méthodes;
- Il est extensible. Il est possible de créer ses propres assertions, donc pourquoi pas des assertions métier.

L'exemple du site donne un bon aperçu :

```java
assertThat(yoda) //
  .isInstanceOf(Jedi.class)//
  .isEqualTo(foundJedi) //
  .isNotEqualTo(possibleSith);
```

### Hamcrest

[Hamcrest](http://code.google.com/p/hamcrest/) est dans la même veine que FEST-Assert. JUnit4 l'intègre en proposant la méthode « assertThat ». Il semble pourtant d'un usage qui n'est pas limité aux assertions.

Exemple :

```java
assertThat(theBiscuit, equalTo(myBiscuit));
```

Il existe dans différents langages : Java, Php, C++, Python, Objective-C. C'est en réalité un framework permettant de développer des « Matcher ». Plusieurs extensions existent. Par exemple, [Hamcrest-text-patterns](http://code.google.com/p/hamcrest-text-patterns/) permet d'écrire des expressions régulières de manière lisible. Ou encore [Hamcrest-collections](http://code.google.com/p/hamcrest-collections/) qui permet de filtrer des collections :

```java
smiths = select(people, where(Person.class).getLastName(), equalToIgnoringCase("smith"));
```

## Conclusion

Adoptez un style de programmation défensif permet d'obtenir un code plus sûr et résistant. Les assertions permettent d'arrêter au plus tôt l'exécution du programme.

### Ce concept de « Fail Fast » a plusieurs avantages :

- C'est une protection pour le code sous-jacent : moins de variations dans la paramètres donne moins de possibilité de bug ;
- Les assertions fournissent de l'information. En effet, l'exception qui est lancée, informe du paramètre fautif et de qui en est le responsable ;
- Le code est plus compréhensible car il déclare les plages de valeurs. Par exemple, il est souvent rageant de ne pas savoir si un paramètre est nullable (et vivement l'annotation @NotNull des JSR 303/305).

### Pourtant les assertions ont des inconvénients :

- Elles sont redondantes avec la Javadoc : l'usage d'assertions ne permet pas de se passer de documentation pour décrire ce que vous attendez comme paramètre. Potentiellement, il peut y avoir une désynchronisation entre ce qui est précisé dans la Javadoc et la réalité du code ;
- Elles sont encombrantes : écrire une liste d'assertion en début de chaque méthode peut rendre le code peu lisible et potentiellement cacher le code « utile » ;
- Elles doivent être utilisées avec modération : théoriquement, chaque méthode doit avoir ses assertions. Dans la pratique, il n'y a pas besoin d'être un pessimiste extrémiste. Si vous avez une grande maitrise du code, les assertions peuvent être limitées. Dans la pratique, on les placera par exemple aux points d'entrées tels que les méthodes publiques visibles de l'extérieur ;
- Elles ne remplaceront jamais les tests.

Vous l'avez compris, je suis un partisan de la programmation défensive. J'en discuté récemment avec un ami qui me disait que pour lui, c'était une condition de survie. Il travaille sur des projets souvent mal codés et peu documentés. Il est obligé d'être pessimiste et cette démarche permet à son code de fonctionner sereinement et d'être déterministe dans un milieu presque chaotique (ou « bordélique » si vous préférez). Et vous, êtes-vous optimiste ou pessimiste ?
