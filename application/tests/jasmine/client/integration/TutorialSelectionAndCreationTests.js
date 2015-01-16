describe("tests for tutorial creation", function() {
	it("should be created with a name", function() {
		spyOn(Tutorials, "insert");

		//Check that a tutorial with a valid name works
		var newTutorialInfo = {
			name: "Test Tutorial",
			authors: {'John Doe': true},
			description: 'Blah blah blah',
			steps: []
		};

		Meteor.call('newTutorial', newTutorialInfo, function(error, result) {} );

		expect(Tutorials.insert).toHaveBeenCalledWith({
			name: "Test Tutorial",
			authors: {'John Doe': true},
			description: 'Blah blah blah',
			steps: []
		});

		/* Check the following cases for the pop up view function:
		*	- A none blank name is valid
		*	- A blank name is not valid and returns false
		*	- An undefined name is not valid and returns false
		*/
		var popUp = new CreateNewTutorialPopUpView();

		//Famo.us InputSurface setValue function does not work properly
		popUp.newTutorialNameSurface._value = 'Tutorial Example';
		var m = popUp.finishedFunction(popUp);

		expect(m).toBe(true);

		popUp.newTutorialNameSurface._value = '';
		m = popUp.finishedFunction(popUp);

		expect(m).toBe(false);

		popUp.newTutorialNameSurface._value = undefined;
		m = popUp.finishedFunction(popUp);

		expect(m).toBe(false);
	});
});