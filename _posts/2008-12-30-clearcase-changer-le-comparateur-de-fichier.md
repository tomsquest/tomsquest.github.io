---
title: "ClearCase : changer le comparateur de fichier"
lang: fr
---

L'astuce du jour est : "se passer de ClearCase pour comparer les fichiers".

[ClearCase](http://www-01.ibm.com/software/awdtools/clearcase/) permet de comparer les différences entres les versions de fichier avec ses propres outils.
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

![](/assets/images/posts/2008/12/clearcase_compare_xml.jpg)

![](/assets/images/posts/2008/12/winmerge_compare_xml.jpg)

Les autres formats de fichier comme le HTML et le XML peuvent être également modifiés.
Il suffit de remplacer les lignes qui contiennent "xcompare".
Exemple :

```
_xml    xcompare    ..\..\bin\xmldiffmrg.exe
```

Bonne année 2009 !
