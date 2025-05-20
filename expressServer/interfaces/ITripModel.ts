import Mongoose = require("mongoose");

interface ITripModel extends Mongoose.Document {
    name: string;
    description: string;
    tripId: string;
    amount_spent?: number;
}
export {ITripModel};