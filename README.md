## Pourquoi cette version de Cakebox ? Qui a t'il de différent ?

Car la version principale de Cakebox commence a se faire vieille (et ceci malgré nos commits pour la maintenir en vie), et également car nous avions envie de découvrir de nouvelles technologies dans le domaine du web, c'était l'occasion.

On a donc décidé de refaire complètement l'outil que nous vous mettions a disposition, pour le réécrire + proprement et le rendre + performant. Pour cela nous utilisons [AngularJS](http://angularjs.org/ "AngularJS") pour le rendu, et [Silex](http://silex.sensiolabs.org/ "Silex") pour l'API.

## Comment installer cette version light de Cakebox ?

Apres avoir cloné le dépôt, pour installer Cakebox-light il vous avant tout composer et node.

```
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
```

```
aptitude install node
```
(Debian)

```
npm install -g bower
```


On peut maintenant installer Cakebox.

```
composer install
bower install
```

Il ne reste plus qu'a configurer votre serveur web en vous inspirant des exemples présents dans le dépôt.

**Attention**: /access/ est très important et ne peut être changé dans la configuration du serveur web sans modifications dans le code source de Cakebox !

## Authors

* [@MardamBeyK](https://github.com/MardamBeyK)
* [@Tuxity](https://github.com/Tuxity)


## Thanks for assistance and contributions:

* [@MiLk](https://github.com/MiLk)
* Candle
