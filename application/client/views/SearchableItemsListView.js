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
SearchableItemsListView = function (noScrollBar) {
    View.apply(this, arguments);

    this.itemsInTutorial = false;
    this.filteredItems = [];
    this.noScrollBar = noScrollBar;

    this.selected = undefined;

    //_createListBackgroundSurface.call(this);
    _createTopOfList.call(this);
    _createScrollviewOfList.call(this);
    _addListener.call(this);

    this.filteredItemsScrollview.sequenceFrom(this.filteredItems);
}

/*
* Creates the background of the SearchableList
*/
function _createListBackgroundSurface() {
	var backgroundSurface = new Surface({
		size: [undefined, undefined],
		classes: ['backgroundSurface']
	});

	var backgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, -5)
	});

	//this.add(backgroundModifier).add(backgroundSurface);
}

/*
* Create the top search bar area of the searchable list
*/
function _createTopOfList() {
	this.topBackgroundSurface = new Surface({
		size: [undefined, this.options.topHeaderSize],
		classes: ['topOfListHeader']
	});

	var topBackgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, 1)
	});

	this.add(topBackgroundModifier).add(this.topBackgroundSurface);

	if (!this.noScrollBar) {	
		var headerViews = [];
		var headerFlexLayout = new FlexibleLayout({
			ratios: [10, 1]
		});

		this.leftGap = new View();
		this.searchBarView = new SearchBarView();
		this.rightGap = new View();

		headerFlexLayout.sequenceFrom(headerViews);

		//headerViews.push(this.leftGap);
		headerViews.push(this.searchBarView);
		headerViews.push(this.rightGap);

		var searchBarViewModifier = new StateModifier({
			// origin: [0.5, 0],
			// align: [0.5, 0],
			transform: Transform.translate(5, 5, 3)
		});

		this.add(searchBarViewModifier).add(headerFlexLayout);

		// topBackgroundSurface.on('click', function() {
		// 	this.getItemsMatchingSearch();
		// }.bind(this));
	}
}

/*
* Create the scrollview that will be updating on the search criteria
*/
function _createScrollviewOfList() {
	this.filteredItemsScrollview = new Scrollview();

	this.filteredItemsScrollviewModifier = new StateModifier({
		transform: Transform.translate(0, this.options.topHeaderSize, 0)
	});

	this.add(this.filteredItemsScrollviewModifier).add(this.filteredItemsScrollview);

	var bufferTopSurface = new Surface({
		size: [undefined, this.options.topHeaderSize]
	});

	//Might have to do it this way because translating items will move them off screen, so some
	//items will not be reachable in the scrollview
	// this.filteredItems.push(bufferTopSurface);
	// bufferTopSurface.pipe(this.filteredItemsScrollview);
}

function _addListener() {
	if (!this.noScrollBar) {	
		this.searchBarView.on('userSearched', function() {
			if (!this.itemsInTutorial) {
				this.getItemsMatchingSearch();		
			}
			this._eventOutput.emit('userSearchedForItemInTutorial');

		}.bind(this));
	}
}

SearchableItemsListView.prototype = Object.create(View.prototype);
SearchableItemsListView.prototype.constructor = SearchableItemsListView;

/*
* Get the content that the user entered in the search bar
*/
SearchableItemsListView.prototype.getUsersSearchCriteria = function() {
	return this.searchBarView.getContent();
}

//Gets all the items that match the users input on the SearchBarView in the database
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
		size: [undefined, 80],
		classes: ['listElement']
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
	//Not the right check. Should check that it is of type SearchBarView
	if (this.searchBarView) {
		this.searchBarView.setPlaceholder(placeholder);
	}

}

/*
* Add an icon to the right side next to the searchbar (this emits and event listener that can be used
* to execute an action on a higher level, such as adding an item to the database)
*/
SearchableItemsListView.prototype.addRightSideIcon = function(givenSource) {
	this.rightSideIcon = new ImageSurface({
		content: givenSource
	});

	this.rightSideIconModifier = new StateModifier({
		size: [undefined, this.options.topHeaderSize],
		align: [0.5, 0],
		origin: [0.5, 0]
	});

	this.rightGap.add(this.rightSideIconModifier).add(this.rightSideIcon);

	this.rightSideIcon.on('click', function() {
		this._eventOutput.emit('searchableListRightSideIconClicked');
	}.bind(this));
}

/*
* Set to this list so that the search bar looks through items in this tutorial, not through the whole
* database
*/
SearchableItemsListView.prototype.lookThroughTutorial = function() {
	this.itemsInTutorial = true;
}

/*
* Given a properties objects with requirements, it sets the properties of the SearchableListView to the ones
* given (for example, font-size in the search bar, the size of the header, etc)
*/
SearchableItemsListView.prototype.changeProperties = function(properties) {
	console.log(properties);
	if (properties.headerSize) {
		this.topBackgroundSurface.setSize([undefined, properties.headerSize]);
		this.filteredItemsScrollviewModifier.setTransform((0, properties.headerSize, -1));
		if (this.rightSideIconModifier) {
			this.rightSideIconModifier.setSize([undefined, properties.headerSize]);
		}
	}

	if (properties.searchBarProperties) {
		var headerSize = properties.headerSize;
		properties.searchBarProperties['borderRadius'] = (1.0 * (headerSize-10)/2) + 'px';
		properties.searchBarProperties['height'] = headerSize - 10;
		this.searchBarView.changeProperties(properties.searchBarProperties);
	}
}

/*
* Adds a buffer so that the scrollview can be split into different sections
*/
SearchableItemsListView.prototype.addSeparatorToList = function(separationName) {
	var itemSurface = new Surface({
		content: separationName,
		size: [undefined, 40],
		classes: ['separationElement']
	});

	this.filteredItems.push(itemSurface);
	itemSurface.pipe(this.filteredItemsScrollview);	
}

/*
* Removes the search bar at the top of the list so that there is just a surface
*/
SearchableItemsListView.prototype.removeSearchBar = function() {
	this.topBackgroundSurface.setContent('Items in tutorial');
}

SearchableItemsListView.DEFAULT_OPTIONS = {
	topHeaderSize: 35
};