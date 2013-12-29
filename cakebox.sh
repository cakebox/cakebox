#!/usr/bin/env bash

# _________         __         ___.                 
# \_   ___ \_____  |  | __ ____\_ |__   _______  ___
# /    \  \/\__  \ |  |/ // __ \| __ \ /  _ \  \/  /
# \     \____/ __ \|    <\  ___/| \_\ (  <_> >    < 
#  \______  (____  /__|_ \\___  >___  /\____/__/\_ \
#         \/     \/     \/    \/    \/            \/
# Version: Light
# Author: Tuxity
#
# TODO :
#   - Configuration de Cakebox et du serveur web
#   - Rendre le script + portable en fonction de la distrib
#   - Ajouter des options pour setter l'emplacement pour l'installation et cie.
#

function usage () {
    echo "Usage: ./$0 [install | update]"
    exit 0
}

function install-prereq () {
    echo "Installation des pre requis de Cakebox-light :"
    cd /tmp

    echo "Installation de la dernière version de PHP ..."
    echo "deb http://packages.dotdeb.org wheezy all
          deb-src http://packages.dotdeb.org wheezy all" >> /etc/apt/sources.list
    wget http://www.dotdeb.org/dotdeb.gpg
    apt-key add dotdeb.gpg
    rm dotdeb.gpg
    aptitude update && aptitude upgrade
    aptitude install php5 php5-curl curl git python g++ make


    echo "Installation de Composer ..."
    curl -s http://getcomposer.org/installer | php
    mv /tmp/composer.phar /usr/bin/composer
    chmod +x /usr/bin/composer

    echo "Installation de NodeJS ..."
    wget -N http://nodejs.org/dist/node-latest.tar.gz
    tar xzvf node-latest.tar.gz && cd node-v*
    ./configure
    make
    make install

    echo "Installation de Bower ..."
    npm install -g bower
}

function install-cakebox () {
    echo "Installation de Cakebox-light ..."
    cd /var/www
    git clone https://github.com/Cakebox/Cakebox-light.git cakebox && cd cakebox
    composer install
    bower install

    cp app/config/default.php.dist app/config/default.php
    # TODO configuration
}

function configure-webserver () {
    echo "TODO"
}

function update () {
    echo "Mise a jour de Cakebox-light ..."

    git fetch --tags
    git checkout tags/latest
    composer update
    bower update

    echo "Mise à jour terminée."
}

case $1 in
    install)
        #install-prereq
        #install-cakebox
        #configure-webserver
        ;;
    update)
        update
        ;;
    *)
        usage
esac
