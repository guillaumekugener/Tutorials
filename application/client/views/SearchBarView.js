var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var InputSurface  = require('famous/surfaces/InputSurface');

SearchBarView = function () {
    View.apply(this, arguments);

    _createSearchSurfaces.call(this);
    _addListeners.call(this);
}

function _createSearchSurfaces() {
	this.searchBarSurface = new InputSurface({
		size: [undefined, 25],
		classes: ['searchBar']
	});

	this.searchBarSurface.setProperties({borderRadius: '12.5px'});

	this.add(this.searchBarSurface);
}

/*
* Add listeners to the input surface, specifically, onkeyup, and then fire an event that notifies
* views with the SearchBarView that the user has entered data
*/
function _addListeners() {
	//For some reason the listener is called keyup instead of onkeyup...
	this.searchBarSurface.on('keyup', function() {
		this._eventOutput.emit('userSearched');
	}.bind(this));
}

SearchBarView.prototype = Object.create(View.prototype);
SearchBarView.prototype.constructor = SearchBarView;

SearchBarView.prototype.setSize = function(size) {
	this.searchBarSurface.setSize(size);
}

SearchBarView.prototype.getContent = function() {
	return this.searchBarSurface.getValue();
}

/*
* Set the placeholder for the searchbar
*/
SearchBarView.prototype.setPlaceholder = function(placeholder) {
	this.searchBarSurface.setPlaceholder(placeholder);
}

/*
* Sets the style properties of the search bar
*/
SearchBarView.prototype.changeProperties = function(properties) {
	var propertiesToSet = {};

	if (properties.fontSize) {
		propertiesToSet.fontSize = properties.fontSize;
	}

	if (properties.height) {
		this.searchBarSurface.setSize([undefined, properties.height])
	}

	if (properties.borderRadius) {
		propertiesToSet.borderRadius = properties.borderRadius;
	}

	console.log(propertiesToSet);
	this.searchBarSurface.setProperties(propertiesToSet);
}

SearchBarView.DEFAULT_OPTIONS = {};