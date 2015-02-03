Verbs = new Mongo.Collection('verbs');

Meteor.methods({
	newVerb: function(doc) {
		var exists = Verbs.findOne({name: doc.name});
		console.log(doc);
		if (exists != undefined) {
			return 'exists';
		}
		else {
			return Verbs.insert(doc);		
		}

	}
});