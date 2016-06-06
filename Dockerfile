FROM php:5.6-apache

# Install requirement
RUN apt-get update
RUN apt-get install -y nodejs npm git git-core curl zip
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g bower
RUN curl -sS https://getcomposer.org/installer | php -- --filename=composer --install-dir=/usr/local/bin/

COPY .docker/php.ini /usr/local/etc/php/php.ini
COPY .docker/apache2.conf /etc/apache2/apache2.conf
RUN a2enmod rewrite headers

RUN rm  /var/www/html -r
COPY . /var/www/
COPY .docker/default.php /var/www/config/default.php
COPY .docker/auth.php /var/www/config/auth.php
RUN chown www-data:www-data /var/www/ -R
RUN su - www-data -s /bin/bash -c 'cd /var/www/ && composer install --no-dev -o'
RUN su - www-data -s /bin/bash -c 'cd /var/www/ && bower install'

EXPOSE 80
ENV ALLOW_OVERRIDE=true