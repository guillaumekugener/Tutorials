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
			backgroundColor: '#4D505B',
			border: '1px solid black'
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
		transform: Transform.translate(0, 0, 1)
	});

	this.add(this.tutorialsScrollviewModifier).add(this.tutorialsScrollview);
}

function _addListeners() {

}

AllTutorialsView.prototype = Object.create(View.prototype);
AllTutorialsView.prototype.constructor = AllTutorialsView;

AllTutorialsView.prototype.addItemToList = function(self, doc) {
	var itemSurface = new Surface({
		size: [undefined, 40],
		content: doc.name,
		properties: {
			backgroundColor: '#639BF1'
		}
	});

	itemSurface.selected = false;
	// itemSurface.index = tutorialsToAdd.length;

	// itemSurface.on('click', function() {
	// 	if (self.selected === undefined) {
	// 		self.selected = itemSurface.getContent();
	// 		self.selectedSurface = itemSurface;
	// 		itemSurface.selected = true;
	// 		itemSurface.setProperties({'backgroundColor':'#3B5998'});
	// 	}
	// 	else {
	// 		if (itemSurface.selected) {
	// 			itemSurface.setProperties({'backgroundColor':'#639BF1'});
	// 			itemSurface.selected = false;
	// 			self.selected = undefined;
	// 		}
	// 		else {
	// 			itemSurface.setProperties({'backgroundColor':'#639BF1'});
	// 		}
	// 	}
	// 	self._eventOutput.emit('tutorialWasSelectedOrUnselected');


	// }.bind(this));

	itemSurface.on('click', function() {
		self.selected = itemSurface.getContent();
		itemSurface.selected = true;
		self._eventOutput.emit('tutorialWasSelectedOrUnselected');
		itemSurface.setProperties({'opacity': 1});
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

AllTutorialsView.DEFAULT_OPTIONS = {};