#!/usr/bin/env bash

# _________         __         ___.                 
# \_   ___ \_____  |  | __ ____\_ |__   _______  ___
# /    \  \/\__  \ |  |/ // __ \| __ \ /  _ \  \/  /
# \     \____/ __ \|    <\  ___/| \_\ (  <_> >    < 
#  \______  (____  /__|_ \\___  >___  /\____/__/\_ \
#         \/     \/     \/    \/    \/            \/
# Version: Light
# Author: 
#       @martialdidit
#
# Script de création d'un sous domaine pour cakebox-light ex : domain.com/cakebox
# 

echo "Avant de lancer ce script, assurez vous d'avoir une version d'Apache installée sur votre serveur et d'avoir déjà installé cakebox-light"
echo "Après l'éxécution du script, vous pourrez accéder à cakebox via un sous-domaine ex : yourdomain.com/cakebox/"
read -p "Appuyez sur une touche pour continuer ou Ctrl-c pour annuler."

read -p "Nom de l'alias (ex cakebox): " ALIAS
echo "Quel est le répertoire d'installation de cakebox ? (ex /home/cakebox ) :"
read CAKEBOXREP
echo "Quel est le répertoire de scan de cakebox ? (ex : /home/video ) :" 
read VIDEOREP

echo "\n\nDeploiement des modules pour apache"
read -p "Appuyer sur une touche pour continuer ..."

a2enmod headers
a2enmod rewrite

service apache2 restart

echo "\n\nDeploiement de la cakebox sur apache"
read -p "Appuyer sur une touche pour continuer ..."

echo '<VirtualHost *:80>

    Alias '$ALIAS' '$CAKEBOXREP'/public/

    <Directory "'$CAKEBOXREP'/public/">
        Options Indexes MultiViews FollowSymLinks
        AllowOverride All

        Order allow,deny
        Allow from all

        # use debug instead of production to get more log
        SetEnv APPLICATION_ENV production

        RewriteEngine On
        RewriteBase /cakebox/
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [QSA,L]
    </Directory>

    Alias /access '$VIDEOREP'/
    <Directory '$VIDEOREP'/>
        Options -Indexes

        Order allow,deny 
        Allow from all
        Satisfy Any

        Header set Content-Disposition "attachment"
    </Directory>

    ErrorLog "/var/log/apache2/'$ALIAS'-error.log"
    CustomLog "/var/log/apache2/'$ALIAS'-access.log" common
</VirtualHost>

' > /etc/apache2/sites-available/$ALIAS


a2ensite $ALIAS
/etc/init.d/apache2 restart

echo "\n\nCréation de l'alias est terminé, bon stream !"