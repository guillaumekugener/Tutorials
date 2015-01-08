var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

ListBackgroundView = function () {
    View.apply(this, arguments);
}

ListBackgroundView.prototype = Object.create(View.prototype);
ListBackgroundView.prototype.constructor = ListBackgroundView;

ListBackgroundView.DEFAULT_OPTIONS = {};