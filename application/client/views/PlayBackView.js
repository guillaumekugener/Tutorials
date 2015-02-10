var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var FlexibleLayout = require('famous/views/FlexibleLayout');
var ImageSurface = require('famous/surfaces/ImageSurface');

/*
* This views is very similar to the step creation view but it excludes some buttons and
* does not allow for any edits
*/
PlayBackView = function () {
    View.apply(this, arguments);

    this.bufferAmount = 0;
    this.tutorialTitle = undefined;
    this.currentStep = undefined;
    this.totalSteps = undefined;

    _createBackground.call(this);
    _createTitle.call(this);
    _createTaskDescription.call(this);
    _createSentenceView.call(this);
}

/*
* Create the white background surface at the top of the screen
*/
function _createBackground() {
	var backgroundSurface = new Surface({
		properties: {
			backgroundColor: 'white'
		}
	});

	var backgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, 1)
	});

	this.add(backgroundModifier).add(backgroundSurface);
}

/*
* Create the title surface at the top of the screen
*/
function _createTitle() {
	this.titleSurface = new Surface({
		content: '',
		size: [undefined, this.options.titleSize]
	});

	this.bufferAmount += this.options.bufferSize;
	var titleSurfaceModifier = new StateModifier({
		transform: Transform.translate(0, this.bufferAmount, 2)
	});

	this.add(titleSurfaceModifier).add(this.titleSurface);
}

/*
* Creates the surface where the description of the task will be displayed
*/
function _createTaskDescription() {
	this.descriptionSurface = new Surface({
		content: '',
		size: [undefined, this.options.descriptionSize]
	});

	this.bufferAmount += this.options.descriptionSize + this.options.bufferSize;

	var descriptionModifier = new StateModifier({
		transform: Transform.translate(0, this.bufferAmount, 2)
	});

	this.add(descriptionModifier).add(this.descriptionSurface);
}

/*
* Creates the sentence view in the playback view
*/
function _createSentenceView() {
	this.sentenceViewLayout = new FlexibleLayout({
		ratios: [1, 20, 1]
	});

	this.bufferAmount += this.options.sentenceViewSize + this.options.bufferSize;
	this.sentenceViewLayoutModifier = new StateModifier({
		transform: Transform.translate(0, this.bufferAmount, 2)
	});

	this.uniqueSentenceView = new SentenceView();

	var leftGap = new View();
	var rightGap = new View();

	var viewsInLayout = [];

	this.sentenceViewLayout.sequenceFrom(viewsInLayout);

	viewsInLayout.push(leftGap);
	viewsInLayout.push(this.uniqueSentenceView);
	viewsInLayout.push(rightGap);

	this.add(this.sentenceViewLayoutModifier).add(this.sentenceViewLayout);

	this.uniqueSentenceView.setOnPlaybackMode(true);
}

//Need to think about how I will be doing the vertical part of the realigning (maybe a headerfooter layout....)
function _imageForTask() {
	this.taskImageSurface = new ImageSurface({
		content: '',
	});
}

PlayBackView.prototype = Object.create(View.prototype);
PlayBackView.prototype.constructor = PlayBackView;

/*
* Sets the tutorialTitle property of the view
*/
PlayBackView.prototype.setTutorialTitle = function(tutorialName) {
	this.tutorialTitle = tutorialName;
}

/*
* Sets the title of the step to whatever number is currently being viewed
*/
PlayBackView.prototype.setTitle = function(title) {
	this.titleSurface.setContent(title);
}

/*
* Sets the information in the view to the information of that tutorial's step number
*/
PlayBackView.prototype.setToStep = function(stepNumber) {
	var self = this;
	this.currentStep = stepNumber;

	var tutorialName = this.tutorialTitle;
	this.setTitle('Step ' + stepNumber);

	Meteor.call('getTutorialStepInformation', tutorialName, stepNumber, function(error, result) {
		self.populateWithStepInfo(result);
	});
}

/*
* Edits the content of the description and the sentence view to contain the step information
*/
PlayBackView.prototype.populateWithStepInfo = function(info) {
	this.descriptionSurface.setContent(info.description);
	this.uniqueSentenceView.populateWithStepInfoData(info);
	console.log(info);
	this.uniqueSentenceView.setSurfaceContent('leftNounSurface', info['item1']);
}

/*
* Gets the current step that the playback view is for
*/
PlayBackView.prototype.getCurrentStep = function() {
	//If the current step that the play back is on is the last one, return a flag to let the top view know
	if (this.currentStep === this.totalSteps) {
		return {
			currentStep: this.currentStep, 
			lastStep: true
		};
	}
	return {
		currentStep: this.currentStep, 
		lastStep: false
	};
}

/*
* Sets the totalSteps property of the PlayBackView to be the total number of steps that there are in this tutorial.
* This is used to know when we need to stop being able to hit the next button
*/
PlayBackView.prototype.setTotalSteps = function(totalSteps) {
	this.totalSteps = totalSteps;
	console.log(this.totalSteps);
}

PlayBackView.DEFAULT_OPTIONS = {
	titleSize: 30,
	bufferSize: 10,
	descriptionSize: 30,
	sentenceViewSize: 60
};