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

		if (doc.items == undefined || doc.verbs == undefined || doc.steps == undefined) {
			throw new Meteor.Error("undefined-field", "All fields must be defined!");
		}

		return Tutorials.insert(doc);
	},
	/*
	* A step is an object that has the following properties:
	*	item1 -> the name of the item that appears on the left side of the sentence
	*	item2 -> the name of the item that appears on the right side of the sentence
	*	verb -> the verb that appears in the verb slot of the SentenceView
	*	description -> a description of the task
	*	img -> the id or data for the image that appears on this step
	*/
	addOrModifyStep: function(doc) {
		var tutorialInfo = Tutorials.findOne({name: doc.name});
		var previousSteps = tutorialInfo.steps;

		console.log('modifiying... ' + (doc.stepNumber-1));

		if (typeof doc.stepNumber === 'number' && doc.stepNumber < previousSteps.length) {
			previousSteps[doc.stepNumber-1] = {
				item1: doc.item1, 
				item2: doc.item2, 
				verb: doc.verb,
				description: '',
				img: ''
			};
		}
		else {
			previousSteps.push({
				item1: doc.item1, 
				item2: doc.item2, 
				verb: doc.verb,
				description: '',
				img: ''
			});
		}
		var newInfo = {name: doc.name, steps: previousSteps}

		Tutorials.update({name: doc.name}, newInfo);
	},
	/*
	* Given the tutorial name and the step number, returns the information linked with that step
	* (information contained in the step object is described above)
	*/
	getTutorialStepInformation: function(tutorialName, stepNumber) {
		var tutorialInfo = Tutorials.findOne({name: tutorialName});
		var tutorialSteps = tutorialInfo.steps;
		var stepOfInterest = tutorialSteps[stepNumber-1];

		console.log('getting information for step ' + (stepNumber-1));

		if (stepOfInterest == undefined) {
			var blankStepInfo = {
				item1: 'Put an item here...',
				item2: 'Put an item here...',
				verb: 'Put the verb here...',
				description: '',
				img: undefined
			}

			return blankStepInfo
		}

		return stepOfInterest;
	},
	getTutorialSteps: function(tutorialName) {
		var tutorial = Tutorials.findOne({name: tutorialName});
		return tutorial.steps;
	},
	getTutorialHomeScreenInfo: function(tutorialName) {
		return Tutorials.findOne({name: tutorialName});
	},
	/*
	* Method that is given a set of items to add to the tutorials items set 
	*/
	addItemsToTutorial: function(items, tutorialName) {
		var tutorialInfo = Tutorials.findOne({name: tutorialName});
		var allItems = tutorialInfo.items;

		for (var item in items) {
			allItems[item] = true;
		}

		tutorialInfo.items = allItems;

		Tutorials.update({name: tutorialName}, tutorialInfo);
	}
});