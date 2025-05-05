db = db.getSiblingDB('tripSample')
db.createCollection('trips')
tripsCollection = db.getCollection("trips")
tripsCollection.remove({})
tripsCollection.insert(
{
	  name: "Canada Trip",
	  description: "My trip to Canada.",
	  tripId: "1",
	  isPublic: true,
})
tripsCollection.insert({
	name: "Mexico Trip",
	description: "My trip to Mexico.",
	tripId: "2",
	isPublic: false,
})
tripsCollection.insert(
{
	name: "Hawaii Trip",
	description: "My trip to Hawaii.",
	tripId: "3",
	isPublic: false,
}
)

db.createCollection('locations')
locationsCollection = db.getCollection("locations")
locationsCollection.remove({})
locationsCollection.insert({
	tripId : "1",
	locations : [
	 	{
			name: "Vancouver",
			address: "Vancouver, BC, Canada",
	  		description: "Visit Vancouver, Canada.",
	  		dates: [
				new Date("2025-07-01"),
				new Date("2025-07-05")
			],
	 		cost: 1500.00
	 	},
	 	{
	 		name: "Banff National Park",
	 		address: "Banff, AB, Canada",
	 		description: "Visit Banff National Park, Canada.",
	 		dates: [
				new Date("2025-07-06"),
				new Date("2025-07-10")
	  		],
	 		cost: 1200.00
	 	}
	]
}
)

locationsCollection.insert({
    tripId: "2",
    locations: [
        {
            name: "Cancun",
            address: "Cancun, Quintana Roo, Mexico",
            description: "Explore Cancun's beaches and Mayan ruins.",
            dates: [
                new Date("2025-07-11"),
                new Date("2025-07-15")
            ],
            cost: 1800.00
        },
        {
            name: "Mexico City",
            address: "Mexico City, CDMX, Mexico",
            description: "Discover Mexico City's historic center and museums.",
            dates: [
                new Date("2025-07-16"),
                new Date("2025-07-20")
            ],
            cost: 900.00
        }
    ]
})