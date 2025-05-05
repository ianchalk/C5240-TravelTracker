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