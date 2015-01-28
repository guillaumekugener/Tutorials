var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var Scrollview    = require('famous/views/Scrollview');
var FlexibleLayout = require('famous/views/FlexibleLayout');
var ImageSurface  = require('famous/surfaces/ImageSurface');

/* Creates a Scrollview that has a searchbar at the top that allows users to search through
* the elements in the Scrollview
*/
SearchableItemsListView = function () {
    View.apply(this, arguments);

    this.filteredItems = [];

    this.selected = undefined;

    _createTopOfList.call(this);
    _createScrollviewOfList.call(this);
    _addListener.call(this);

    this.filteredItemsScrollview.sequenceFrom(this.filteredItems);
}

/*
* Create the top search bar area of the searchable list
*/
function _createTopOfList() {
	var topBackroundSurface = new Surface({
		size: [undefined, this.options.topHeaderSize],
		properties: {
			backgroundColor: 'blue'
		}
	});

	var headerViews = [];
	var headerFlexLayout = new FlexibleLayout({
		ratios: [1, 10, 1]
	});

	this.leftGap = new View();
	this.searchBarView = new SearchBarView();
	this.rightGap = new View();

	headerFlexLayout.sequenceFrom(headerViews);

	headerViews.push(this.leftGap);
	headerViews.push(this.searchBarView);
	headerViews.push(this.rightGap);

	var searchBarViewModifier = new StateModifier({
		// origin: [0.5, 0],
		// align: [0.5, 0],
		transform: Transform.translate(0, 5, 1)
	});

	this.add(topBackroundSurface);
	this.add(searchBarViewModifier).add(headerFlexLayout);

	topBackroundSurface.on('click', function() {
		this.getItemsMatchingSearch();
	}.bind(this));
}

/*
* Create the scrollview that will be updating on the search criteria
*/
function _createScrollviewOfList() {
	this.filteredItemsScrollview = new Scrollview();

	var filteredItemsScrollviewModifier = new StateModifier({
		transform: Transform.translate(0, this.options.topHeaderSize, 0)
	});

	this.add(filteredItemsScrollviewModifier).add(this.filteredItemsScrollview);

	var bufferTopSurface = new Surface({
		size: [undefined, 35]
	});

	//Might have to do it this way because translating items will move them off screen, so some
	//items will not be reachable in the scrollview
	// this.filteredItems.push(bufferTopSurface);
	// bufferTopSurface.pipe(this.filteredItemsScrollview);
}

function _addListener() {
	this.searchBarView.on('userSearched', function() {
		this.getItemsMatchingSearch();
	}.bind(this));
}

SearchableItemsListView.prototype = Object.create(View.prototype);
SearchableItemsListView.prototype.constructor = SearchableItemsListView;

//Gets all the items that match the users input on the SearchBarView
SearchableItemsListView.prototype.getItemsMatchingSearch = function() {
	var self = this;
	var criteria = this.searchBarView.getContent();
	this.clearListOfElements();
	Meteor.call('getAllMatchingItems', criteria, function(error, result) {
		for (var i = 0; i< result.length; i++) {
			self.addItemToFilteredList(result[i].name);
		}
	});
}

//Add an item to the SearchableListView
SearchableItemsListView.prototype.addItemToFilteredList = function(itemName) {
	var itemSurface = new Surface({
		content: itemName,
		size: [undefined, 50],
		properties: {
			textAlign: 'center',
			backgroundColor: 'cyan',
			color: 'white'
		}
	});

	itemSurface.name = itemName;

	this.filteredItems.push(itemSurface);
	itemSurface.pipe(this.filteredItemsScrollview);

	//Add an action listener on a surface for when a user wants to add it to their list
	itemSurface.on('dblclick', function() {
		console.log('dblclicked');
		this.selected = itemSurface;
		this._eventOutput.emit('userWantsToAddItem');
	}.bind(this));
}

//Clear the entire list view when an item is being 
SearchableItemsListView.prototype.clearListOfElements = function() {
	this.filteredItems = [];
	this.filteredItemsScrollview.sequenceFrom(this.filteredItems);
}

SearchableItemsListView.prototype.getAndReturnSelected = function() {
	var selected = this.selected;
	this.selected = undefined;
	return selected;
}

/*
* Set the SearchbarView's placeholder
*/
SearchableItemsListView.prototype.setPlaceholder = function(placeholder) {
	this.searchBarView.setPlaceholder(placeholder);
}

/*
* Add an icon to the right side next to the searchbar (this emits and event listener that can be used
* to execute an action on a higher level, such as adding an item to the database)
*/
SearchableItemsListView.prototype.addRightSideIcon = function(givenSource) {
	this.rightSideIcon = new ImageSurface({
		content: givenSource
	});

	var rightSideIconModifier = new StateModifier({
		size: [undefined, this.options.topHeaderSize],
		align: [0.5, 0],
		origin: [0.5, 0]
	});

	this.rightGap.add(rightSideIconModifier).add(this.rightSideIcon);

	this.rightSideIcon.on('click', function() {
		this._eventOutput.emit('searchableListRightSideIconClicked');
	}.bind(this));
}

SearchableItemsListView.DEFAULT_OPTIONS = {
	topHeaderSize: 35
};