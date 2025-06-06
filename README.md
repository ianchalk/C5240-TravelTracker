# C5240-TravelTracker

A full-stack travel tracking application built with Express.js backend and Angular frontend.

## Project Structure

This project contains:
- **Express Server** (`expressServer/`) - Node.js/Express backend with MongoDB integration
- **Angular Frontend** (`expressServer/travel-tracker/`) - Angular web application for the user interface

### Key Files:
- `AppServer.ts` - HTTP server configuration
- `App.ts` - Express server application
- `expressServer/travel-tracker/` - Angular frontend application
- `createDB/` - Database population scripts
- `db/` - MongoDB database files

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (with Mongoose and Mongosh)
- **Angular CLI** (v15 or higher): `npm install -g @angular/cli`

Ensure your PATH variable contains the execution paths for Node.js and MongoDB binaries.

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd expressServer
npm install --legacy-peer-deps
```

### 2. Install Frontend Dependencies

```bash
cd expressServer/travel-tracker
npm install --legacy-peer-deps
```

### 3. Database Setup

From the `expressServer` directory:

```bash
# Start the MongoDB server on port 3000
./start.databaseServer.cmd

# Populate the database with sample data
./start.initSampleDatabase.cmd
```

### 4. Compile TypeScript Code

```bash
cd expressServer
npm run compile
```

## Running the Application

### Start Backend Server

```bash
cd expressServer
npm start
```
The Express server will run on **http://localhost:8080**

### Start Frontend Development Server

In a new terminal window:

```bash
cd expressServer/travel-tracker
ng serve --host 0.0.0.0 --port 4200
```
The Angular application will run on **http://localhost:4200**

## Available APIs

The following REST APIs are implemented:

- `http://localhost:8080/` - Root endpoint
- `http://localhost:8080/trips/` - Trip management endpoints
- `http://localhost:8080/auth/` - Authentication endpoints

## Development Notes

- The project uses **TypeScript** for both backend and frontend
- **MongoDB** is used for data persistence
- **Google Maps integration** for location services
- **Bootstrap** and custom CSS for responsive design
- **Angular Material** and modern UI components

## Troubleshooting

### Common Issues:

1. **npm install errors**: Use `--legacy-peer-deps` flag to resolve dependency conflicts
2. **Port conflicts**: Ensure ports 3000 (MongoDB), 4200 (Angular), and 8080 (Express) are available
3. **TypeScript compilation errors**: Exclude Angular projects from Express TypeScript compilation by updating `tsconfig.json`
4. **Angular build warnings**: Budget limits have been adjusted for larger CSS files

### Clean Installation:

If you encounter persistent issues:

```bash
# Clean backend
cd expressServer
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Clean frontend  
cd travel-tracker
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```