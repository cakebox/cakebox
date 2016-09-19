FROM webdevops/php-nginx:debian-8

# Install requirement
RUN apt-get update
RUN apt-get install -y nodejs npm git git-core curl zip
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g bower
RUN curl -sS https://getcomposer.org/installer | php -- --filename=composer --install-dir=/usr/local/bin/

# Configure nginx
ENV WEB_DOCUMENT_ROOT /app/public
COPY .docker/nginx-custom.conf /opt/docker/etc/nginx/vhost.common.d/20-cakebox.conf

# Copy cakebox sources
COPY . /app
COPY .docker/default.php /app/config/default.php
COPY .docker/auth.php /app/config/auth.php
RUN chown www-data:www-data /app/ /var/www -R

# Install dependencies
RUN su - www-data -s /bin/bash -c 'cd /app/ && composer install --no-dev -o'
RUN su - www-data -s /bin/bash -c 'cd /app/ && bower install'

EXPOSE 80
