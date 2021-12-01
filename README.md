# Flower End-To-End tests

This project is based on [Codeceptjs](https://codecept.io/) 2.1.4

## Prerequisites

* Install Nodejs
* Install NPM

End-To-End tests require a Flower installation with a scope named E2E.

## To start

* Clone the project
* Go into `e2e` folder
* Initialize NPM dependencies : `npm install`
* Launch tests :
    * Launch all test steps : `npx codeceptjs run --steps`
    * Launch tests filtered by tag : `npx codeceptjs run --steps  --grep gec`

### On a Ubuntu server

sudo apt-get install libxss1
sudo apt-get install libasound2
sudo apt-get install libatk-bridge2.0-0
sudo apt-get install libgtk-3-0

 ./node_modules/.bin/codeceptjs run --grep gec -c int.codecept.conf.js --steps --plugins allure


## IDE

Il est préférable de développer sur ce projet à l'aide d'un IDE compatible avec TypeScript comme par exemple Visual Studio Code.

Pour que l'IDE soit capable de voir les définitions d'objet, il est nécessaire de rajouter en haut des tests : `//<reference path="./steps.d.ts" />`

Pour mettre à jour ce fichier de définitions, lancer la commande : `npx codeceptjs def`


## Allure

* Commencer par installer allure avec la commande `npm install allure-commandline`
* Lancer les tests avec le paramètre `--plugins allure`
* Lancer allure `allure serve output`# codecept
 
#test