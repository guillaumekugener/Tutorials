var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var FlexibleLayout = require('famous/views/FlexibleLayout');
var ImageSurface  = require('famous/surfaces/ImageSurface');

var views = [];

StepCreationView = function () {
    View.apply(this, arguments);

    this.currentStep = undefined;
    this.selectedSurface = undefined;

    _createBackground.call(this);
    _createLayout.call(this);

    //_addItemVerbListView.call(this);
    _addGapBetweenSections.call(this);
    _addCreationCenterView.call(this);
    _addLeftBufferWithMenu.call(this);
    _addSearchableList.call(this);

    _createAndHidePopUp.call(this);
    _addListeners.call(this);

    this.layout.sequenceFrom(views);

}

function _createBackground() {
	var backgroundSurface = new Surface({
		size: [undefined, undefined],
		properties: {
			// backgroundColor: '#4D505B'
			backgroundColor: 'white'
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

/*
* Add the list on the right hand side of the screen that will allow users to add the items that they want
*/
function _addSearchableList() {
	this.searchableList = new SearchableItemsListView(false);
	this.searchableList.setPlaceholder('');
	this.searchableList.addRightSideIcon('img/plus.png');


	this.searchableListModifier = new StateModifier({
		transform: Transform.translate(-10, 10, 0)
	});

	var overallView = new View();

	overallView.add(this.searchableListModifier).add(this.searchableList);

	views.push(overallView);
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

	//Load the content in the searchable list on the right hand side of the screen
	this.creationCenterView.on('clickedANoun', function() {
		this.searchableList.clearListOfElements();
		var tutorialName = this.creationCenterView.getTitle();
		this.searchableList.setPlaceholder('search for an item');
		Meteor.call('getTutorialMatchingItems', tutorialName, '', function(error, result) {
			for (var i = 0; i< result.length; i++) {
				self.searchableList.addItemToFilteredList(result[i]);
			}
		});
		Meteor.call('getStep0Items', tutorialName, function(error, result) {
			for (var item in result) {
				self.searchableList.addItemToFilteredList(item);
			}
		});
	}.bind(this));

	this.creationCenterView.on('clickedAVerb', function() {
		this.selectedSurface = 'verb';
		this.searchableList.clearListOfElements();
		var tutorialName = this.creationCenterView.getTitle();
		this.searchableList.setPlaceholder('search for an action verb');

		var content = this.creationCenterView.getSentenceContent();

		Meteor.call('retrieveVerbsFromNouns', content.leftNoun, content.rightNoun, function(error, result) {
			console.log(result);
			//Have to first add the common verbs to the top of the list
			self.searchableList.addSeparatorToList('in common');
			if (result) {
				for (var key in result.common) {
					self.searchableList.addItemToFilteredList(key);
				}				
			}

			if (content.leftNoun) {
				self.searchableList.addSeparatorToList(content.leftNoun);
				for (var key in result[content.leftNoun]) {
					self.searchableList.addItemToFilteredList(key);
				}
			}
			if (content.rightNoun) {			
				self.searchableList.addSeparatorToList(content.rightNoun);
				for (var key in result[content.rightNoun]) {
					self.searchableList.addItemToFilteredList(key);
				}
			}
		});

	}.bind(this));

	this.searchableList.on('userWantsToAddItem', function() {
		var selectedItem = this.searchableList.getAndReturnSelected();
		var selectedSurface = this.creationCenterView.getSentenceViewSurfaceSelected();
		this.creationCenterView.setSurfaceContent(selectedSurface, selectedItem.getContent());
	}.bind(this));

	this.searchableList.on('searchableListRightSideIconClicked', function() {
		if (this.selectedSurface) {
			console.log(this.selectedSurface);
			if (this.selectedSurface === 'verb') {
				this.formPopUp.setType('verbs');
				this.formPopUpModifier.setVisible(true);
				this.formPopUp.additionalFieldsModifier.setVisible(false);
			}
			//Should be a noun in this case
			else {
				this.formPopUp.setType('nouns');
				this.formPopUpModifier.setVisible(true);
				this.formPopUp.additionalFieldsModifier.setVisible(true);
			}
		}
	}.bind(this));

	//We want to make sure that we save all of the information correctly in the database
	this.creationCenterView.on('createAndAddStepToTutorial', function() {
		var sentenceInfo = this.creationCenterView.getStepInformation();

		var tutorialName = self.creationCenterView.getTitle();
		var stepNumber = this.creationCenterView.getStepNumber();

		var stepInfoToStore = {
			name: tutorialName, 
			stepNumber: stepNumber,
			item1: sentenceInfo['leftNoun'], 
			item2: sentenceInfo['rightNoun'], 
			verb: sentenceInfo['verb']
		};

		Meteor.call('addOrModifyStep', stepInfoToStore, function(error, result) {});

		if (sentenceInfo['item1'] !== 'Put an item here' && sentenceInfo['item1'] !== undefined) {
			Meteor.call('addVerbToNoun', sentenceInfo['item1'], sentenceInfo['verb'], function(error, result) {});
		}
		if (sentenceInfo['item2'] !== 'Put an item here' && sentenceInfo['item2'] !== undefined) {
			Meteor.call('addVerbToNoun', sentenceInfo['item2'], sentenceInfo['verb'], function(error, result) {});
		}

		this._eventOutput.emit('createdAndAddedStepToTutorial');
	}.bind(this));

	this.creationCenterView.on('clickedLeftNounSurface', function() {
		this.selectedSurface = 'leftNoun';
	}.bind(this));

	this.creationCenterView.on('clickedRightNounSurface', function() {
		this.selectedSurface = 'rightNoun';
	}.bind(this));

	//When the creation for gets closed, we want to add some items to the object surfaces
	this.formPopUp.on('hideForm', function() {
		self.formPopUpModifier.setVisible(false);
		if (this.selectedSurface === 'verb') {
			var sentenceInfo = this.creationCenterView.getStepInformation();
			this.creationCenterView.setSurfaceContent('verbSurface', this.formPopUp.justEnteredText());
			if (sentenceInfo['item1'] !== 'Put an item here' && sentenceInfo['item1'] !== undefined) {
				Meteor.call('addVerbToNoun', sentenceInfo['item1'], sentenceInfo['verb'], function(error, result) {});
			}
			if (sentenceInfo['item2'] !== 'Put an item here' && sentenceInfo['item2'] !== undefined) {
				Meteor.call('addVerbToNoun', sentenceInfo['item2'], sentenceInfo['verb'], function(error, result) {});
			}
		}
	}.bind(this));
}

StepCreationView.prototype = Object.create(View.prototype);
StepCreationView.prototype.constructor = StepCreationView;

StepCreationView.prototype.setTitle = function(step, title) {
	this.creationCenterView.setTitleToSelectedStep(step, title);
}

StepCreationView.prototype.populateWithStepInfo = function(stepInfo) {
	this.creationCenterView.populateWithStepInfo(stepInfo);
}

StepCreationView.prototype.setTutorialTitle = function(tutorialName) {
	this.creationCenterView.setTutorial(tutorialName);
}

/*
* Clear all the fields in the step creation view, which means setting all of the content to be blank
* and removing the pictures that may have been added
*/
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
/*
* Sets the information in the step creation view to the information that appeasr in the tutorials first step
*/
StepCreationView.prototype.setToStep1 = function() {
	this.setToStep(1);
}

/*
* Get the current step that the user is viewing
*/
StepCreationView.prototype.getCurrentStep = function() {
	return this.currentStep;
}

/*
* Set the information that is being displayed to the stepNumber passed into the funciton
*/
StepCreationView.prototype.setToStep = function(stepNumber) {
	var self = this;

	var tutorialName = this.creationCenterView.getTitle();
	this.setTitle('Step ' + stepNumber, tutorialName);
	this.currentStep = stepNumber;

	Meteor.call('getTutorialStepInformation', tutorialName, stepNumber, function(error, result) {
		self.populateWithStepInfo(result);
		console.log(result);
	});
}

/*
* Save all of the information that the user entered for this step
*/
StepCreationView.prototype.saveStepInformation = function() {
	var stepInfo = this.creationCenterView.getStepInformation();

	stepInfo.stepNumber = this.getCurrentStep();

	Meteor.call('addOrModifyStep', stepInfo, function(error, result) {} );
	if (stepInfo['item1'] && stepInfo['verb']) {
		Meteor.call('addVerbToNoun', stepInfo['item1'], stepInfo['verb'], function(error, result) {});	
	}

	if (stepInfo['item2'] && stepInfo['verb']) {
		Meteor.call('addVerbToNoun', stepInfo['item2'], stepInfo['verb'], function(error, result) {});	
	}

}

StepCreationView.DEFAULT_OPTIONS = {};