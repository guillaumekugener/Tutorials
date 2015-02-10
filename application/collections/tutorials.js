Tutorials = new Mongo.Collection('tutorials');

/*
* TODO: 
* - Fix the 'Put an item here...' to checking if the item is null. In case we want to change the wording, checking
*   for what is says would throw everything off.
* - Error checking for all of the functions
*
*/


Meteor.methods({

	/*
	* The method that inserts a new element into the tutorials colleciton. The object inserted (doc) has the following
	* properties:
	* 	name -> the name of the tutorial, given on insert
	*	author -> a set of the names of the authors of the tutorial (will be based on account usernames)
	*	description -> a description of the tutorial
	*	steps -> an array that contains all the step objects of the tutorial
	*	items -> a set of the id's of the items that can be found in this tutorial
	*	itemsAddedAtCreation -> a set of the names of the items that were added at the step 0 phase
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

		//Get the email address of the current user
		var user = Meteor.user();
		var author = user.emails[0].address;
		doc.author = author;

		return Tutorials.insert(doc);
	},
	/*
	* A step is an object that has the following properties:
	*	item1 -> the name of the item that appears on the left side of the sentence
	*	item2 -> the name of the item that appears on the right side of the sentence
	*	verb -> the verb that appears in the verb slot of the SentenceView
	*	description -> a description of the task
	*	img -> the id or data for the image that appears on this step
	* We also need to look at the items that the user has entred and update the items stored in the
	* tutorial
	*/
	addOrModifyStep: function(doc) {
		var tutorialInfo = Tutorials.findOne({name: doc.name});
		var previousSteps = tutorialInfo.steps;

		var items = tutorialInfo.items;
		var verbs = tutorialInfo.verbs;

		//If the user is not creating a new step, but modifying a step that was already included
		//then we need to edit this step's information
		if (previousSteps[doc.stepNumber-1] !== undefined) {
			//Remove the items that were in this step (reduce their count by one in the items dictionary)
			var prevItem1 = previousSteps[doc.stepNumber-1].item1;
			var prevItem2 = previousSteps[doc.stepNumber-1].item2;
			var prevVerb = previousSteps[doc.stepNumber-1].verb;

			if (prevItem1 !== 'Put an item here...' && prevItem1 !== undefined) {
				items[prevItem1] -= 1;
			}
			if (prevItem2 !== 'Put an item here...' && prevItem1 !== undefined) {
				items[prevItem2] -= 1;
			}

			if (prevVerb !== 'Put the verb here...' && prevItem1 !== undefined) {
				verbs[prevVerb] -= 1;
			}

			if (items[prevItem1] == 0) {
				delete items[prevItem1];
			}

			if (items[prevItem2] == 0) {
				delete items[prevItem2];
			}

			if (verbs[prevVerb] == 0) {
				delete verbs[prevVerb];
			}

			previousSteps[doc.stepNumber-1] = {
				item1: doc.item1, 
				item2: doc.item2, 
				verb: doc.verb,
				description: doc.description,
				img: ''
			};
		}
		//In the case where the user is adding a step to the tutorial (at the end)
		else {
			previousSteps.push({
				item1: doc.item1, 
				item2: doc.item2, 
				verb: doc.verb,
				description: doc.description,
				img: ''
			});
		}

		if (doc.item1 !== 'Put an item here...' && doc.item1 !== undefined) {
			//Add the items to items set for the tutorial
			if (!items[doc.item1]) {
				items[doc.item1] = 0;
			};
			items[doc.item1] += 1;
		}

		if (doc.item2 !== 'Put an item here...' && doc.item2 !== undefined) {
			//Add the items to items set for the tutorial
			if (!items[doc.item2]) {
				items[doc.item2] = 0;
			};
			items[doc.item2] += 1;
		}

		if (doc.verb !== 'Put the verb here...' && doc.item2 !== undefined) {
			//Add the verb to the verbs set for the tutorial
			if (!verbs[doc.verb]) {
				verbs[doc.verb] = 0;
			}
			verbs[doc.verb] += 1;
		}

		var newInfo = {name: doc.name, steps: previousSteps, items: items, verbs: verbs}

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

		if (stepOfInterest == undefined) {
			var blankStepInfo = {
				item1: 'Put an item here...',
				item2: 'Put an item here...',
				verb: 'Put the verb here...',
				description: null,
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

		tutorialInfo.itemsAddedAtCreation = allItems;

		Tutorials.update({name: tutorialName}, tutorialInfo);
	},
	/*
	* Given a tutorial name and a search critera, returns all of the items that fit the search criteria 
	* (currently it is a typed search rather than a properties search)
	*/
	getTutorialMatchingItems: function(tutorialName, criteria) {
		var search = new RegExp(criteria, 'i');

		var tutorialInfo = Tutorials.findOne({name: tutorialName});
		var tutorialItems = tutorialInfo.items;
		var found = [];
		for (var key in tutorialItems) {
			if (key.match(search) !== null && tutorialItems[key] > 0) {
				found.push(key);
			}
		}

		return found;
	},
	/*
	* Given a regex expression, return all of the tutorials whose names satisfy the regex
	* Will include search for authors and other similar things in the future
	*/
	getMatchingTutorials: function(criteria) {
		var search = new RegExp(criteria, 'i');

		var found = Tutorials.find({name: search}).fetch();
		return found;
	},
	/*
	* Returns the items that the user created during step 0
	*/
	getStep0Items: function(tutorialName) {
		var tutorialInfo = Tutorials.findOne({name: tutorialName});

		return tutorialInfo.itemsAddedAtCreation;
	}
});