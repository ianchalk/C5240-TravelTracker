import * as Mongoose from "mongoose";
import {ILocationModel} from '../interfaces/ILocationModel';

class LocationModel {
    public schema:any;
    public model:any;
    public dbConnectionString:string;

    public constructor(DB_CONNECTION_STRING:string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    public createSchema() {
        this.schema = new Mongoose.Schema(
            {
                tripId: String,
                locations: [ {
                    name: String,
                    address: String,
                    description: String,
                    dates: [Date],
                    cost: Number
                }]
            }, {collection: 'locations'}
        );    
    }

    public async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model<ILocationModel>("Locations", this.schema);
        }
        catch (e) {
            console.error(e);
        }
    }

    // Create location
    public async createLocation(response: any, locationData: any) {
        try {
            if (!locationData.tripId) {
                return response.status(400).json({ error: "tripId is required" });
            }
    
            // Try to find and update existing trip
            const result = await this.model.findOneAndUpdate(
                { tripId: locationData.tripId },
                {
                    $push: {
                        locations: {
                            name: locationData.name,
                            address: locationData.address,
                            description: locationData.description,
                            dates: locationData.dates,
                            cost: locationData.cost || 0
                        }
                    }
                },
                {
                    new: true,       // Return updated document
                    upsert: true,     // Create if doesn't exist
                    runValidators: true, // Validate against schema
                    setDefaultsOnInsert: true
                }
            );
    
            // Send appropriate status code (201 for created, 200 for updated)
            response.status(result ? 200 : 201).json(result);
        } catch (e) {
            console.error(e);
            response.status(500).json({ 
                error: "Failed to save location",
                details: e instanceof Error ? e.message : "Unknown error"
            });
        }
    }

    // Retrieve all locations for a trip
    public async retrieveLocationsDetails(response:any, filter:Object) {
        var query = this.model.findOne(filter);
        try {
            const itemArray = await query.exec();
            response.json(itemArray);
        }
        catch (e) {
            console.error(e);
        }
    }

    // Retrieve a specific location within a trip
    public async retrieveSingleLocationDetail(response: any, tripId: string, locationName: string) {
        try {
            const result = await this.model.findOne(
                { tripId: tripId, "locations.name": locationName },
                { "locations.$": 1 }
            );
    
            if (!result || !result.locations || result.locations.length === 0) {
                return response.status(404).json({ error: "Location not found" });
            }
    
            response.json(result.locations[0]);
        } catch (e) {
            console.error(e);
            response.status(500).json({ error: "Server error" });
        }
    }

    public async retrieveLocationsCount(response:any, filter:Object) {
        var query = this.model.findOne(filter);
        try {
            const innerLocationList = await query.exec();
            if (innerLocationList == null) {
                response.status(404);
                response.json('{count: -1}');
            }
            else {
                console.log('number of locations: ' + innerLocationList.locations.length);
                response.json('{count:' + innerLocationList.locations.length + '}');
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
export {LocationModel};