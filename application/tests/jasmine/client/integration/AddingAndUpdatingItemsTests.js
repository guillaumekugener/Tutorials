describe("create a new item and add it to the database", function() {
	it("should be created with a name", function() {
		spyOn(Nouns, "insert");
		spyOn(Meteor, "Error");

		var newItemInfo = {
			name: "PSoC 5"
		};

		Meteor.call("newItem", newItemInfo, function(error, result) {} );

		expect(Nouns.insert).toHaveBeenCalledWith({name: "PSoC 5"});

		//An item with a blank name should not be added to the database
		var blankItemInfo = {
			name: ""
		}

		try {
			Meteor.methodMap.newItem(blankItemInfo);
		}
		catch (ex) {
			expect(ex).toBeDefined();
		}

		expect(Meteor.methodMap.newItem).toThrow();
		// Meteor.call("newItem", blankItemInfo, function(error, result) {});
		// expect(Meteor.Errors).toHaveBeenCalled();
		// expect(Nouns.insert).not.toHaveBeenCalled();


		//An item with an undefined name should not be added to the database
		var undefinedItemInfo = {
			name: undefined
		}
		Meteor.call("newItem", undefinedItemInfo, function(error, result) {} );
		expect(Meteor.Errors).toHaveBeenCalled();
		expect(Nouns.insert).not.toHaveBeenCalled();
	});

	it("the search for items should find all the items that match the regex and exluce others", function() {
		// var newItems = [
		// 	{name: 'animal'},
		// 	{name: 'bird'},
		// 	{name: 'bear'},
		// 	{name: 'lion'},
		// 	{name: 'octopus'}
		// ];

		// for (var i=0; i < newItems.length; i++) {
		// 	Nouns.insert(newItems[i]);
		// }

		// //Now run the search funciton and make sure it returns the expected results. Need to figure out how to do
		// //this while getting around the fact that Meteor.call is asynchronous
		// Meteor.call('getAllMatchingItems', 'a', function(error, result) {} );
		
		
	});
});