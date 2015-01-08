Nouns = new Mongo.Collection('nouns');

Meteor.methods({
	newItem: function(doc) {
		return Nouns.insert(doc);
	}
});