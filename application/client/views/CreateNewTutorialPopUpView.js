var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var InputSurface  = require('famous/surfaces/InputSurface');

CreateNewTutorialPopUpView = function () {
    View.apply(this, arguments);
    _createFormLayout.call(this);
}

function _createFormLayout() {
	var tutorialNameLabel = new Surface({
		size: [undefined, 15],
		content: 'New tutorial name:'
	});

	var tutorialNameLabelModifier = new StateModifier({
		transform: Transform.translate(10, 0, 0)
	});

	this.add(tutorialNameLabelModifier).add(tutorialNameLabel);

	this.newTutorialNameSurface = new InputSurface({
		size: [undefined, 25],
		properties: {
			paddingLeft: '5px',
			paddingRght: '5px'
		}
	});

	this.newTutorialNameModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		transform: Transform.translate(0, 30, 0)
	});

	this.add(this.newTutorialNameModifier).add(this.newTutorialNameSurface);}

CreateNewTutorialPopUpView.prototype = Object.create(View.prototype);
CreateNewTutorialPopUpView.prototype.constructor = CreateNewTutorialPopUpView;

/*
* This function is called when the finished button is clicked on the pop up.
* This function returns true or false, based on the validity of the input
* then the function returns false
*/
CreateNewTutorialPopUpView.prototype.finishedFunction = function(self) {
	var tutorialName = self.newTutorialNameSurface.getValue();

	if (tutorialName === undefined || tutorialName === '') {
		return false;
	}

	var docToInsert = {
		name: tutorialName,
		authors: {},
		description: '',
		steps: []
	}

	Meteor.call('newTutorial', docToInsert, function(error, result) {});

	return true;
}
