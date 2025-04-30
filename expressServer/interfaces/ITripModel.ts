import Mongoose = require("mongoose");

interface ITripModel extends Mongoose.Document {
    name: string;
    description: string;
    tripId: string;
}
export {ITripModel};