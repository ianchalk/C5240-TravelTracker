# C5240-TravelTracker

A full-stack travel tracking application built with Express.js backend and Angular frontend.

## Project Structure

This project contains:
- **Express Server** (`C5240-TravelTracker/`) - Node.js/Express backend with MongoDB integration
- **Angular Frontend Source** (`C5240-TravelTracker/travel-tracker/`) - Angular web application for the user interface
- **Angular Frontend Build** (`C5240-TravelTracker/dist/`) - Angular web application for the user interface

### Key Files:
- `AppServer.ts` - HTTP server configuration
- `App.ts` - Express server application
- `travel-tracker/` - Angular frontend application
- `dist/` - Angular frontend application build
- `createDB/` - Database sample population scripts
- `db/` - MongoDB local database files
- `.env` - Stores sensitive environment data

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (with Mongoose and Mongosh)
- **Angular CLI** (v15 or higher): `npm install -g @angular/cli`

Ensure your PATH variable contains the execution paths for Node.js and MongoDB binaries.

## Setup Instructions

### 1. Install Backend Dependencies

Navigate to the `C5240-TravelTracker` directory:
The examples will use: C:\repos\C5240-TravelTracker
```bash
cd C:\repos\C5240-TravelTracker
npm install
```

### 2. Install Frontend Dependencies

```bash
cd C:\repos\C5240-TravelTracker\travel-tracker
npm install
```

### 3. Database Setup (If using local database)

From the `C5240-TravelTracker` directory:

```bash
# Start the MongoDB server on port 3000
./start.databaseServer.cmd

# Populate the database with sample data
./start.initSampleDatabase.cmd
```

### 4. Compile TypeScript Code

```bash
tsc AppServer.ts
```

## Building Frontend

```bash
cd C:\repos\C5240-TravelTracker\travel-tracker
ng build
```
The built files are in the directory: C5240-TravelTracker\travel-tracker\dist\travel-tracker\browser
Move the files to the dist folder: C5240-TravelTracker\dist

### 5. Update environment variables
Use the .env.example file to create your .env file

- `PORT` - Port for the Express Server
- `DB_INFO/` - DB URL
- `DB_PROTOCOL` - DB Protocol
- `DB_USER` - DB user username
- `DB_PASSWORD` - DB user password
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google Oauth Client Secret ID
- `CALLBACK_URL` - Google Oauth Callback URL

Update the file: C5240-TravelTracker\travel-tracker\src\environments\environment.prod.ts with your GoogleMapsApiKey
Update the file: C5240-TravelTracker\travel-tracker\src\app\tripproxy.service.ts with the hosturl

### 6. Start Backend Server

```bash
cd C:\repos\C5240-TravelTracker
npm run start
```
The Express server will run on **http://localhost:8080**

### Optional: Running Frontend Development Server Independently

```bash
cd C:\repos\C5240-TravelTracker\travel-tracker
ng serve
```
The Angular application will run on **http://localhost:4200**

## Available APIs

# Trip Routes
The following REST APIs are implemented in the backend:
| Method  | Endpoint                                         | Description                                                      |
| ------: | ------------------------------------------------ | ---------------------------------------------------------------- |
| GET     | `/trip/`                                         | Retrieve all public trips                                        |
| GET     | `/trip/user/:userId`                             | Retrieve all trips (public & private) for the given user         |
| GET     | `/trip/my-trips?userId={userId}`                 | Retrieve trips for the “current” user (userId passed as query)   |
| GET     | `/trip/search?q={searchQuery}`                   | Search public trips by name                                      |
| GET     | `/trip/:tripId`                                  | Retrieve a specific trip by its `tripId`                         |
| GET     | `/trip/:tripId/locations`                        | Retrieve all locations for a specific trip                       |
| GET     | `/trip/:tripId/locations/:locationName`          | Retrieve one location (by name) within a trip                    |
| POST    | `/trip/create`                                   | Create a new trip                                                |
| POST    | `/trip/create-with-places`                       | Create a trip and seed it with multiple places in one call       |
| PUT     | `/trip/update/:tripId`                           | Update an existing trip                                          |
| PATCH   | `/trip/:tripId/privacy`                          | Update a trip’s `isPublic` flag                                  |
| DELETE  | `/trip/:tripId`                                  | Delete a trip and all its locations                              |

## Location Subroutes

| Method  | Endpoint                                            | Description                                           |
| ------- | --------------------------------------------------- | ----------------------------------------------------- |
| POST    | `/trip/:tripId/locations/create`                    | Create a new location for a trip (full path)          |
| POST    | `/trip/:tripId/locations`                           | Alternative endpoint to add a location to a trip      |
| GET     | `/trip/:tripId/locations`                           | Retrieve all locations for a specific trip            |
| GET     | `/trip/:tripId/locations/:locationName`             | Retrieve one location (by name) within a trip         |
| DELETE  | `/trip/:tripId/locations/:locationIndex`            | Delete a location from a trip (by its array index)    |
| PUT     | `/trip/:tripId/locations/:placeIndex`               | Update all fields of a specific location              |
| PUT     | `/trip/:tripId/locations/:placeIndex/photos`        | Replace the photos array for a specific location      |


## Development Notes

- The project uses **TypeScript** for both backend and frontend
- **MongoDB** is used for data persistence
- **Google Maps integration** for location services
- **Bootstrap** and custom CSS for responsive design
- **Angular Material** and modern UI components

## Troubleshooting

### Common Issues:

1. **Port conflicts**: Ensure ports 3000 (MongoDB), 4200 (Angular), and 8080 (Express) are available
2. **TypeScript compilation errors**: Exclude Angular projects from Express TypeScript compilation by updating `tsconfig.json`
3. **Angular build warnings**: Budget limits have been adjusted for larger CSS files

### Clean Installation:

If you encounter persistent issues:

```bash
# Clean backend
cd C:\repos\C5240-TravelTracker
rm -rf node_modules package-lock.json
npm install

# Clean frontend  
cd C:\repos\C5240-TravelTracker\travel-tracker
rm -rf node_modules package-lock.json
npm install
```