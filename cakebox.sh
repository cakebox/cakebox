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

function usage () {
    echo "Usage: ./$0 [install | update]"
    exit 0
}

# --------------------------- [ INSTALLATION PREREQUIS ] ---------------------------

function install-prereq () {
    echo "Installation des pre requis de Cakebox-light :"
    read -p "Appuyer sur une touche pour continuer ..."

    read -p "Quel est votre distribution linux ? (debian = d | ubuntu = u)" DISTRIB

    cd /tmp

    if [ $DISTRIB == "d" ] ; then
        echo "Installation de la dernière version de PHP ..."
        echo "deb http://packages.dotdeb.org wheezy all
              deb-src http://packages.dotdeb.org wheezy all" >> /etc/apt/sources.list
        wget http://www.dotdeb.org/dotdeb.gpg
        apt-key add dotdeb.gpg
        rm dotdeb.gpg
        aptitude update && aptitude upgrade
        aptitude install php5 php5-curl curl git python g++ make
    else 
        add-apt-repository ppa:ondrej/php5
        apt-get update
        apt-get install php5 php5-curl git build-essential
    fi

    echo "Installation ou maj de Composer ..."
    read -p "Appuyer sur une touche pour continuer ..."
    if hash composer 2>/dev/null; then
        /usr/local/bin/composer self-update
    else
        curl -s http://getcomposer.org/installer | php
        mv /tmp/composer.phar /usr/bin/composer
        chmod +x /usr/bin/composer
    fi


    echo "Installation de NodeJS ..."
    read -p "Appuyer sur une touche pour continuer ..."
    wget -N http://nodejs.org/dist/node-latest.tar.gz
    tar xzvf node-latest.tar.gz && cd node-v*
    ./configure
    make
    make install

    echo "Installation ou maj de Bower ..."
    read -p "Appuyer sur une touche pour continuer ..."
    if hash bower 2>/dev/null; then
        bower update --allow-root
    else
        npm install -g bower
    fi
}


# --------------------------- [ INSTALLATION CAKEBOX ] ---------------------------


function install-cakebox () {

    echo "Installation de Cakebox-light ..."
    read -p "Appuyer sur une touche pour continuer ..."
    cd $1 #repertoire d'installation cakebox passer en parametre

    git clone https://github.com/Cakebox/Cakebox-light.git cakebox && cd cakebox
    git checkout tags/latest
    composer.phar install
    bower install --allow-root

    cp app/config/default.php.dist app/config/default.php

    # Update Root directory Cakebox have to scan
    sed -i 's%\$app\[\"cakebox.root\"\] = \"\/var\/www\/\"\;%\$app\[\"cakebox.root\"] = \"'$2'\"\;%'  app/config/default.php
    echo -e "Modification terminé du repertoire de scan cakebox-light terminé.\n\n"

    # update locate for update
    updatedb

    echo -e "----------------------- CAKEBOX-LIGHT ---------------------\n"
    echo -e "Cakebox-light est maintenant installé dans le repertoire "$1".\n"
    echo -e "Il vous faut maintenant configurer votre serveur pour pouvoir acceder à votre cakebox-light depuis le web\n"
    echo -e "Pour cela, rendez vous sur le wiki de la cakebox-light rubrique : Comment configurer votre serveur web  ?\n";
    echo -e "Bon stream !\n"
    read -p "Appuyer sur une touche pour terminer ..."
    
}

# --------------------------- [ UPDATE CAKEBOX ] ---------------------------

function update () {
    echo "Mise a jour de Cakebox-light ..."
    read -p "Appuyer sur une touche pour continuer ..."

    echo "recherche de votre repertoire cakebox"
    REP2=$(locate -i -b "\cakebox")

    read -p "Votre repertoire cakebox-light se trouve dans '$REP2' ? (y/n) " QUES
    if [ $QUES == "n" ] ; then
        read -p "Ou se trouve votre reperoitoire cakebox ?" REP2
    fi 
     
    if cd $REP2 2> /dev/null ; then

        git fetch --tags
        git checkout tags/latest
        /usr/local/bin/composer self-update
        bower update --allow-root
        echo "Mise a jour terminée, vous pouvez de nouveau utiliser votre Cakebox-light. Bon stream !"
    else
        echo "Erreur : verifiez le chemin vers votre repertoire cakebox"
    fi

}


# --------------------------- [ VERIFICATION DE L'UTILISATEUR ROOT ] ---------------------------

user=$(whoami)
if [ root != $user ] ; then
    echo "Privilege insuffissant vous devez etre root"
    echo "Lancer la commande sudo ./cakebox.sh"
    exit 1
fi

# --------------------------- [ CHOIX UTILISATEUR ] ---------------------------


case $1 in
    install)
        
        # --------------------------- [ REPERTOIRE D'INSTALLATION ] ---------------------------
 
        echo "_________         __         ___.                 "
        echo "\_   ___ \_____  |  | __ ____\_ |__   _______  ___"
        echo "/    \  \/\__  \ |  |/ // __ \| __ \ /  _ \  \/  /"
        echo "\     \____/ __ \|    <\  ___/| \_\ (  <_> >    < " 
        echo " \______  (____  /__|_ \\___  >___  /\____/__/\_  \\"
        echo "        \/     \/     \/    \/    \/            \/"
        echo -e "\n"
        echo -e "Debut de l'installation de cakebox-light....\n"

        read -p "Entrez le repertoire ou installer Cakebox-light (ex /var/www/): " CAKEREP
        if cd $CAKEREP 2> /dev/null ; then
            echo -e "Debut de l'intallation dans le repertoire '$CAKEREP'\n"
        else
            mkdir $CAKEREP
            echo -e "Le repertoire '$CAKEREP' a été créer \n"
        fi

        # --------------------------- [ REPERTOIRE DE SCAN ] ---------------------------


        read -p "Entrez le repertoire a scanner : " REP
        if cd $REP 2> /dev/null ; then
            echo -e "repertoire scanner par cakebox-light : '$CAKEREP'\n"
        else
            mkdir $REP
            echo -e "Repertoire de scan : '$REP' creer.\n"
        fi

        chmod -R 0755 $REP

        # --------------------------- [ INSTALLATION CAKEBOX-LIGHT ] ---------------------------

        install-prereq
        install-cakebox $CAKEREP $REP
        ;;
    update)
        update
        ;;
    *)
        usage
esac
