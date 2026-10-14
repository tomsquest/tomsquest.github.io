---
title: "ClearCase : changer le comparateur de fichier"
description: "Remplacer le comparateur de fichiers de ClearCase par WinMerge en modifiant le fichier map, pour les fichiers texte, HTML et XML."
lang: fr
locale: fr_FR
---

L'astuce du jour est : "se passer de ClearCase pour comparer les fichiers".

[ClearCase](http://www-01.ibm.com/software/awdtools/clearcase/) permet de comparer les différences entre les versions de fichier avec ses propres outils.
Mais les comparateurs proposés par défaut de ClearCase ne sont pas les meilleurs. Il y a des outils plus souples comme [WinMerge](http://winmerge.org/).

## Comment faire ?

Pour associer tous les fichiers texte (Java et autres) avec WinMerge, il suffit d'éditer le fichier `$CLEARCASE_HOME\Rational\ClearCase\lib\mgrs\map` et de remplacer :

```
text_file_delta xcompare    ..\..\bin\cleardiffmrg.exe
```

par :

```
text_file_delta xcompare    D:\Softs\WinMerge\WinMerge.exe
```

Ce qui donne avant et après :

![Comparaison d'un pom.xml avec l'outil XML Diff Merge de ClearCase](/assets/images/posts/2008-12-30-clearcase-changer-le-comparateur-de-fichier/clearcase_compare_xml.jpg)

![Comparaison du même pom.xml avec WinMerge](/assets/images/posts/2008-12-30-clearcase-changer-le-comparateur-de-fichier/winmerge_compare_xml.jpg)

Les autres formats de fichier comme le HTML et le XML peuvent être également modifiés.
Il suffit de remplacer les lignes qui contiennent "xcompare".
Exemple :

```
_xml    xcompare    ..\..\bin\xmldiffmrg.exe
```

Bonne année 2009 !
