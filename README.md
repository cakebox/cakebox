## Pourquoi  ? Qui a t'il de différent ?

Car la version principale de Cakebox commence a se faire vieille (et ceci malgré nos commits pour la maintenir en vie), et également car nous avions envie de découvrir de nouvelles technologies dans le domaine du web, c'était l'occasion !

On a donc décidé de refaire complètement l'outil que nous vous mettions a disposition, pour le réécrire + proprement et le rendre + performant. Pour cela nous utilisons [AngularJS](http://angularjs.org/ "AngularJS") pour le rendu, et [Silex](http://silex.sensiolabs.org/ "Silex") pour l'API.

Aperçu:

![Cakebox-light](http://i.imgur.com/eML5KZD.png "Cakebox-light")

## Comment installer Cakebox-light ?

Apres avoir cloné le dépôt, pour installer Cakebox-light il vous avant tout [Composer](https://getcomposer.org/ "Composer") et [NodeJS](http://nodejs.org/ "NodeJS") (Ce dernier fournit le binaire npm).
Requière php 5.4 ou plus.

```
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
```

Debian:
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-lmde

Puis nous aurons besoin de [Bower](http://bower.io/ "Bower")
```
npm install -g bower
```


On peut maintenant installer Cakebox.

```
cd /var/www/
git clone https://github.com/Cakebox/Cakebox-light.git cakebox/
cd ./cakebox/
composer install
bower install # (rajoutez --allow-root en option si vous êtes en root)
```

Pour configurer le repertoire de Cakebox il faut aller dans app/conf/configuration.php, et changer le chemin par le votre.

Il ne reste plus qu'a configurer votre serveur web en vous inspirant des exemples présents dans le dépôt.

**Attention**: /access/ est très important et ne peut être changé dans la configuration du serveur web sans modifications dans le code source de Cakebox !

### Authors

* [@MardamBeyK](https://github.com/MardamBeyK)
* [@Tuxity](https://github.com/Tuxity)


### Thanks for assistance and contributions:

* [@MiLk](https://github.com/MiLk)
* Candle
