# Test technique pour CALD

Ecrit en TypeScript par Yoann VERMAUT

## Prérequis

* NodeJs v16 ou plus
* Un connexion internet (pour l'installation)

## Installation
Dans le dossier racine du projet, exécuter la commande suivante
```
npm install
```

## Exécution
Dans le dossier racine du projet, exécuter la commande suivante
```
npm run start
```

## Description

Le point d'entrée du projet est le fichier `index.ts`. Il contient la fonction principale et la fonction qui affiche les résultats.
Le reste des fichiers sources se trouve dans les dossiers décris ci-après.

### classes

Ce dossier contient les fichiers des classes implémentées pour réaliser le test
* `child.ts` représente un enfant
* `childrenPool.ts` représente un pool d'enfants
  * La méthode `readFromCsv()` représente l'algorithme qui ingère le contenu du fichier "famille.csv" pour "alimenter" childrenPool
* `creche.ts` représente une crèche
* `crechePool.ts` représente un pool de crèche
  * La méthode `readFromCsv()` représente l'algorithme qui ingère le contenu du fichier "crèche.csv" pour "alimenter" crechePool
* `matchmaker.ts` représente la classe qui exécute les règles d'admission de chaque enfants et valide les critères de sélection pour trouve les crèches appropriées
  * La méthode `execute()` représente l'algorithme qui
    - Indique si l’enfant ne peut pas être pris en charge, ainsi que la raison
    - Si l’enfant est déjà pris en charge, indique l’uuid de la crèche / le nom
    - Si l’enfant peut être pris en charge, indique les crèches pour lesquelles c’est possible :
      * D'abord la meilleure crèche (voir énoncé)
      * Ensuite la / les autres
  * Les résultats de la méthode `execute()` sont récupérés par la fonction `printResults()` se trouvant dans `index.ts` qui se charge de les afficher dans la console.

### inputs

Ce dossier contient les fichiers csv d'entrées, fournis avec l'énoncé du test.

* `creche.csv` : La liste des crèches disponibles
* `familles.csv` : La liste des enfants en demande

### tools

Ce dossier contient des fonctions annexes, utiles au bon fonctionnement du projet

* `parsecsv.ts` : Contient la fonction `parseCsv()` permettant d'interpréter correctement du texte au format CSV