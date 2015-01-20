describe("create a new item and add it to the database", function() {
	it("should be created with a name", function() {
		spyOn(Nouns, "insert");
		spyOn(Meteor, "Error");

		var newItemInfo = {
			name: "PSoC 5"
		};

		Meteor.call("newItem", newItemInfo, function(error, result) {} );

		expect(Nouns.insert).toBeCalledWith({name: "PSoC 5"});

		//An item with a blank name should not be added to the database
		var blankItemInfo = {
			name: ""
		}
		Meteor.call("newItem", blankItemInfo, function(error, result) {});
		expect(Meteor.Errors).toHaveBeenCalled();
		expect(Nouns.insert).not.toHaveBeenCalled();


		//An item with an undefined name should not be added to the database
		var undefinedItemInfo = {
			name: undefined
		}
		Meteor.call("newItem", undefinedItemInfo, function(error, result) {} );
		expect(Meteor.Errors).toHaveBeenCalled();
		expect(Nouns.insert).not.toHaveBeenCalled();
	});
});