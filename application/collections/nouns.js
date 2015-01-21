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
	},
	//Return all of the items in the collection that match the regex expression
	getAllMatchingItems: function(criteria) {
		var search = new RegExp(criteria, 'i');

		var found = Nouns.find({name: search}).fetch();
		return found;
	}
});