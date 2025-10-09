# Dockerfile.php
FROM php:8.2-apache

# Copy public folder to Apache root
COPY public/ /var/www/html/

# Enable mod_rewrite if needed
RUN a2enmod rewrite
