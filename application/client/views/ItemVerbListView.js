var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

ItemVerbListView = function () {
    View.apply(this, arguments);

    _addListViews.call(this);
    _outlinedInstructionsView.call(this);
    _addListeners.call(this);
}

function _addListViews() {
	this.itemListView = new ListView('nouns');

	this.itemListModifer = new StateModifier({
		align: [1, 0],
		origin: [1, 0],
		size: [undefined, undefined],
		transform: Transform.translate(0, 5, 2)
	});

	this.itemListModifer.setOpacity(0);

	this.add(this.itemListModifer).add(this.itemListView);

	this.verbsListView = new ListView('verbs');

	this.verbsListModifier = new StateModifier({
		align: [1, 0],
		origin: [1, 0],
		size: [undefined, undefined]
	});

	this.verbsListModifier.setTransform(Transform.translate(0, 5, 2));
	this.verbsListModifier.setOpacity(0);

	this.add(this.verbsListModifier).add(this.verbsListView);

}

function _outlinedInstructionsView() {
	var instructionsSurface = new Surface({
		size: [undefined, undefined],
		content: 'Click on one of the item slots or the verb slots to add or edit an item or verb!',
		properties: {
			border: '10px dashed white',
			textAlign: 'center',
			color: 'white',
			paddingTop: '20px',
			fontSize: '200%'
		}
	});

	this.instructionsModifier = new StateModifier({
		transform: Transform.translate(-5, 0, 2)
	});

	this.add(this.instructionsModifier).add(instructionsSurface);
}

function _addListeners() {
	this.itemListView.on('showPopUp', function() {
		this._eventOutput.emit('showPopUpNouns');
	}.bind(this));

	this.verbsListView.on('showPopUp', function() {
		this._eventOutput.emit('showPopUpVerbs');
	}.bind(this));

	this.itemListView.on('itemSelected', function() {
		this._eventOutput.emit('selectedANoun');
	}.bind(this));

	this.verbsListView.on('itemSelected', function() {
		this._eventOutput.emit('selectedAVerb');
	}.bind(this));

}

ItemVerbListView.prototype = Object.create(View.prototype);
ItemVerbListView.prototype.constructor = ItemVerbListView;

ItemVerbListView.prototype.showItemsListView = function() {
	this.itemListModifer.setOpacity((0), {
		duration: 300,
		curve: 'easeOut'
	});

	this.instructionsModifier.setOpacity((0), {
		duration: 300,
		curve: 'easeOut'
	});

	this.verbsListModifier.setOpacity((0), {
		duration: 300,
		curve: 'easeOut'
	});

	this.itemListModifer.setOpacity((1), {
		duration: 300,
		curve: 'easeOut'
	});

	this.instructionsModifier.setTransform(Transform.translate(0, 0, -20), {
		duration: 300,
		curve: 'easeOut'
	});

	this.verbsListModifier.setTransform(Transform.translate(0, 5, -20), {
		duration: 300,
		curve: 'easeOut'
	});

	this.itemListModifer.setTransform(Transform.translate(0, 5, 2), {
		duration: 300,
		curve: 'easeOut'
	});

}

ItemVerbListView.prototype.showVerbsListView = function() {
	this.verbsListModifier.setOpacity((0), {
		duration: 300,
		curve: 'easeOut'
	});


	this.instructionsModifier.setOpacity((0), {
		duration: 300,
		curve: 'easeOut'
	});

	this.verbsListModifier.setOpacity((1), {
		duration: 300,
		curve: 'easeOut'
	});

	this.itemListModifer.setOpacity((0), {
		duration: 300,
		curve: 'easeOut'
	});

	this.instructionsModifier.setTransform(Transform.translate(0, 0, -20), {
		duration: 300,
		curve: 'easeOut'
	});
	
	this.itemListModifer.setTransform(Transform.translate(0, 5, -20), {
		duration: 300,
		curve: 'easeOut'
	});
	
	this.verbsListModifier.setTransform(Transform.translate(0, 5, 2), {
		duration: 300,
		curve: 'easeOut'
	});

}

ItemVerbListView.DEFAULT_OPTIONS = {};