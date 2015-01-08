var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var FlexibleLayout = require('famous/views/FlexibleLayout');
var ImageSurface  = require('famous/surfaces/ImageSurface');

var views = [];

StepCreationView = function () {
    View.apply(this, arguments);

    _createBackground.call(this);
    _createLayout.call(this);

    _addItemVerbListView.call(this);
    _addGapBetweenSections.call(this);
    _addCreationCenterView.call(this);
    _addLeftBufferWithMenu.call(this);

    _createAndHidePopUp.call(this);
    _addListeners.call(this);

    this.layout.sequenceFrom(views);

}

function _createBackground() {
	var backgroundSurface = new Surface({
		size: [undefined, undefined],
		properties: {
			backgroundColor: '#4D505B'
		}
	});

	var backgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, -1)
	});

	this.add(backgroundModifier).add(backgroundSurface);
}

function _createLayout() {
	this.layout = new FlexibleLayout({
		ratios: [1, 14, 1, 4]
	});

	this.add(this.layout);

}

function _addCreationCenterView() {
	this.creationCenterView = new CreationCenterView();

	this.creationCenterViewModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		size: [undefined, undefined]
	});

	//this.add(this.creationCenterViewModifier).add(this.creationCenterView);
	views.unshift(this.creationCenterView);
}

function _addGapBetweenSections() {
	this.gapView = new View();
	 views.unshift(this.gapView);
}

function _addLeftBufferWithMenu() {
	this.leftGap = new View();

	this.menuIconSurface = new ImageSurface({
		size: [25, 25],
		content: 'img/menuIcon.png'
	});

	this.menuIconModifier = new StateModifier({
		align: [0, 0],
		origin: [0, 0],
		transform: Transform.translate(5, 5, 0)
	});

	//this.leftGap.add(this.menuIconModifier).add(this.menuIconSurface);

	views.unshift(this.leftGap);
}

function _addItemVerbListView() {


	this.itemVerbListView = new ItemVerbListView();

	this.itemVerbListViewModifier = new StateModifier({
		align: [1, 0],
		origin: [1,0],
		size: [undefined, undefined],
		transform: Transform.translate(-5, 0, 0)
	});

	//this.add(this.itemVerbListViewModifier).add(this.itemVerbListView);
	views.unshift(this.itemVerbListView);
}

function _createAndHidePopUp() {
		this.formPopUp = new AddItemOrVerbFormView();
		
		this.formPopUpModifier = new StateModifier({
			transform: Transform.translate(0, 0, 10)
		});

		this.formPopUpModifier.setVisible(false);

		this.add(this.formPopUpModifier).add(this.formPopUp);
}

function _addListeners() {
	var self = this;

	this.itemVerbListView.on('showPopUpNouns', function() {
		self.formPopUp.setType('nouns');
		self.formPopUpModifier.setVisible(true);
		self.formPopUp.additionalFieldsModifier.setVisible(true);
	}.bind(this));

	this.itemVerbListView.on('showPopUpVerbs', function() {
		self.formPopUp.setType('verbs');
		self.formPopUpModifier.setVisible(true);
		self.formPopUp.additionalFieldsModifier.setVisible(false);

	}.bind(this));

	this.itemVerbListView.on('selectedANoun', function() {
		var selectedItem = this.itemVerbListView.itemListView.getSelected();
		var surfaceToChange = this.selectedSurface;

		this.creationCenterView.setSurfaceContent(surfaceToChange, selectedItem);
	}.bind(this));

	this.itemVerbListView.on('selectedAVerb', function() {
		var selectedItem = this.itemVerbListView.verbsListView.getSelected();
		var surfaceToChange = this.selectedSurface;

		this.creationCenterView.setSurfaceContent(surfaceToChange, selectedItem);		
	}.bind(this));


	this.creationCenterView.on('createAndAddStepToTutorial', function() {
		var sentenceInfo = this.creationCenterView.getStepInformation();

		var tutorialName = self.creationCenterView.getTitle(self.creationCenterView);
		var stepNumber = this.creationCenterView.getStepNumber();

		var stepInfoToStore = {
			name: tutorialName, 
			stepNumber: stepNumber,
			item1: sentenceInfo['leftNoun'], 
			item2: sentenceInfo['rightNoun'], 
			verb: sentenceInfo['verb']
		};

		Meteor.call('addOrModifyStep', stepInfoToStore, function(error, result) {});

		this._eventOutput.emit('createdAndAddedStepToTutorial');
	}.bind(this));

	this.creationCenterView.on('clickedVerbSurface', function() {
		this.selectedSurface = 'verb';
		this.showAList('verbs');
	}.bind(this));

	this.creationCenterView.on('clickedLeftNounSurface', function() {
		this.selectedSurface = 'leftNoun';
		this.showAList('nouns');
	}.bind(this));

	this.creationCenterView.on('clickedRightNounSurface', function() {
		this.showAList('nouns');
		this.selectedSurface = 'rightNoun';
	}.bind(this));

	this.formPopUp.on('hideForm', function() {
		self.formPopUpModifier.setVisible(false);
	}.bind(this));
}

StepCreationView.prototype = Object.create(View.prototype);
StepCreationView.prototype.constructor = StepCreationView;

StepCreationView.prototype.setTitle = function(self, step, title) {
	self.creationCenterView.setTitleToSelectedStep(self.creationCenterView, step, title);
}

StepCreationView.prototype.populateWithStepInfo = function(stepInfo) {
	this.creationCenterView.populateWithStepInfo(stepInfo);
}

StepCreationView.prototype.setTutorialTitle = function(tutorialName) {
	this.creationCenterView.setTutorial(tutorialName);
}

StepCreationView.prototype.clearAllFields = function() {
	this.creationCenterView.clearAllFields();
}

StepCreationView.prototype.showAList = function(listType) {
	if (listType === 'verbs') {
		this.itemVerbListView.showVerbsListView();
	}
	else {
		this.itemVerbListView.showItemsListView();
	}
}

StepCreationView.DEFAULT_OPTIONS = {};