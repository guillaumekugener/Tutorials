var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var Scrollview    = require('famous/views/Scrollview');
var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
var FlexibleLayout = require('famous/views/FlexibleLayout');
/*
* The step 0 view. Let's the user add all the items that they anticipate using in this tutorial to
* the tutorial, that way they can easily add items to their steps as necessary and easily create
* new items from exisiting items
*/
AddItemsInTutorialView = function () {
    View.apply(this, arguments);

    this.bodyFlexibleLayoutViews = [];
    this.allListedItems = [];

    _createLayouts.call(this);
    _createBodyViews.call(this);

    this.bodyFlexibleLayout.sequenceFrom(this.bodyFlexibleLayoutViews);
    this.allItemsScrollview.sequenceFrom(this.allListedItems);
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

	this.usersItemsScrollview = new SearchableItemsListView();
	this.bodyFlexibleLayoutViews.push(this.usersItemsScrollview);

	var middleGap = new View();
	this.bodyFlexibleLayoutViews.push(middleGap);

	this.allItemsScrollview = new Scrollview();
	this.bodyFlexibleLayoutViews.push(this.allItemsScrollview);

	var rightHandGap = new View();
	this.bodyFlexibleLayoutViews.push(rightHandGap);
}

AddItemsInTutorialView.prototype = Object.create(View.prototype);
AddItemsInTutorialView.prototype.constructor = AddItemsInTutorialView;

AddItemsInTutorialView.DEFAULT_OPTIONS = {
	headerSize: 20,
	footerSize: 20
};