var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var InputSurface  = require('famous/surfaces/InputSurface');

SearchBarView = function () {
    View.apply(this, arguments);

    _createSearchSurfaces.call(this);
}

function _createSearchSurfaces() {
	this.searchBarSurface = new InputSurface({
		size: [undefined, 25]
	});

	this.add(this.searchBarSurface);
}

SearchBarView.prototype = Object.create(View.prototype);
SearchBarView.prototype.constructor = SearchBarView;

SearchBarView.prototype.setSize = function(size) {
	this.searchBarSurface.setSize(size);
}


SearchBarView.DEFAULT_OPTIONS = {};