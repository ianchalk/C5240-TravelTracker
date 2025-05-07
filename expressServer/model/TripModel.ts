import * as Mongoose from "mongoose";
import {ITripModel} from '../interfaces/ITripModel';

class TripModel {
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
                name: {type: String, required: true},
                description: String,
                tripId: String,
                userId:{type: Mongoose.Schema.Types.ObjectId, ref: 'User'},
                isPublic: {type: Boolean, default: false},
            }, {collection: 'trips'}
        );    
    }

    public async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model<ITripModel>("Trips", this.schema);
        }
        catch (e) {
            console.error(e);
        }
    }

    // Create trip
    public async createTrip(response: any, tripData: any) {
        try {
            const newTrip = new this.model({
                name: tripData.name,
                description: tripData.description,
                tripId: tripData.tripId,
                isPublic: tripData.isPublic || false
            });
    
            const result = await newTrip.save();
            response.status(201).json(result);
        } catch (e) {
            console.error(e);
            response.status(500).send(e);
        }
    }

    // Update trip
    public async updateTrip(response: any, tripId: string, updateData: object) {
        try {
            const updatedTrip = await this.model.findOneAndUpdate(
                { tripId: tripId },
                { $set: updateData },
                { new: true, runValidators: true }
            );
    
            if (!updatedTrip) {
                return response.status(404).json({ error: "Trip not found" });
            }
    
            response.json(updatedTrip);
        } catch (e) {
            console.error(e);
            response.status(500).send(e);
        }
    }

    // Retrieves all trips
    public async retrieveAllTrips(response:any) {
        var query = this.model.find({});
        try {
            const itemArray = await query.exec();
            response.json(itemArray);
        }
        catch(e) {
            console.error(e);
        }
    }
    
    // Retrieve specific trip by tripId
    public async retrieveTrip(response:any, value:String) {
        var query = this.model.findOne({tripId: value});
        try {
            const result = await query.exec();
            response.json(result) ;
        }
        catch (e) {
            console.error(e);
        }
    }

    // Retrieves total trip count
    public async retrieveTripCount(response:any) {
        console.log("retrieve Trip Count ...");
        var query = this.model.estimatedDocumentCount();
        try {
            const numberOfTrips = await query.exec();
            console.log("numberOfTrips: " + numberOfTrips);
            response.json(numberOfTrips);
        }
        catch (e) {
            console.error(e);
        }
    }
}
export {TripModel};