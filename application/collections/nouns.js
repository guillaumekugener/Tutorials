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
	},
	//Add a verb to the verbs set of the noun
	addVerbToNoun: function(noun, verb) {
		console.log(noun + ", " + verb);
		var nounObj = Nouns.findOne({name: noun});
		var nounVerbs = nounObj.verbs;

		nounVerbs[verb] = true;
		nounObj.verbs = nounVerbs;

		Nouns.update({name: noun}, nounObj);
	},
	/*
	* Retrieves all of the verbs that two nouns have. It takes as
	* parameters two nouns and returns an object. The verbs that the nouns have in common are
	* returned in the result.common part of the object. result.<noun1> (the actual name of the noun) 
	* is all of the first items verbs not in common with <noun2>, and result.<noun2>
	* is the opposite of that. If one of the nouns is undefined, then it returns the verb set of the 
	* noun that is defined. If they are both undefined, then an empty set is returned
	*/
	retrieveVerbsFromNouns: function(noun1, noun2) {
		if (noun1 && noun2) {
			var noun1Obj = Nouns.findOne({name: noun1});
			var noun2Obj = Nouns.findOne({name: noun2});

			console.log('noun objects');
			console.log(noun1Obj);
			console.log(noun2Obj);

			var noun1Verbs = noun1Obj.verbs;
			var noun2Verbs = noun2Obj.verbs;

			var result = {};

			console.log('noun1 and noun2 defined');
			console.log('noun1');
			console.log(noun1Verbs);
			console.log('noun2');
			console.log(noun2Verbs);

			var commonDict = {};
			var noun1Dict = {};
			var noun2Dict = {};
			//See if any of the verbs in the nouns' verbs sets match to put in the result.common
			for (var key in noun1Verbs) {
				console.log('key in common ' + key);
				if (noun2Verbs[key]) {
					commonDict[key] = true;
				}
				else {
					noun1Dict[key] = true;
				}
			}

			for (var key in noun2Verbs) {
				if (!(commonDict[key])) {
					noun2Dict[key] = true;
				}
			}
			console.log('before return');
			result['common'] = commonDict;
			result[noun1] = noun1Dict;
			result[noun2] = noun2Dict;

			console.log(result);

			return result;	
		}
		else {
			if (noun1) {
				var noun1Obj = Nouns.findOne({name: noun1});
				var noun1Verbs = noun1Obj.verbs;
				return noun1Verbs;
			}
			else if (noun2) {
				var noun2Obj = Nouns.findOne({name: noun2});
				var noun2Verbs = noun2Obj.verbs;
				return noun2Verbs;
			}
			else {
				return {};
			}
		}

	}
});