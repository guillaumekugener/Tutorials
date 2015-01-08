Tutorials = new Mongo.Collection('tutorials');

Meteor.methods({
	newTutorial: function(doc) {
		return Tutorials.insert(doc);
	},
	addOrModifyStep: function(doc) {
		var tutorialInfo = Tutorials.findOne({name: doc.name});
		var previousSteps = tutorialInfo.steps;
		console.log('this is it' + doc.stepNumber);
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
	}
});