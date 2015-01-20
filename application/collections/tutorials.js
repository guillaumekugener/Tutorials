Tutorials = new Mongo.Collection('tutorials');

Meteor.methods({

	/*
	* The method that inserts a new element into the tutorials colleciton. The object inserted (doc) has the following
	* properties:
	* 	name -> the name of the tutorial, given on insert
	*	authors -> a set of the names of the authors of the tutorial (will be based on account usernames)
	*	description -> a description of the tutorial
	*	steps -> an array that contains all the step objects of the tutorial
	*	items -> a set of the id's of the items that can be found in this tutorial
	*	verbs -> a set of the id's of all the verbs that can be found in this tutorial
	*
	* Name and authors will have values when the tutorial is first created (and description might also have one as well)
	* but all of the other fields should be empty arrays or sets (but not undefined). Checks occur here and throw an error
	* if the information being entered is not valid
	*/
	newTutorial: function(doc) {
		check(doc.name, String);

		if (doc.name === '' || doc.name === undefined) {
			throw new Meteor.Error("no-name", "A new tutorial needs a name!");
		}

		if (Tutorials.findOne({name: doc.name}) !== undefined) {
			throw new Meteor.Error("tutorial-name-used", "A tutorial with the name \"" + doc.name + "\" already exists");
		}

		return Tutorials.insert(doc);
	},
	addOrModifyStep: function(doc) {
		var tutorialInfo = Tutorials.findOne({name: doc.name});
		var previousSteps = tutorialInfo.steps;

		if (typeof doc.stepNumber === 'number' && doc.stepNumber < previousSteps.length) {
			previousSteps[doc.stepNumber] = {item1: doc.item1, item2: doc.item2, verb: doc.verb};
		}
		else {
			previousSteps.push({item1: doc.item1, item2: doc.item2, verb: doc.verb});
		}
		var newInfo = {name: doc.name, steps: previousSteps}

		Tutorials.update({name: doc.name}, newInfo);
	},
	getTutorialSteps: function(tutorialName) {
		var tutorial = Tutorials.findOne({name: tutorialName});
		return tutorial.steps;
	},
	getTutorialHomeScreenInfo: function(tutorialName) {
		return Tutorials.findOne({name: tutorialName});
	}
});