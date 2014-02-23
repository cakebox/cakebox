#!/usr/bin/env bash

# _________         __         ___.                 
# \_   ___ \_____  |  | __ ____\_ |__   _______  ___
# /    \  \/\__  \ |  |/ // __ \| __ \ /  _ \  \/  /
# \     \____/ __ \|    <\  ___/| \_\ (  <_> >    < 
#  \______  (____  /__|_ \\___  >___  /\____/__/\_ \
#         \/     \/     \/    \/    \/            \/
# Version: Light
# Author: 
#       @Tuxity
#       @martialdidit
#
# Script de création d'un sous domaine pour cakebox-light ex : cakebox.domain.com
#

read -p "Avant de lancer ce script, assurez vous d'avoir une version d'Apache installée sur votre serveur et d'avoir déjà installé cakebox-light"
read -p "Appuyez sur une touche pour continuer ou Ctrl-c pour annuler."

read -p "Après l'éxécution du script, vous pourrez accéder à cakebox via un sous-domaine ex : cakebox.yourdomain.com"
read -p "Appuyez sur une touche pour continuer ou Ctrl-c pour annuler."

read -p "Nom du sous-domaine  (cakebox.exemple.com): " SUBDOMAIN
read -p "Quel est le répertoire d'installation de cakebox ? (ex : /home/cakebox/) : " CAKEBOXREP
read -p "Quel est le répertoire de scan de cakebox ? (ex : /home/video/) : " VIDEOREP


echo "Déploiement d'Apache"
read -p "Appuyez sur une touche pour continuer ..."

echo '<VirtualHost *:80>
    ServerAdmin postmaster@stats.yt
    ServerName '$SUBDOMAIN'

    SetEnv APPLICATION_ENV production

    DocumentRoot "'$CAKEBOXREP'/public"
    <Directory "'$CAKEBOXREP'/public">
        Options Indexes MultiViews FollowSymLinks
        AllowOverride none
        Order allow,deny
        Allow from all

        RewriteEngine On
        RewriteBase /
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </Directory>

    Alias /access '$VIDEOREP'
    <Directory '$VIDEOREP'>
        Order allow,deny
        Allow from all
        Header set Content-Disposition "attachment"
    </Directory>

    ErrorLog "/var/log/apache2/'$SUBDOMAIN'-error.log"
    CustomLog "/var/log/apache2/'$SUBDOMAIN'-access.log" common
</VirtualHost>

' > /etc/apache2/sites-available/$SUBDOMAIN


a2ensite $SUBDOMAIN
/etc/init.d/apache2 restart

echo "\n\nCréation du sous-domaine terminé, rendez-vous sur '$SUBDOMAIN' pour streamer !"
