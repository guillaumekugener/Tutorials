var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var InputSurface  = require('famous/surfaces/InputSurface');
var ImageSurface  = require('famous/surfaces/ImageSurface');
var FlexibleLayout = require('famous/views/FlexibleLayout');
var TextareaSurface = require('famous/surfaces/TextareaSurface');

var buttons = [];

CreationCenterView = function () {
    View.apply(this, arguments);

    this.viewsInCreationView = [];

    _createLayout.call(this);
    _addTitleSurface.call(this);
    _addDescriptionBox.call(this);
    _addSentenceView.call(this);
    _addImageDropArea.call(this);
    _addDeleteAndCreateButtons.call(this);

    _imageDropAreaListeners.call(this);
    _addListeners.call(this);

    this.buttonsLayout.sequenceFrom(buttons);
    this.layout.sequenceFrom(this.viewsInCreationView);
}

function _createLayout() {
	this.layout = new FlexibleLayout({
		direction: 1,
		ratios: [1, 5, 1, 5, 1, 5, 1, 20, 1, 5, 1]
	});

	this.add(this.layout);
}

function _addTitleSurface() {
	var gap = new View();

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

	//this.add(this.titleModifier).add(this.titleSurface);
	this.viewsInCreationView.push(gap);
	this.viewsInCreationView.push(this.titleSurface);
}


function _addSentenceView() {
	var gap = new View();

	this.sentenceView = new SentenceView();

	this.sentenceViewModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		size: [undefined, 60],
		transform: Transform.translate(0, 100, 0)
	});

	//this.add(this.sentenceViewModifier).add(this.sentenceView);
	this.viewsInCreationView.push(gap);
	this.viewsInCreationView.push(this.sentenceView);
}


function _addDescriptionBox() {
	var gap = new View();
	this.descriptionMainView = new View();

	// var descriptionTitleSurface = new Surface({
	// 	content: 'Task Description',
	// 	//size: [undefined, 15],
	// 	properties: {
	// 		color: 'white'
	// 	}
	// });

	// var descriptionTitleModifier = new StateModifier({
	// 	align: [0, 0],
	// 	origin: [0, 0],
	// 	transform: Transform.translate(0, 0, 0)
	// });

	// this.descriptionMainView.add(descriptionTitleModifier).add(descriptionTitleSurface);

	this.stepDescriptionBoxSurface = new TextareaSurface({
		placeholder: 'Enter task description here...'
	});

	var stepDescriptionBoxModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		//size: [undefined, 25],
		transform: Transform.translate(0, 0, 0)
	});

	this.descriptionMainView.add(stepDescriptionBoxModifier).add(this.stepDescriptionBoxSurface);
	
	this.viewsInCreationView.push(gap);
	this.viewsInCreationView.push(this.descriptionMainView);
}

function _addImageDropArea() {
	var gap= new View();

	this.dropSurface = new Surface({
		content: "<div id=\"dropbox\"><span id=\"droplabel\">Drop file here...</span></div><img id=\"preview\" alt=\"[preview will display here]\" class=\"dropArea\" />",
		properties: {
			backgroundColor: 'orange'
		}
	});

	this.viewsInCreationView.push(gap);
	this.viewsInCreationView.push(this.dropSurface);
}

function _imageDropAreaListeners() {
	var dropbox = this.dropSurface;

	dropbox.on("dragenter", function(evt) {
		noopHandler(evt);
	}.bind(this));

	dropbox.on("dragexit", function(evt) {
		noopHandler(evt);
	}.bind(this));

	dropbox.on("dragover", function(evt) {
		noopHandler(evt);
	}.bind(this));

	dropbox.on("drop", function(evt) {
		drop(evt);
	}.bind(this));

}

/*
* The function below are all part of the drag and drop event for the tutorial image
*/
function noopHandler(evt) {
	evt.stopPropagation();
	evt.preventDefault();
}

function drop(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files;
	var count = files.length;

	if (count > 0) {
		handleFiles(files);
	}
}

function handleFiles(files) {
	var file = files[0];

	document.getElementById("droplabel").innerHTML = "Processing...";

	var reader = new FileReader();

	reader.onload = handleReaderLoad;

	reader.readAsDataURL(file);
}

function handleReaderLoad(evt) {
	var img = document.getElementById("preview");
	img.src = evt.target.result;
}
//End of the drag and drop functions


function _addDeleteAndCreateButtons() {
	var gap = new View(); 

	this.buttonsLayout = new FlexibleLayout({
		ratios: [5, 10, 5]
	});

	this.buttonsLayoutModifier = new StateModifier({
		// align: [0.5, 1],
		// origin: [0.5, 1],
		//size: [undefined, 50]
	});

	//this.add(this.buttonsLayoutModifier).add(this.buttonsLayout);

	this.deleteStepSurface = new Surface({
		//size: [undefined, 40],
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
		//size: [undefined, 40],
		content: 'Create Step',
		properties: {
			backgroundColor: '#77BA9B',
			textAlign: 'center',
			borderRadius: '10px',
			paddingTop: '10px'
		}
	});

	buttons.push(this.createStepSurface);

	this.viewsInCreationView.push(gap);
	this.viewsInCreationView.push(this.buttonsLayout);

	var gap = new View();
	this.viewsInCreationView.push(gap);

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

CreationCenterView.prototype.setTitleToSelectedStep = function(selectedStepName, selectedTutorial) {
	this.titleSurface.setContent(selectedStepName);
	this.tutorialTitle = selectedTutorial;
}

CreationCenterView.prototype.getTitle = function() {
	return this.tutorialTitle;
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