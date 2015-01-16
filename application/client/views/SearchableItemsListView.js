var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var Scrollview    = require('famous/views/Scrollview');

/* Creates a Scrollview that has a searchbar at the top that allows users to search through
* the elements in the Scrollview
*/
SearchableItemsListView = function () {
    View.apply(this, arguments);

    this.filteredItems = [];

    _createTopOfList.call(this);
    _createScrollviewOfList.call(this);

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

	this.searchBarView = new SearchBarView();

	var searchBarViewModifier = new StateModifier({
		origin: [0.5, 0],
		align: [0.5, 0],
		transform: Transform.translate(0, 5, 1)
	});

	this.add(topBackroundSurface);
	this.add(searchBarViewModifier).add(this.searchBarView);
}

/*
* Create the scrollview that will be updating on the search criteria
*/
function _createScrollviewOfList() {
	this.filteredItemsScrollview = new Scrollview();

	var filteredItemsScrollviewModifier = new StateModifier({
		transform: Transform.translate(0, this.options.topHeaderSize, 0)
	});
}

SearchableItemsListView.prototype = Object.create(View.prototype);
SearchableItemsListView.prototype.constructor = SearchableItemsListView;

SearchableItemsListView.prototype.addItemToFilteredList = function(itemName) {

}

SearchableItemsListView.DEFAULT_OPTIONS = {
	topHeaderSize: 35
};