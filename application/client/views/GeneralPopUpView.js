var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var FlexibleLayout = require('famous/views/FlexibleLayout')

//A generic pop up view that will have several functions allowing users to customize the forms that
//are displayed. Will allow for this to be used across a variety of different apps

GeneralPopUpView = function (popUpCustomFormView) {
    View.apply(this, arguments);
    console.log(popUpCustomFormView);
    this.userMadeFormView = popUpCustomFormView;
    this.upDownFlexibleLayoutViews = [];

    _addBackground.call(this);
    _createForm.call(this);
    _addListeners.call(this);

    this.upDownFlexibleLayout.sequenceFrom(this.upDownFlexibleLayoutViews);
}

//Creates the black, transluscent background behind the pop up
function _addBackground() {
	this.backgroundSurface = new Surface({
		size: [undefined, undefined],
		properties: {
			backgroundColor: 'black'
		}
	});

	this.backgroundModifier = new StateModifier({
		align: [0.5, 0.5],
		origin: [0.5, 0.5],
		opacity: 0.5
	});

	this.add(this.backgroundModifier).add(this.backgroundSurface);
}

function _createForm() {
	this.genericFormView = new View();

	this.genericFormModifier = new StateModifier({
		align: [0.5, 0.5],
		origin: [0.5, 0.5],
		size: [400, 300],
		transform: Transform.translate(0, 0, 1)
	});

	//Create the white background for the modal view
	var backgroundSurface = new Surface({
		size: [undefined, undefined],
		properties: {
			backgroundColor: 'white',
			borderRadius: '10px'
		}
	});

	var backgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, 0)
	});

	this.genericFormView.add(backgroundModifier).add(backgroundSurface);

	//Now, create a FlexibleLayout to separate the user made form form the buttons on the bottom
	this.upDownFlexibleLayout = new FlexibleLayout({
		direction: 1,
		ratios: [8, 2]
	});

	this.upDownFlexibleLayoutModifier = new StateModifier({
		size: [undefined, undefined],
		transform: Transform.translate(0, 0, 10)
	});

	this.upDownFlexibleLayoutViews.push(this.userMadeFormView);
	//Creating the buttons! These are in their own FlexibleLayout
	//Green finished button
	var finishFormButtonSurface = new Surface({
		size: [undefined, 40],
		content: 'Finished',
		properties: {
			backgroundColor: '#77BA9B',
			textAlign: 'center',
			borderRadius: '10px',
			paddingTop: '10px'
		}
	});

	//Red cancel button
	var cancelFormButtonSurface = new Surface({
		size: [undefined, 40],
		content: 'Cancel',
		properties: {
			backgroundColor: '#B6A754',
			textAlign: 'center',
			borderRadius: '10px',
			paddingTop: '10px'
		}
	});

	var buttonViews = new FlexibleLayout({
		ratios: [1,4,1,4,1]
	});
	var buttonViewInputs = [];
	buttonViews.sequenceFrom(buttonViewInputs);

	var leftGapSurface = new Surface({
		size: [undefined, undefined]
	});

	var middleGapSurface = new Surface({
		size: [undefined, undefined]
	});
	var rightGapSurface = new Surface({
		size: [undefined, undefined]
	});

	buttonViewInputs.push(leftGapSurface);
	buttonViewInputs.push(cancelFormButtonSurface);
	buttonViewInputs.push(middleGapSurface);
	buttonViewInputs.push(finishFormButtonSurface);
	buttonViewInputs.push(rightGapSurface);

	var self = this;

	cancelFormButtonSurface.on('click', function() {
		self._eventOutput.emit('hideForm');
	}.bind(this));

	/*
	* Listener that calls the finishedFunction from the user made view. 
	* This funciton will execute some code and when that is done, it will output 'validValuesEntered'
	* (if the values that the user entered are valid) which will then trigger a listener on the
	* pop up view
	*/
	finishFormButtonSurface.on('click', function() {
		this.userMadeFormView.finishedFunction(this.userMadeFormView);
	}.bind(this));

	this.upDownFlexibleLayoutViews.push(buttonViews);

	this.genericFormView.add(this.upDownFlexibleLayoutModifier).add(this.upDownFlexibleLayout);

	this.add(this.genericFormModifier).add(this.genericFormView);
}

function _addListeners() {
	this.userMadeFormView.on('validValuesEntered', function() {
		this._eventOutput.emit('finishedForm');
		this._eventOutput.emit('hideForm');
	}.bind(this));
}

GeneralPopUpView.prototype = Object.create(View.prototype);
GeneralPopUpView.prototype.constructor = GeneralPopUpView;

GeneralPopUpView.prototype.getFieldInfo = function() {
	return this.userMadeFormView.getFieldInfo();
}


GeneralPopUpView.DEFAULT_OPTIONS = {};