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
                name: String,
                description: String,
                tripId: String
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

    public async retrieveAllTrips(response:any) {
        var query = this.model.find({});
        // query.where("state");
        // query.lt("B");
        try {
            const itemArray = await query.exec();
            response.json(itemArray);
        }
        catch(e) {
            console.error(e);
        }
    }

    public async retrieveTrips(response:any, value:number) {
        var query = this.model.findOne({tripId: value});
        try {
            const result = await query.exec();
            response.json(result) ;
        }
        catch (e) {
            console.error(e);
        }
    }

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