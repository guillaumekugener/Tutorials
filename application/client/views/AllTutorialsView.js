var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var Scrollview    = require('famous/views/Scrollview');

var tutorialsToAdd = [];

AllTutorialsView = function () {
    View.apply(this, arguments);

    _createBackground.call(this);
    _addScrollview.call(this);
    _addTutorialOverviewView.call(this);

    _addListeners.call(this);

    this.tutorialsScrollview.sequenceFrom(tutorialsToAdd);

    nounsCursorToArray(
    	Tutorials.find(),
    	this
    );

    this.selected = undefined;
}

function _createBackground() {
	var backgroundSurface = new Surface({
		size: [undefined, undefined],
		properties: {
			backgroundColor: 'white',
			// border: '1px solid black'
		}
	});

	var backgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, -1)
	});

	this.add(backgroundModifier).add(backgroundSurface);

}

function _addScrollview() {
	this.tutorialsScrollview = new Scrollview();

	this.tutorialsScrollviewModifier = new StateModifier({
		size: [this.options.widthOfListedTutorials, undefined],
		origin: [0, 0],
		align: [0, 0],
		transform: Transform.translate(0, 0, 1)
	});

	this.add(this.tutorialsScrollviewModifier).add(this.tutorialsScrollview);
}

function _addTutorialOverviewView () {
	this.tutorialOverviewView = new TutorialOverviewView();

	this.tutorialOverviewModifier = new StateModifier({
		size: [undefined, undefined]
	});

	this.add(this.tutorialOverviewModifier).add(this.tutorialOverviewView);
}

function _addListeners() {
	this.tutorialOverviewView.on('continueToStepsView', function() {
		this._eventOutput.emit('tutorialWasSelectedOrUnselected');
	}.bind(this));

	this.tutorialOverviewView.on('continueToTutorialPlayback', function() {
		this._eventOutput.emit('tutorialSelectedForPlayback');
	}.bind(this));
}

AllTutorialsView.prototype = Object.create(View.prototype);
AllTutorialsView.prototype.constructor = AllTutorialsView;

/*
* Add a tutorial to the scrollview
*/
AllTutorialsView.prototype.addItemToList = function(self, doc) {
	var itemSurface = new Surface({
		size: [undefined, 100],
		content: doc.name + '<br>' + '<span>The tutorial\'s description</span>',
		properties: {

		}
	});

	itemSurface.addClass('allTutorialsItem');

	itemSurface.selected = false;
	itemSurface.name = doc.name;

	//When a Tutorial is clicked on, the information displayed in the tutorial overview
	//screen changes to match the information in the tutorial
	itemSurface.on('click', function() {
		var tutorialName = itemSurface.name;

		if (self.selected !== tutorialName) {
			self.selected = tutorialName;

			Meteor.call('getTutorialHomeScreenInfo', tutorialName, function(error, result) {
				self.tutorialOverviewView.setTitleInformation({
					title: result.name,
					author: result.author,
					numberOfSteps: result.steps.length
				});

				self.tutorialOverviewView.populateList(tutorialName);
			});

			itemSurface.selected = true;
			itemSurface.setProperties({'opacity': 1});
		}
	}.bind(this));


	itemSurface.on('mouseover', function() {
		itemSurface.setProperties({'opacity': 0.5});
		// itemSurface.modifier.setTransform(Transform.translate(10, 0, 0), {
		// 	duration: 100,
		// 	curve: 'easeOut'
		// });
	}.bind(this));

	itemSurface.on('mouseleave', function() {
		itemSurface.setProperties({'opacity': 1});
		// itemSurface.modifier.setTransform(Transform.translate(0, 0, 0), {
		// 	duration: 100,
		// 	curve: 'easeOut'
		// });
	}.bind(this));

	tutorialsToAdd.push(itemSurface);
	itemSurface.pipe(self.tutorialsScrollview);
}

AllTutorialsView.prototype.getSelected = function() {
	return this.selected;
}

AllTutorialsView.prototype.getSelectedSurface = function() {
	return this.selectedSurface;
}

/*
* Clears the scrollview of all surfaces
*/
AllTutorialsView.prototype.clearListOfElements = function() {
	this.tutorialsToAdd = [];
    this.tutorialsScrollview.sequenceFrom(tutorialsToAdd);
}

//Gets all the tutorials that match the users input on the SearchBarView in the database
AllTutorialsView.prototype.getItemsMatchingSearch = function(userSearch) {
	var self = this;
	var criteria = userSearch;
	this.clearListOfElements();
	Meteor.call('getMatchingTutorials', criteria, function(error, result) {
		for (var i = 0; i< result.length; i++) {
			self.addItemToList(this, result[i]);
		}
	});
}

AllTutorialsView.DEFAULT_OPTIONS = {
	widthOfListedTutorials: 300
};