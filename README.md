imagehost
=========

node.js image host using express

usage
-----
* request: post image data
* response: json detail / redirect

hosted
------
* images.colordeaf.net

config
------

/etc/apache2/sites-available/images.colordeaf.net

    <VirtualHost 74.207.243.153:80>
         ServerName images.colordeaf.net

         ProxyRequests Off
         <Proxy *>
            Order deny,allow
            Allow from all
         </Proxy>
 
         ProxyPass / http://images.colordeaf.net:3000/
         ProxyPassReverse / http://images.colordeaf.net:3000/
         <Location />
            Order allow,deny
            Allow from all
         </Location>

         ErrorLog /var/www/images.colordeaf.net/logs/error.log
         CustomLog /var/www/images.colordeaf.net/logs/access.log combined
    </VirtualHost>


