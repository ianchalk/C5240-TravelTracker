# C5240-TravelTracker
This directory contains one express server:

SApperver.js + App.js - Encapsulated Node/Express web server w/ Mongo Access
File content:

AppServer.ts - based http server
App.ts - express server
DB population files are stored on the createDB folder
DB stored in db folder
Make sure you install the node.js server and MongoDB/Mongoose/Mongosh sofware from the side. Ensure your path variable contains the execution path of the node.js and mongo binary.

To execute the server db and then the node server with the following commands:
1) Install npm packages using the following command:
npm install

2) Run the following file to create/run the DB server on port 3000
start.databaseServer.cmd

3) Run the following file to populate the DB server with the sample server/user
start.initSampleDatabase.cmd

4) Compile the AppServer using the following command:
npm run compile

5) Start the Node/Express Server on port 8080 using the following command:
npm run start

The following API's are implemented:
http://localhost:8080/
http://localhost:8080/trips/