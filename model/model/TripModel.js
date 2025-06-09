"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripModel = void 0;
const Mongoose = require("mongoose");
class TripModel {
    constructor(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        this.schema = new Mongoose.Schema({
            name: { type: String, required: true },
            description: String,
            tripId: String,
            userId: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
            isPublic: { type: Boolean, default: false },
            amount_spent: { type: Number, default: 0 }
        }, { collection: 'trips' });
    }
    async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model("Trips", this.schema);
        }
        catch (e) {
            console.error(e);
        }
    }
    // Create trip
    async createTrip(response, tripData) {
        try {
            const newTrip = new this.model({
                name: tripData.name,
                description: tripData.description,
                tripId: tripData.tripId,
                userId: tripData.userId,
                isPublic: tripData.isPublic || false,
                amount_spent: tripData.amount_spent || 0
            });
            const result = await newTrip.save();
            response.status(201).json(result);
        }
        catch (e) {
            console.error(e);
            response.status(500).send(e);
        }
    }
    // Update trip
    async updateTrip(response, tripId, updateData) {
        try {
            const updatedTrip = await this.model.findOneAndUpdate({ tripId: tripId }, { $set: updateData }, { new: true, runValidators: true });
            if (!updatedTrip) {
                return response.status(404).json({ error: "Trip not found" });
            }
            response.json(updatedTrip);
        }
        catch (e) {
            console.error(e);
            response.status(500).send(e);
        }
    }
    // Update trip privacy status
    async updateTripPrivacy(response, tripId, isPublic, userId) {
        try {
            console.log(`Updating trip privacy - tripId: ${tripId}, isPublic: ${isPublic}, userId: ${userId}`);
            // Build the query - only include userId check if provided and valid
            let query = { tripId: tripId };
            if (userId) {
                // Check if userId is a valid ObjectId format (24 hex characters)
                if (/^[0-9a-fA-F]{24}$/.test(userId)) {
                    query.userId = userId;
                }
                else {
                    console.warn(`Invalid userId format: ${userId}, proceeding without userId filter`);
                }
            }
            // Update the trip's privacy status
            const updatedTrip = await this.model.findOneAndUpdate(query, { $set: { isPublic: isPublic } }, { new: true, runValidators: true });
            if (!updatedTrip) {
                return response.status(404).json({
                    error: "Trip not found or you don't have permission to update this trip"
                });
            }
            console.log("Trip privacy updated successfully:", updatedTrip);
            response.json({
                success: true,
                message: "Trip privacy updated successfully",
                trip: updatedTrip
            });
        }
        catch (e) {
            console.error("Error updating trip privacy:", e);
            response.status(500).json({
                error: "Failed to update trip privacy",
                details: e instanceof Error ? e.message : "Unknown error"
            });
        }
    }
    // Retrieves all trips (modified to return only public trips for public view)
    async retrieveAllTrips(response) {
        var query = this.model.find({ isPublic: true }).populate('userId', 'name email picture'); // Only public trips with user data
        try {
            const itemArray = await query.exec();
            response.json(itemArray);
        }
        catch (e) {
            console.error(e);
        }
    }
    // Retrieves only public trips (for public trips page)
    async retrievePublicTrips(response) {
        var query = this.model.find({ isPublic: true }).populate('userId', 'name email picture');
        try {
            const itemArray = await query.exec();
            response.json(itemArray);
        }
        catch (e) {
            console.error(e);
        }
    }
    // Retrieves trips for a specific user (both public and private)
    async retrieveUserTrips(response, userId) {
        var query = this.model.find({ userId: userId });
        try {
            const itemArray = await query.exec();
            response.json(itemArray);
        }
        catch (e) {
            console.error(e);
            response.status(500).json({ error: "Failed to retrieve user trips" });
        }
    }
    // Retrieve specific trip by tripId
    async retrieveTrip(response, value) {
        var query = this.model.findOne({ tripId: value }).populate('userId', 'name email picture');
        try {
            const result = await query.exec();
            response.json(result);
        }
        catch (e) {
            console.error(e);
        }
    }
    // Retrieves total trip count
    async retrieveTripCount(response) {
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
    // Delete a trip by tripId
    async deleteTrip(response, tripId) {
        try {
            console.log("Deleting trip with tripId:", tripId);
            // First, check if the trip exists
            const tripExists = await this.model.findOne({ tripId: tripId });
            if (!tripExists) {
                return response.status(404).json({ error: "Trip not found" });
            }
            // Delete the trip
            const result = await this.model.deleteOne({ tripId: tripId });
            if (result.deletedCount === 0) {
                return response.status(404).json({ error: "Trip not found or already deleted" });
            }
            console.log("Trip deleted successfully:", result);
            response.json({
                success: true,
                message: "Trip deleted successfully",
                deletedCount: result.deletedCount
            });
        }
        catch (e) {
            console.error("Error deleting trip:", e);
            response.status(500).json({
                error: "Failed to delete trip",
                details: e instanceof Error ? e.message : "Unknown error"
            });
        }
    }
    // Helper method that doesn't send response - for use in composite operations
    async deleteTripNoResponse(tripId) {
        try {
            console.log("Deleting trip with tripId:", tripId);
            // First, check if the trip exists
            const tripExists = await this.model.findOne({ tripId: tripId });
            if (!tripExists) {
                throw new Error("Trip not found");
            }
            // Delete the trip
            const result = await this.model.deleteOne({ tripId: tripId });
            if (result.deletedCount === 0) {
                throw new Error("Trip not found or already deleted");
            }
            console.log("Trip deleted successfully:", result);
            return {
                success: true,
                message: "Trip deleted successfully",
                deletedCount: result.deletedCount
            };
        }
        catch (e) {
            console.error("Error deleting trip:", e);
            throw e;
        }
    }
    // Helper method that doesn't send response - for use in composite operations
    async updateTripPrivacyNoResponse(tripId, isPublic, userId) {
        try {
            console.log(`Updating trip privacy - tripId: ${tripId}, isPublic: ${isPublic}, userId: ${userId}`);
            // Build the query - include userId check if provided for security
            let query = { tripId: tripId };
            if (userId) {
                query.userId = userId;
            }
            // Update the trip's privacy status
            const updatedTrip = await this.model.findOneAndUpdate(query, { $set: { isPublic: isPublic } }, { new: true, runValidators: true });
            if (!updatedTrip) {
                throw new Error("Trip not found or you don't have permission to update this trip");
            }
            console.log("Trip privacy updated successfully:", updatedTrip);
            return {
                success: true,
                message: "Trip privacy updated successfully",
                trip: updatedTrip
            };
        }
        catch (e) {
            console.error("Error updating trip privacy:", e);
            throw e;
        }
    }
    // Search public trips by name and places within trips
    async searchPublicTrips(response, searchQuery) {
        try {
            console.log("Searching public trips with query:", searchQuery);
            // Use aggregation to search both trip names and location data
            const aggregationPipeline = [
                // First, only include public trips
                {
                    $match: {
                        isPublic: true
                    }
                },
                // Left join with locations collection to get trip places
                {
                    $lookup: {
                        from: 'locations',
                        localField: 'tripId',
                        foreignField: 'tripId',
                        as: 'locationData'
                    }
                },
                // Populate user data
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userInfo',
                        pipeline: [
                            { $project: { name: 1, email: 1, picture: 1 } }
                        ]
                    }
                },
                // Add userId field from userInfo array
                {
                    $addFields: {
                        userId: { $arrayElemAt: ['$userInfo', 0] }
                    }
                },
                // Remove userInfo array since we've moved it to userId
                {
                    $unset: 'userInfo'
                },
                // Create searchable fields array that includes trip name and all location data
                {
                    $addFields: {
                        searchableContent: {
                            $concatArrays: [
                                // Trip name
                                [{ $toLower: '$name' }],
                                // Trip description
                                [{ $toLower: { $ifNull: ['$description', ''] } }],
                                // Location names
                                {
                                    $reduce: {
                                        input: '$locationData.locations',
                                        initialValue: [],
                                        in: {
                                            $concatArrays: [
                                                '$$value',
                                                [{ $toLower: { $ifNull: ['$$this.name', ''] } }]
                                            ]
                                        }
                                    }
                                },
                                // Location addresses (formatted address)
                                {
                                    $reduce: {
                                        input: '$locationData.locations',
                                        initialValue: [],
                                        in: {
                                            $concatArrays: [
                                                '$$value',
                                                [{ $toLower: { $ifNull: ['$$this.address.formattedAddress', ''] } }]
                                            ]
                                        }
                                    }
                                },
                                // Location cities
                                {
                                    $reduce: {
                                        input: '$locationData.locations',
                                        initialValue: [],
                                        in: {
                                            $concatArrays: [
                                                '$$value',
                                                [{ $toLower: { $ifNull: ['$$this.address.city', ''] } }]
                                            ]
                                        }
                                    }
                                },
                                // Location countries
                                {
                                    $reduce: {
                                        input: '$locationData.locations',
                                        initialValue: [],
                                        in: {
                                            $concatArrays: [
                                                '$$value',
                                                [{ $toLower: { $ifNull: ['$$this.address.country', ''] } }]
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                // Filter trips that contain the search query in any searchable content
                {
                    $match: {
                        searchableContent: {
                            $elemMatch: {
                                $regex: searchQuery.toLowerCase(),
                                $options: 'i'
                            }
                        }
                    }
                },
                // Remove the temporary searchableContent field
                {
                    $unset: ['searchableContent', 'locationData']
                }
            ];
            const itemArray = await this.model.aggregate(aggregationPipeline).exec();
            console.log(`Found ${itemArray.length} trips matching search query (including places)`);
            response.json(itemArray);
        }
        catch (e) {
            console.error("Error searching trips:", e);
            response.status(500).json({
                error: "Failed to search trips",
                details: e instanceof Error ? e.message : "Unknown error"
            });
        }
    }
}
exports.TripModel = TripModel;
