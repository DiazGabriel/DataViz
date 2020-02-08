### Méthodo utilisé 

## Pré traitement du CSV

Pour ma part j'ai utilisé les fichiers client (concaténer dans un même CSV)
je n'ai traiter que les lignes 2eme voiture = true


1. J'ai charger le fichier sur R pour enlever les lignes 2eme voiture = false
	accèle les lecture du fichier car moins de ligne à traiter (25 000 lecture au lieu de 200 000)

# Script R :  

produit <- read.csv("C:/Users/diazg/Desktop/Files/Cours/MIAGE/M2/0_Projet_BigData/dataVis/D3test/Clients.csv", header = TRUE, sep = ";", dec = ".")

install.packages(sqldf)
library(sqldf)

q1 <- "delete from produit where seconde_voiture = 'false'"

sqldf(q1)

produitTrue <- subset(produit, seconde_voiture=='true')

sqldf("select * from produitTrue where seconde_voiture = 'false'")

write.csv(produitTrue, "C:/Users/diazg/Desktop/Files/Cours/MIAGE/M2/0_Projet_BigData/dataVis/D3test/Client_2voiture.csv")

# Fin script R

Deux manières de traiter :
  - Librairie SQLDF : permet d'utiliser SQL
  - methode subset : permet de faire des tri 

Attention : write.csv créer un csv en y rajouter un colonne ID au début; ne pas oublier de la nommer à la main sinon D3 se perd dans les colonnes 


2. Traitement manuel pour le rendre traitable facilement avec D3

NE PAS FAIRE SUR EXCEL (excel formate le CSV à l'ouverture plutôt utiliser un éditeur de texte type sublime text --> ctrl+h pour la suite)

 - Changer les separateurs ; par , 
 - Modifier le nom de colonne "2eme voiture" par "seconde_voiture" (D3 ne comprend pas le "2" au début et l'espace est plus chiant à traiter)
 - Enlever toutes les doubles quotes

 Attention la colonne sexe ne contient pas que des M/F mais aussi Masculin/Homme et Feminin/Femme; les remplacer pour traiter l'ensemble de facon homogène


3. Lecture du CSV sur D3 

d3.csv("https://raw.githubusercontent.com/DiazGabriel/DataViz/master/Gabriel/Clients.csv",  function(error, data) {
  if (error) throw error;

// Le code que vous voulez pour traiter les données

});

Le fichier doit être lu depuis un server web sinon la plupart des navigateurs sortent une erreur 
Je me suis servi de github (Le prof n'aura pas à faire de manip style lancer une base de données à l'ecoute d'un port... comme sa il execute directement l'HTML et sa marche !!)

Attention : Prendre l'URL des données bruts (Aller sur https://github.com/DiazGabriel/DataViz/blob/master/Gabriel/Clients.csv vous comprendrez)


4. Accès aux données 

La fonction de lecture prend 2 arguments : error et data

La variable data contient les données
ex : on veux accèder à la colonne age --> data.age 


