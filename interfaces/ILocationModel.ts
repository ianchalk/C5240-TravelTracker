import Mongoose = require("mongoose");

interface ILocationModel extends Mongoose.Document {
    tripId: string;
    locations: [ {
        name: string;
        address: string;
        description: string;
        dates: [Date];
        cost: number;
    }];
}
export {ILocationModel};