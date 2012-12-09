imagehost
=========

node.js image host

usage
-----
* request: post image data
* response: json detail / redirect

hosted
------
* imagehost.colordeaf.net

config
------
* forever -l /path/to/file.log app.js
* a2enmod proxy
* a2enmod proxy_http

/etc/apache2/sites-available/imagehost.colordeaf.net

    <VirtualHost 74.207.243.153:80>
         ServerName imagehost.colordeaf.net

         ProxyRequests Off
         <Proxy *>
            Order deny,allow
            Allow from all
         </Proxy>
 
         ProxyPass / http://imagehost.colordeaf.net:3000/
         ProxyPassReverse / http://imagehost.colordeaf.net:3000/
         <Location />
            Order allow,deny
            Allow from all
         </Location>

         ErrorLog /var/www/imagehost.colordeaf.net/logs/error.log
         CustomLog /var/www/imagehost.colordeaf.net/logs/access.log combined
    </VirtualHost>


