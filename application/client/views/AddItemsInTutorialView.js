var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var Scrollview    = require('famous/views/Scrollview');
var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
var FlexibleLayout = require('famous/views/FlexibleLayout');
var ContainerSurface = require('famous/surfaces/ContainerSurface');
/*
* The step 0 view. Let's the user add all the items that they anticipate using in this tutorial to
* the tutorial, that way they can easily add items to their steps as necessary and easily create
* new items from exisiting items
*/
AddItemsInTutorialView = function () {
    View.apply(this, arguments);

    this.bodyFlexibleLayoutViews = [];
    this.usersListedItems = [];

    this.usersSetOfItems = {};
    this.tutorialName = undefined;

    _createLayouts.call(this);
    _createBodyViews.call(this);
    _createContinueToStepCreationButton.call(this);
    _addListeners.call(this);

    this.bodyFlexibleLayout.sequenceFrom(this.bodyFlexibleLayoutViews);
    this.usersItemsScrollview.sequenceFrom(this.usersListedItems);
}

/* Create the layouts that will be used to place the views
*
* In this case, a FlexibleLayout is placed inside a HeaderFooterLayout. The HeaderFooterLayout
* allows us to easily add padding on the top and the bottom of the view, while the flexible layout
* allows us to evenly space out the contents in the view.
*/
function _createLayouts() {
	this.mainOuterHeaderFooterLayout = new HeaderFooterLayout({
		headerSize: this.options.headerSize,
		footerSize: this.options.footerSize
	});

	this.bodyFlexibleLayout = new FlexibleLayout({
		ratios: [1, 20, 1, 20, 1]
	});


	this.mainOuterHeaderFooterLayout.content.add(this.bodyFlexibleLayout);
	this.add(this.mainOuterHeaderFooterLayout);
}

/* Add the views to the flexible layout. This includes three gaps, a searchable scrollview and
* a normal scrollview. The searchable scrollview will display all of the items in the database, while the
* normal scrollview will show all of the items that have been added to this tutorial so far
*/ 
function _createBodyViews() {
	var leftHandGap = new View();
	this.bodyFlexibleLayoutViews.push(leftHandGap);

	this.allItemsScrollview = new SearchableItemsListView(false);

	var randomView = new View();

	this.bodyFlexibleLayoutViews.push(this.allItemsScrollview);

	this.allItemsScrollview.setPlaceholder('search for an item in the database');
	this.allItemsScrollview.addRightSideIcon('img/plus.png');
	this.allItemsScrollview.changeProperties({
		headerSize: 50,
		searchBarProperties: {
			fontSize: '1em'
		}
	});

	var middleGap = new View();
	this.bodyFlexibleLayoutViews.push(middleGap);

	this.usersItemsScrollview = new Scrollview();
	this.bodyFlexibleLayoutViews.push(this.usersItemsScrollview);

	var rightHandGap = new View();
	this.bodyFlexibleLayoutViews.push(rightHandGap);

	this.formPopUp = new AddItemOrVerbFormView();

	this.formPopUp.setType('nouns');
	
	this.formPopUpModifier = new StateModifier({
		transform: Transform.translate(0, 0, 10)
	});

	this.formPopUpModifier.setVisible(false);

	this.add(this.formPopUpModifier).add(this.formPopUp);

	this.allItemsScrollviewModifier = new StateModifier({
		size: [500, undefined],
		transform: Transform.translate(0, 10, 1)
	});

	//this.add(this.allItemsScrollviewModifier).add(this.allItemsScrollview);
}

/*
* Creates the button on the bottom right of the screen that allows the user to continue (adding
* the items to the tutorial) onto the step creation part of the tutorial
*/
function _createContinueToStepCreationButton() {
	var continueToStepsSurface = new Surface({
		content: 'Finish with item selection!',
		size: [300, 60]
	});

	continueToStepsSurface.addClass('continuePositiveButtonSurface');

	var continueToStepsModifier = new StateModifier({
		align: [1, 0.5],
		origin: [1, 0.5],
		transform: Transform.translate(-20, 0, 0)
	});

	this.mainOuterHeaderFooterLayout.footer.add(continueToStepsModifier).add(continueToStepsSurface);

	//When the continue button is clicked, add all the users selected items to the tutorial's item list
	continueToStepsSurface.on('click', function() {
		this.addSelectedItemsToTutorial();
		this._eventOutput.emit('continueToStepCreationFromStep0');
	}.bind(this));
}

//Add the listeners to their surfaces
function _addListeners() {
	this.allItemsScrollview.on('userWantsToAddItem', function() {
		var selected = this.allItemsScrollview.getAndReturnSelected();
		this.addItemToUsersList(selected.name);
	}.bind(this));

	this.allItemsScrollview.on('searchableListRightSideIconClicked', function() {
		this.formPopUpModifier.setVisible(true);
	}.bind(this));

	this.formPopUp.on('hideForm', function() {
		this.formPopUpModifier.setVisible(false);
		//Add it to users list? Should the form actually be on the left side or should it be part of the right
		//hand side list...
	}.bind(this));
}

AddItemsInTutorialView.prototype = Object.create(View.prototype);
AddItemsInTutorialView.prototype.constructor = AddItemsInTutorialView;

//Add an item to the users list of selected items
AddItemsInTutorialView.prototype.addItemToUsersList = function(itemName) {
	if (!(itemName in this.usersSetOfItems)) {
		this.usersSetOfItems[itemName] = true;
		var itemSurface = new Surface({
			content: itemName,
			size: [undefined, 40],
			properties: {
				textAlign: 'left',
				backgroundColor: 'cyan',
				color: 'white',
				paddingLeft: '5px'
			}
		});

		var removeItemFromListSurface = new Surface({
			size: [10, 10],
			properties: {
				backgroundColor: 'red'
			}
		});

		this.removeItemFromListModifier = new StateModifier({
			align: [1, 0.5],
			origin: [1, 0.5],
			transform: Transform.translate(-5, 0, 1)
		});

		var itemView = new ContainerSurface({
			size: [undefined, 40]
		});
		itemView.add(itemSurface);
		itemView.add(this.removeItemFromListModifier).add(removeItemFromListSurface);

		this.usersListedItems.push(itemView);
		itemSurface.pipe(this.usersItemsScrollview);
	}
}

/*
* Add all of the items that the user selected to the tutorial that they just created (this is called
* once step 0 is complete)
*/
AddItemsInTutorialView.prototype.addSelectedItemsToTutorial = function() {
	//Make sure that 'item' is the name of the item and not the surface (currently, the surface)
	//Meteor.call('addItemsToTutorial', this.usersSetOfItems, this.tutorialName, function(error, result) {} );
}

/*
* Set the name of the tutorial that is currently being edited
*/
AddItemsInTutorialView.prototype.setTutorialName = function(tutorialName) {
	this.tutorialName = tutorialName;
};

AddItemsInTutorialView.DEFAULT_OPTIONS = {
	headerSize: 20,
	footerSize: 60
};