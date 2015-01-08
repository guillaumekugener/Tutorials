var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
var Scrollview = require('famous/views/Scrollview');

/*
* The view that contains a scrollable view of all the steps in the tutorial, which can individually
* be selected for the user to see and edit or delete
*/
StepsListView = function () {
    View.apply(this, arguments);

    this.surfaces = [];
    this.scrollview = new Scrollview();

    _createBackground.call(this);
    _createLayout.call(this);
    _createHeader.call(this);
    _createScrollviewBody.call(this);
    _addListenerToForNewStepCreation.call(this);

    this.scrollview.sequenceFrom(this.surfaces);

    tutorialsCursorToArray(
    	Tutorials.find(),
    	this
    );
}

function _createBackground() {
	this.selectedStep = undefined;
	var backgroundSurface = new Surface({
		size: [undefined, undefined],
		properties: {
			backgroundColor: '#293E6A',
			borderRight: '2px solid #293E6A'
		}
	});

	this.add(backgroundSurface);
}

function _createLayout() {
	this.layout = new HeaderFooterLayout({
		headerSize: this.options.headerSize,
		footerSize: this.options.footerSize
	});

	this.add(this.layout);
}

function _createHeader() {
	var headerTitleSurface = new Surface({
		size: [undefined, undefined],
		content: 'Tutorial Steps',
		properties: {
			backgroundColor: '#293E6A',
			color: 'white',
			textAlign: 'center',
			borderRight: '2px solid #B6A754'
		}
	});

	this.layout.header.add(headerTitleSurface);
}

function _createScrollviewBody() {
	var createNewStepView = new View();

	this.createNewStepSurface = new Surface({
		size: [undefined, 40],
		content: 'Add a new step',
		properties: {
			backgroundColor: '#77BA9B',
			color: 'white'
		}
	});

	this.createNewStepSurface.modifier = new StateModifier({});

	createNewStepView.add(this.createNewStepSurface.modifier).add(this.createNewStepSurface);

	var returnToAllTutorialsViewView = new View();

	this.returnToAllTutorialsViewSurface = new Surface({
		size: [undefined, 40],
		content: 'Select a different Tutorial',
		properties: {
			backgroundColor: '#B6A754',
			color: 'white'
		}
	});

	this.returnToAllTutorialsViewSurface.modifier = new StateModifier({});

	returnToAllTutorialsViewView.add(this.returnToAllTutorialsViewSurface.modifier).add(this.returnToAllTutorialsViewSurface);

	this.createNewStepSurface.on('mouseover', function() {
		this.createNewStepSurface.setProperties({'opacity': 0.5});
		this.createNewStepSurface.modifier.setTransform(Transform.translate(10, 0, 0), {
			duration: 100,
			curve: 'easeOut'
		});
	}.bind(this));

	this.createNewStepSurface.on('mouseleave', function() {
		this.createNewStepSurface.setProperties({'opacity': 1});
		this.createNewStepSurface.modifier.setTransform(Transform.translate(0, 0, 0), {
			duration: 100,
			curve: 'easeOut'
		});
	}.bind(this));	

	this.returnToAllTutorialsViewSurface.on('mouseover', function() {
		this.returnToAllTutorialsViewSurface.setProperties({'opacity': 0.5});
		this.returnToAllTutorialsViewSurface.modifier.setTransform(Transform.translate(10, 0, 0), {
			duration: 100,
			curve: 'easeOut'
		});
	}.bind(this));

	this.returnToAllTutorialsViewSurface.on('mouseleave', function() {
		this.returnToAllTutorialsViewSurface.setProperties({'opacity': 1});
		this.returnToAllTutorialsViewSurface.modifier.setTransform(Transform.translate(0, 0, 0), {
			duration: 100,
			curve: 'easeOut'
		});
	}.bind(this));

	this.surfaces.unshift(createNewStepView);
	this.surfaces.unshift(returnToAllTutorialsViewView);
	this.createNewStepSurface.pipe(this.scrollview);
	this.returnToAllTutorialsViewSurface.pipe(this.scrollview);

	this.layout.content.add(this.scrollview);
}

function _addListenerToForNewStepCreation() {
	this.returnToAllTutorialsViewSurface.on('click', function() {
		this._eventOutput.emit('returnToAllTutorialsView');
	}.bind(this));

	this.createNewStepSurface.on('click', function() {
		var previouslySelectedIndex = this.getSelected();
		if (previouslySelectedIndex != undefined) {
			var previousSelectedView = this.surfaces[previouslySelectedIndex+1];
			var previousSelectedSurface = previousSelectedView.surface;
			//previousSelectedSurface.setProperties({'backgroundColor':'#639BF1'});
		}

		this.setSelected('new');

		this._eventOutput.emit('createANewStep');
	}.bind(this));
}



StepsListView.prototype = Object.create(View.prototype);
StepsListView.prototype.constructor = StepsListView;

StepsListView.prototype.addItemToList = function(listview, doc, index) {
	console.log(doc);
	var itemView = new View();

	var itemSurface = new Surface({
		size: [undefined, 25],
		content: 'Step ' + index,
		properties: {
			backgroundColor: '#639BF1',
			color:'white'
		}
	});

	itemSurface.modifier = new StateModifier({});

	itemSurface.select = false;

	itemView.add(itemSurface.modifier).add(itemSurface);

	itemView.surface = itemSurface;

	this.surfaces.push(itemView);
	itemSurface.pipe(this.scrollview);

	itemSurface.on('click', function() {
		var previouslySelectedIndex = listview.getSelected();
		if (previouslySelectedIndex !== index) {
			if (previouslySelectedIndex != undefined) {
				var previousSelectedView = listview.surfaces[previouslySelectedIndex+1];
				var previousSelectedSurface = previousSelectedView.surface;
				previousSelectedSurface.setProperties({'backgroundColor':'#639BF1'});
			}
			console.log(itemSurface);
			itemSurface.setProperties({'backgroundColor':'#3B5998'});
			listview.setSelected(listview, index);
			listview._eventOutput.emit('stepSelectedOrUnselected');
		}
	});

	itemSurface.on('mouseover', function() {
		itemSurface.setProperties({'opacity': 0.5});
		itemSurface.modifier.setTransform(Transform.translate(10, 0, 0), {
			duration: 100,
			curve: 'easeOut'
		});
	}.bind(this));

	itemSurface.on('mouseleave', function() {
		itemSurface.setProperties({'opacity': 1});
		itemSurface.modifier.setTransform(Transform.translate(0, 0, 0), {
			duration: 100,
			curve: 'easeOut'
		});
	}.bind(this));
}

StepsListView.prototype.changeSteps = function(listview, steps) {
	listview.selectedStep = undefined;
	for (var i =0; i < steps.length; i++) {
		listview.addItemToList(listview, steps[i], i);
	}
}

StepsListView.prototype.setSelected = function(self, stepNumber) {
	self.selectedStep = stepNumber;
}

StepsListView.prototype.getSelected = function() {
	return this.selectedStep;
}

StepsListView.prototype.setSelectedStep = function(stepNumber) {
	this.selectedStep = stepNumber;
}

StepsListView.prototype.clearPreviousStepsList = function() {
	var firstButton = this.surfaces[0];
	var secondButton = this.surfaces[1];
	this.surfaces = [];
	this.scrollview.sequenceFrom(this.surfaces);
	this.surfaces.push(firstButton);
	firstButton.pipe(this.scrollview);
	this.surfaces.push(secondButton);
	secondButton.pipe(this.scrollview);
}

StepsListView.DEFAULT_OPTIONS = {
	headerSize: 44,
	footerSize: 0
};