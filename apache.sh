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
# Script de création d'un sous domain pour cakebox-light ex : cakebox.domain.com
#

read -p "Avant de lancer ce script, assurez vous d'avoir une version d'apache installer sur votre serveur"
read -p "Appuyer sur une touche pour continuer ou Ctrl-c pour annuler."

read -p "Nom du sous domain  (cakebox.exemple.com): " SUBDOMAIN
read -p "Quel est le repertoire d'installation de cakebox ? (ex : /home/cakebox/) : " CAKEBOXREP
read -p "Quel est le repertoire de scan de cakebox ? (ex : /home/video/) : " VIDEOREP


echo "\n\nDeploiement apache"
read -p "Appuyer sur une touche pour continuer ..."

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

' > /etc/apache2/site-available/$SUBDOMAIN


a2ensite $SUBDOMAIN
/etc/init.d/apache2 restart

echo "\n\nCreation du sous-domain terminer, rendez-vous sur '$SUBDOMAIN' pour streamer !"