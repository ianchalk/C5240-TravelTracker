db = db.getSiblingDB('tripSample')
db.createCollection('trips')
tripsCollection = db.getCollection("trips")
tripsCollection.remove({})
tripsCollection.insert(
{
	  name: "Canada Trip",
	  description: "My trip to Canada.",
	  tripId: "1",
})
tripsCollection.insert({
	name: "Mexico Trip",
	description: "My trip to Mexico.",
	tripId: "2",
})
tripsCollection.insert(
{
	name: "Hawaii Trip",
	description: "My trip to Hawaii.",
	tripId: "3",
}
)