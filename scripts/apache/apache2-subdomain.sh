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
#       @mpgn
# Script de création d'un sous domaine pour cakebox-light ex : cakebox.domain.com
# 

echo "Avant de lancer ce script, assurez vous d'avoir Apache installée et d'avoir déjà installé cakebox-light"
echo "Après l'éxécution du script, vous pourrez accéder à cakebox via un sous-domaine ex : cakebox.yourdomain.com"
read -p "Appuyez sur une touche pour continuer ou Ctrl-c pour annuler."

read -e -p "Nom du sous-domaine  (cakebox.exemple.com): " SUBDOMAIN
echo "Quel est le répertoire d'installation de cakebox ? (ex : /home/cakebox ) :"
read -e CAKEBOXREP
echo "Quel est le répertoire de scan de cakebox ? (ex : /home/video ) :" 
read -e VIDEOREP


echo "\n\nDeploiement des modules pour apache"
read -p "Appuyer sur une touche pour continuer ..."

a2enmod headers
a2enmod rewrite

service apache2 restart

echo "\n\nDeploiement de la cakebox sur apache"
read -p "Appuyer sur une touche pour continuer ..."

IFS=''
while read line
do
    eval echo "'$line'" >> /etc/apache2/sites-available/$SUBDOMAIN.conf
done < ../../webconf-example/apache2-alias.conf.example

sed "s%\$SUBDOMAIN%$SUBDOMAIN%g;s%\$CAKEBOXREP%$CAKEBOXREP%g;s%\$VIDEOREP%$VIDEOREP%g" ../../webconf-example/apache2-vhost.conf.example >/etc/apache2/sites-available/$SUBDOMAIN.conf

a2ensite $SUBDOMAIN.conf
/etc/init.d/apache2 restart

echo "\n\nCréation du sous-domaine terminé, rendez-vous sur '$SUBDOMAIN' pour streamer !"
