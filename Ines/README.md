# Parallel Coordinates : ***Etude des potentiels acheteurs d'une seconde voiture***

## 1. Nettoyage des données sur RStudio
> Script:
```
//Chargement des librairies 
library(data.table)
library(tidyverse)

//Chargement des données (les csv Clients et Immatriculations sont concernés)
clients <- as.data.table(read.csv("C://Users//Inès Ramoul//Documents//M2 MBDS//Projet_Big_Data_Analytics//parallel_coordinates//Clients_0.csv", stringsAsFactors = FALSE))
immat <- as.data.table(read.csv("C://Users//Inès Ramoul//Documents//M2 MBDS//Projet_Big_Data_Analytics//data//Immatriculations.csv", stringsAsFactors = FALSE))

//Définition des clés qui lient chaque data table
setkey(clients,immatriculation)
setkey(immat,immatriculation)

//Jointure interne dans la nouvelle table "Resultat
Result <- clients[immat, nomatch=0]

//Suppresion des colonnes inutiles à l'affichage des données
Result$immatriculation <- NULL
Result$nom <- NULL
Result$puissance <- NULL
Result$couleur <- NULL
View(Result)

//Uniformisation des valeurs sur la colonne sexe (Feminin / Masculin) et situationFamiliale (Seul(e) au lieu de Seul/Seule)
Result$sexe[Result$sexe=='Femme'] <- 'Feminin'
Result$sexe[Result$sexe=='Homme'] <- 'Masculin'
Result$sexe[Result$sexe=='F'] <- 'Feminin'
Result$sexe[Result$sexe=='M'] <- 'Masculin'
Result$situationFamiliale[Result$situationFamiliale=='Seule'] <- 'Seul(e)'

//Vérification des différentes valeurs existantes pour les colonnes sexe et situationFamiliale
// car elles sont déterminante pour notre étude et l'affichage de nos données
genres <- unique(Result$sexe)
categories <- unique(Result$situationFamiliale)
View(categories)
View(genres)

//Suppresion des lignes si cellules vides 
Result[complete.cases(Result),]

copyOfRes <- Result
//On sélectionne les lignes de la table comportant uniquement les valeurs mentionnées 
copyOfRes[copyOfRes$situationFamiliale=="En Couple" || copyOfRes$situationFamiliale=="Marie(e)" || copyOfRes$situationFamiliale=="Celibataire" || copyOfRes$situationFamiliale=="Divorcee" || copyOfRes$situationFamiliale=="Seul(e)"]
copyOfRes[copyOfRes$sexe=="Feminin" || copyOfRes$sexe=="Masculin" ]
copyOfRes[copyOfRes$nbEnfantsAcharge!=-1 ]
copyOfRes[copyOfRes$X2eme.voiture=='true']

//Meme chose ici mais plus efficace grace à au package tidyverse
my_copy_data <- as_tibble(copyOfRes)
my_copy_data %>% filter(situationFamiliale == "Marie(e)", situationFamiliale=="En Couple", situationFamiliale=="Divorcee", situationFamiliale=="Seul", situationFamiliale=="Celibataire", sexe=="Masculin", sexe=="Feminin", nbEnfantsAcharge!='?', nbEnfantsAcharge!=-1, copyOfRes$sexe=="Feminin", copyOfRes$sexe=="Masculin",copyOfRes$X2eme.voiture=='true' ) 

//Export des données au format CSV avec une ";" comme séparateur
write.csv2(my_copy_data,"C://Users//Inès Ramoul//Documents//M2 MBDS//Projet_Big_Data_Analytics//parallel_coordinates//copyOfRes.csv")

```
## 2. Lecture du graphe 
[> lancement du projet](https://github.com/DiazGabriel/DataViz#lancement-du-projet)

Pour visualiser ce graphe, lancer la solution comme indiqué dans la page du lien ci-dessus.

## 3. Etude du graphe 

* Survolez les axes pour lire les graduations
* Une fois positionné sur un axe (axe de "Situation familiale") , pour lire plus précisement des données concernant (par exemple les clients mariés)
  il suffit de sélectionner l'intervalle correspondant à la valeur "Marie(e)" sur l'axe dès lors que le curseur se transforme en une croix.
 > Attention : compte tenu du nombre de lignes dans le csv d'entrée, ce filtrage par intervalle de valeurs peut prendre quelques secondes...
 * Les données représentées sur le graphe sont groupées par couleur, chacune correspondant à une situation familiale, ce que facilite sa lecture. 
