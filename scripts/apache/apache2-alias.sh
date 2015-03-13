#!/usr/bin/env bash

# _________         __         ___.                 
# \_   ___ \_____  |  | __ ____\_ |__   _______  ___
# /    \  \/\__  \ |  |/ // __ \| __ \ /  _ \  \/  /
# \     \____/ __ \|    <\  ___/| \_\ (  <_> >    < 
#  \______  (____  /__|_ \\___  >___  /\____/__/\_ \
#         \/     \/     \/    \/    \/            \/
# Version: Light
# Author: 
#       @mpgn
#
# Script de création d'un sous domaine pour cakebox-light ex : domain.com/cakebox
# 

echo "Avant de lancer ce script, assurez vous d'avoir une version d'Apache installée sur votre serveur et d'avoir déjà installé cakebox-light"
echo "Après l'éxécution du script, vous pourrez accéder à cakebox via un sous-domaine ex : yourdomain.com/cakebox/"
read -p "Appuyez sur une touche pour continuer ou Ctrl-c pour annuler."

read -e -p "Nom de l'alias (ex cakebox): " ALIAS
echo "Quel est le répertoire d'installation de cakebox ? (ex /home/cakebox ) :"
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
    eval echo "'$line'" >> /etc/apache2/sites-available/$ALIAS.conf
done < ../../webconf-example/apache2-alias.conf.example

sed "s%\$ALIAS%$ALIAS%g;s%\$CAKEBOXREP%$CAKEBOXREP%g;s%\$VIDEOREP%$VIDEOREP%g" ../../webconf-example/apache2-alias.conf.example >/etc/apache2/sites-available/$ALIAS.conf

a2ensite $ALIAS.conf
/etc/init.d/apache2 restart

echo "\n\nCréation de l'alias est terminé, bon stream !"
