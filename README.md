Hello and welcome to PickUp. 

PickUp is an application designed to connect athletes with other athletes nearby to play more games and increase their network. 

Before beginning the installation please make sure you have a SQL server installed on your device. If you do not you may follow these links to install one: 

Mac: https://dev.mysql.com/doc/refman/8.0/en/macos-installation.html

Windows: https://dev.mysql.com/doc/refman/8.0/en/windows-installation.html

After installing and setting it up, now create a new database for the application. 

To get started: first clone the server side repository from this link: 

https://github.com/zachrihall/zachri-hall-capstone-back-end
 
Then after opening the folder in VSCode change into the server directory. Once in the server directory install the required dependencies in the terminal with the npm install command: 

$npm i 

After the dependencies have been installed now set up the server to communicate with your sql server. In the server directory navigate to the knexfile.js. With the file open change the host, user, database name, and password to your appropriate information. 

Next run the migration file to create the tables in the database: 

$ npm run migrate 

After doing this you can now initialize the server using node: 

$node server.js

The server should now be up and running. Please keep in mind the server needs to be running as well in order for the application to function on the client side. 

Next you will need to clone the client side  repository from this link: 

https://github.com/zachrihall/client

After cloning the repo and opening it up in VSCode you are going to change into the client directory and install the required dependencies like before: 

$npm i 

Once the dependencies are installed you are next going to start the react application using the npm start command from the terminal: 

$npm start 

Now the application will appear in your browser of choice and you can use it. Please keep in mind that PickUp was designed to be viewed on a mobile screen size no larger than 760 pixels. It is not a fully responsive application. Screen sizes larger than this may cause issues with the display of content and functionality of the app.  

