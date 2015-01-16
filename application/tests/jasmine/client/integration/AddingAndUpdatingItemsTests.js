describe("create a new item and add it to the database", function() {
	it("should be created with a name", function() {
		spyOn(Nouns, "insert");

		var newItemInfo = {
			name: "PSoC 5"
		};

		Meteor.call("newItem", newItemInfo, function(error, result) {} );

		expect(Nouns.insert).toBeCalledWith({name: "PSoC 5"});

		var blankItemInfo = {
			name: ""
		}

		Meteor.call("newItem", blankItemInfo, function(error, result) {
			expect(error).not.toBe(undefined);
		});

		var undefinedItemInfo = {
			name: undefined
		}

		Meteor.call("newItem", undefinedItemInfo, function(error, result) {
			expect(error).not.toBe(undefined);
		});
	});
});