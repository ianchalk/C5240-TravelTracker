db = db.getSiblingDB('tripSample')
db.createCollection('trips')
tripsCollection = db.getCollection("trips")
tripsCollection.remove({})
tripsCollection.insert(
{
	  name: "Canada Trip",
	  description: "My trip to Canada.",
	  listId: 1,
}
)