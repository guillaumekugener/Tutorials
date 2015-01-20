var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var Scrollview    = require('famous/views/Scrollview');
var FlexibleLayout = require('famous/views/FlexibleLayout');

/* Creates a Scrollview that has a searchbar at the top that allows users to search through
* the elements in the Scrollview
*/
SearchableItemsListView = function () {
    View.apply(this, arguments);

    this.filteredItems = [];

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

	var leftGap = new View();
	this.searchBarView = new SearchBarView();
	var rightGap = new View();

	headerFlexLayout.sequenceFrom(headerViews);

	headerViews.push(leftGap);
	headerViews.push(this.searchBarView);
	headerViews.push(rightGap);

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

	this.filteredItems.push(itemSurface);
	itemSurface.pipe(this.filteredItemsScrollview);
}

SearchableItemsListView.prototype.clearListOfElements = function() {
	this.filteredItems = [];
	this.filteredItemsScrollview.sequenceFrom(this.filteredItems);
}

SearchableItemsListView.DEFAULT_OPTIONS = {
	topHeaderSize: 35
};