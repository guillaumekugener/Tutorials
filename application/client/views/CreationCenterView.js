var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var InputSurface  = require('famous/surfaces/InputSurface');
var ImageSurface  = require('famous/surfaces/ImageSurface');
var FlexibleLayout = require('famous/views/FlexibleLayout')

var buttons = [];

CreationCenterView = function () {
    View.apply(this, arguments);

    _addTitleSurface.call(this);
    _addSentenceView.call(this);
    _addDescriptionBox.call(this);
    _addDeleteAndCreateButtons.call(this);
    _addListeners.call(this);

    this.buttonsLayout.sequenceFrom(buttons);

}

function _addTitleSurface() {
	this.titleSurface = new Surface({
		content: '',
		properties: {
			textAlign: 'left',
			fontSize: '200%',
			color: 'white'
		}
	});

	this.titleModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		size: [undefined, 100]
	});

	this.add(this.titleModifier).add(this.titleSurface);
}


function _addSentenceView() {
	this.sentenceView = new SentenceView();

	this.sentenceViewModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		size: [undefined, 60],
		transform: Transform.translate(0, 100, 0)
	});

	this.add(this.sentenceViewModifier).add(this.sentenceView);
}


function _addDescriptionBox() {
	var descriptionTitleSurface = new Surface({
		content: 'Task Description',
		size: [undefined, 15],
		properties: {
			color: 'white'
		}
	});

	var descriptionTitleModifier = new StateModifier({
		align: [0, 0],
		origin: [0, 0],
		transform: Transform.translate(0, 180, 0)
	});

	this.add(descriptionTitleModifier).add(descriptionTitleSurface);

	this.stepDescriptionBoxSurface = new InputSurface({});

	var stepDescriptionBoxModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		size: [undefined, 25],
		transform: Transform.translate(0, 200, 0)
	});

	this.add(stepDescriptionBoxModifier).add(this.stepDescriptionBoxSurface);
}


function _addDeleteAndCreateButtons() {
	this.buttonsLayout = new FlexibleLayout({
		ratios: [5, 10, 5]
	});

	this.buttonsLayoutModifier = new StateModifier({
		align: [0.5, 1],
		origin: [0.5, 1],
		size: [undefined, 50]
	});

	this.add(this.buttonsLayoutModifier).add(this.buttonsLayout);

	this.deleteStepSurface = new Surface({
		size: [undefined, 40],
		content: 'Delete Step',
		properties: {
			backgroundColor: '#B6A754',
			textAlign: 'center',
			borderRadius: '10px',
			paddingTop: '10px'
		}
	});

	buttons.push(this.deleteStepSurface);

	var gapBetweenButtons = new View();

	buttons.push(gapBetweenButtons);

	this.createStepSurface = new Surface({
		size: [undefined, 40],
		content: 'Create Step',
		properties: {
			backgroundColor: '#77BA9B',
			textAlign: 'center',
			borderRadius: '10px',
			paddingTop: '10px'
		}
	});

	buttons.push(this.createStepSurface);

	this.createStepSurface.on('click', function() {
		this._eventOutput.emit('createAndAddStepToTutorial');
	}.bind(this));

	this.createStepSurface.on('mouseover', function() {
		this.createStepSurface.setProperties({'opacity': 0.5});
	}.bind(this));

	this.createStepSurface.on('mouseleave', function() {
		this.createStepSurface.setProperties({'opacity': 1});
	}.bind(this));	
}

function _addListeners() {
	this.sentenceView.on('clickedOnVerbSurface', function() {
		this._eventOutput.emit('clickedVerbSurface')
	}.bind(this));

	this.sentenceView.on('clickedOnLeftNounSurface', function() {
		this._eventOutput.emit('clickedLeftNounSurface');
	}.bind(this));

	this.sentenceView.on('clickedOnRightNounSurface', function() {
		this._eventOutput.emit('clickedRightNounSurface');
	}.bind(this));
}

CreationCenterView.prototype = Object.create(View.prototype);
CreationCenterView.prototype.constructor = CreationCenterView;

CreationCenterView.prototype.setTitleToSelectedStep = function(self, selectedStepName, selectedTutorial) {
	self.titleSurface.setContent(selectedStepName);
	self.tutorialTitle = selectedTutorial;
}

CreationCenterView.prototype.getTitle = function(self) {
	return self.tutorialTitle;
}

CreationCenterView.prototype.setTutorial = function(tutorialTitle) {
	this.tutorialTitle = tutorialTitle;
}

CreationCenterView.prototype.populateWithStepInfo = function(stepInfo) {
	this.sentenceView.populateWithStepInfoData(stepInfo);
}

CreationCenterView.prototype.clearAllFields = function() {
	this.titleSurface.setContent('New Step');
	this.sentenceView.clearAllFields();
}

CreationCenterView.prototype.getSentenceViewSurfaceSelected = function() {
	return this.sentenceView.getSelectedSurface();
}

CreationCenterView.prototype.setSurfaceContent = function(surfaceName, content) {
	this.sentenceView.setSurfaceContent(surfaceName, content);
}

CreationCenterView.prototype.getStepInformation = function() {
	return this.sentenceView.getSentenceContent();
}

CreationCenterView.prototype.getStepNumber = function() {
	var stepTitle = this.titleSurface.getContent();
	var stepNumber = parseInt(stepTitle.split(' ')[1]);
	console.log(stepNumber);
	return stepNumber;
}

CreationCenterView.DEFAULT_OPTIONS = {};