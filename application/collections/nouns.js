Nouns = new Mongo.Collection('nouns');

Meteor.methods({
	//Adds a new item to the database
	newItem: function(doc) {
		return Nouns.insert(doc);
	},
	//Retrieves the information of a particular item that was searched
	getItemInformation: function(itemName) {
		check(itemName, String);

		//Should make sure that there is only one version of this item
		var itemInformation = Nouns.findOne({name: itemName});

		return itemInformation;
	}
});