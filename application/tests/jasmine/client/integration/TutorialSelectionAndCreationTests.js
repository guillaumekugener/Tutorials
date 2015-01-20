describe("tests for tutorial creation", function() {
	it("should be created with a name", function() {
		spyOn(Tutorials, "insert");
		spyOn(Meteor, "Error");

		//Check that a tutorial with a valid name works
		var newTutorialInfo = {
			name: "Test Tutorial",
			authors: {'John Doe': true},
			description: 'Blah blah blah',
			steps: [],
			items: {},
			verbs: {}
		};

		//Tutorial with the name above does not exist
		if (!(Tutorials.findOne({name: "Test Tutorial"}))) {
			Meteor.call('newTutorial', newTutorialInfo, function(error, result) {} );

			expect(Tutorials.insert).toHaveBeenCalledWith({
				name: "Test Tutorial",
				authors: {'John Doe': true},
				description: 'Blah blah blah',
				steps: [],
				items: {},
				verbs: {}
			});
		}

		//A tutorial being created with a name that is already in use should throw an error
		Meteor.call('newTutorial', newTutorialInfo, function(error, result) {} );
		expect(Meteor.Error).toHaveBeenCalled();

		//A tutorial with a blank name should cause an error
		newTutorialInfo.name = '';
		Meteor.call('newTutorial', newTutorialInfo, function(error, result) {} );
		expect(Meteor.Error).toHaveBeenCalled();

		//A tutorial with an undefined name should cause an error
		newTutorialInfo.name = undefined;
		Meteor.call('newTutorial', newTutorialInfo, function(error, result) {} );
		expect(Meteor.Error).toHaveBeenCalled();

	});

	it("should have at least one author (creator)", function() {
		spyOn(Tutorials, "insert");
		spyOn(Tutorials, "update");
		spyOn(Meteor, "Error");

		//A tutorial with a blank authors dicitonary should not be allowed to be created
		var newTutorialInfo = {
			name: "Test Tutorial",
			authors: {},
			description: 'Blah blah blah',
			steps: [],
			items: {},
			verbs: {}
		};

		Meteor.call('newTutorial', newTutorialInfo, function(error, result) {} );
		expect(Meteor.Error).toHaveBeenCalled();

		//Updating a tutorial such that the new information has no author should not be possible either
	})
});