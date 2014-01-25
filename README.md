imagehost
=========

node.js image host

demo (sometimes): imagehost.colordeaf.net

usage
-----
* request: post image data
* response: json detail / redirect

npm notes
---------
npm install -g forever (globally installs ```forever``` to like /usr/local/bin/forever)
npm update (in app dir, updates libraries used in this project)
npm update -g (for global updates)

forever
-------
* forever start app.js
* forever list
* forever stopall

apache (to share :80 with other apps)
-------------------------------------
* a2enmod proxy (enable apache proxy mod)
* a2enmod proxy_http (enable http-specific apache proxy mod)

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
