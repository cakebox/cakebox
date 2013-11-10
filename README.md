## Pourquoi  ? Qui a t'il de différent ?

Car la version principale de Cakebox commence a se faire vieille (et ceci malgré nos commits pour la maintenir en vie), et également car nous avions envie de découvrir de nouvelles technologies dans le domaine du web, c'était l'occasion !

On a donc décidé de refaire complètement l'outil que nous vous mettions a disposition, pour le réécrire + proprement et le rendre + performant. Pour cela nous utilisons [AngularJS](http://angularjs.org/ "AngularJS") pour le rendu, et [Silex](http://silex.sensiolabs.org/ "Silex") pour l'API.

Contrairement à CakeBox original, CakeBox-light n'installe pas Rutorrent. Vous pouvez donc utiliser le client bit-torrent de votre choix : [Transmission-web](http://www.transmissionbt.com/), [RuTorrent](https://code.google.com/p/rutorrent/)...

Aperçu:

![Cakebox-light](http://i.imgur.com/eML5KZD.png "Cakebox-light")

## Comment installer Cakebox-light ?

Pour installer Cakebox-light il vous avant tout [Composer](https://getcomposer.org/ "Composer") puis [NodeJS](http://nodejs.org/ "NodeJS") (Ce dernier fournit le binaire npm) et pour finir de [Bower](http://bower.io/ "Bower").

Pour cela rendez vous dans le [wiki](https://github.com/Cakebox/Cakebox-light/wiki/packages) de CakeBox-light pour installer les différents packages :

- php 5.4 ou plus.
- composer
- node.js & npm 
- bower



####Installer Cakebox.

```
cd /var/www/
git clone https://github.com/Cakebox/Cakebox-light.git cakebox/
cd ./cakebox/
composer install
bower install # (rajoutez --allow-root en option si vous êtes en root)
```

Cakebox est multiusers, mais le fichier de configuration par défaut se trouve a cet endroit : **app/conf/default.php.list**

Copier le contenu du fichier dans le fichier **default.php**

```
cp default.php.list default.php
```

Dans ce fichier ajouter votre répertoire contenant vos fichiers en modifiant cette ligne 

```
$app["cakebox.root"] = "/var/www/"; // Root directory Cakebox have to scan
```

Exemple : 

```
$app["cakebox.root"] = "/home/download";
```

Si vous dupliquez ce fichier et que vous le renommé avec le nom d'utilisateur de vos utilisateurs HTTP, le bon fichier de conf sera donc chargé pour tel utilisateur. (Concerne l'utilisation d'un .htaccess)

Il ne reste plus qu'a configurer votre serveur web en vous inspirant des exemples présents dans le dépôt.

Avec Apache 

`apache2-vhost.conf.example`

Avec nginx

`nginx-vhost.conf.example`

**Attention**: /access/ est très important et ne peut être changé dans la configuration du serveur web sans modifications dans le code source de Cakebox !

### Authors

* [@MardamBeyK](https://github.com/MardamBeyK)
* [@Tuxity](https://github.com/Tuxity)


### Thanks for assistance and contributions:

* [@MiLk](https://github.com/MiLk)
* Candle
