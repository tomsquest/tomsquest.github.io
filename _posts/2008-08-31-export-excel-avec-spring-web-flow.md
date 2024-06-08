---
title: Export Excel avec Spring Web Flow
slug: export-excel-avec-spring-web-flow
lang: fr
---

<img src="/assets/images/posts/spring-webflow-logo.jpg" style="float:right"/>

[Spring Web Flow](http://www.springframework.org/webflow) s'intègre à merveille à Spring MVC pour l'enchaînement des pages. Son rôle essentiel est de sortir la logique de navigation des contrôleurs.

Nous utilisons depuis quelques mois la version 1 de Spring Web Flow et c'est sur cette version que nous allons répondre à la question :

Comment générer un fichier Excel depuis une Action Spring Web Flow ?

## Procédure

### 1 - Déclarer la vue d'export

```xml
<view-state id="exportView">
    <render-actions>
        <action bean="exportAction" method="export" />
    </render-actions>
</view-state>
```

Il est important de remarquer que le view-state `V_export` n'a pas de propriété `view`. En effet, il suffit d'ignorer cette valeur car c'est le fichier Excel qui correspond à la vue.

### 2 - Action d'export

La création du fichier Excel peut être réalisé par différentes méthodes. Une des plus simples est d'utiliser [POI](http://poi.apache.org/) pour le faire.

Ci-dessous la méthode `export` de la classe `ExportAction` :

```java
public Event export(RequestContext context) throws Exception {
    HSSFWorkbook workbook = new HSSFWorkbook();
    buildExcelDocument(workbook, context);

    HttpServletResponse response = WebFlowUtils.getResponse(context);
    response.addHeader("Content-Disposition", "attachment; filename=search.xls");
    response.setContentType("application/vnd.ms-excel; charset=cp1252");

    ServletOutputStream out = response.getOutputStream();
    workbook.write(out);
    out.flush();

    return success();
}
```

La méthode `buildExcelDocument()` se charge de créer le fichier Excel et utilise pour cela l'API de POI. Le détail n'est pas montré ici.

Deux choses à remarquer :

- Le nom du fichier est donnée dans le header "Content-Disposition" ;
- Le charset CP1252 est utilisé pour forcer Excel à lire correctement les caractères spéciaux comme les accents.

### 3 - Intégration à une vue existante

Exemple d'intégration à une vue existante :

```xml
<view-state id="usersView" view="users">
    <transition on="export" to="exportView"/>
</view-state>
```

## Conclusion

Nous avons vu comment exporter un fichier Excel à partir d'une vue classique Spring Web Flow. La méthode est exactement la même pour un export PDF ou de toute autre type.

### Classe WebFlowUtils

```java
package utils;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.webflow.context.servlet.ServletExternalContext;
import org.springframework.webflow.execution.RequestContext;

public class WebFlowUtils {

    public static HttpServletRequest getRequest(RequestContext context) {
        ServletExternalContext externalContext = (ServletExternalContext) context
                .getExternalContext();
        return externalContext.getRequest();
    }

    public static HttpServletResponse getResponse(RequestContext context) {
        ServletExternalContext externalContext = (ServletExternalContext) context
                .getExternalContext();

        return externalContext.getResponse();
    }
}
```
