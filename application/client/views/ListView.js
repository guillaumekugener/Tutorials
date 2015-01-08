var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var Scrollview    = require('famous/views/Scrollview');
var Draggable     = require('famous/modifiers/Draggable');

ListView = function (type) {
    View.apply(this, arguments);

    _createBackground.call(this);
    _createSearchBar.call(this);
    _createElementsScrollview.call(this);

    _addCreationListeners.call(this);



    if (type === 'nouns') {
    	nounsCursorToArray(
	    	Nouns.find(),
	    	this
	    );
    }

    if (type === 'verbs') {
    	nounsCursorToArray(
    		Verbs.find(),
    		this
    	);
    }

    this.type = type;

    this.selected = undefined;
}

function _createBackground() {
	var backgroundSurface = new Surface({
		size: [undefined, undefined],
		properties: {
			border: '1px solid black'
		}
	});

	var backgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, -1)
	});

	this.add(backgroundModifier).add(backgroundSurface);

}

function _createSearchBar() {
	var topSearchBar = new SearchBarView();

	this.searchBarModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		transform: Transform.translate(0, 5, 0)
	});

	this.add(this.searchBarModifier).add(topSearchBar);
}

function _createElementsScrollview() {
	this.createNewItemSurface = new Surface({
		size: [undefined, 25],
		content: 'Add an item',
		properties: {
			backgroundColor: '#77BA9B',
			textAlign: 'center'
		}
	});

	this.createNewItemSurface.on('mouseover', function() {
		this.createNewItemSurface.setProperties({'opacity': 0.5});
	}.bind(this));

	this.createNewItemSurface.on('mouseleave', function() {
		this.createNewItemSurface.setProperties({'opacity': 1});
	}.bind(this));

    this.elements = [];

    this.elements.push(this.createNewItemSurface);

    this.scrollview = new Scrollview();

    this.scrollview.sequenceFrom(this.elements);

    this.scrollviewModifier = new StateModifier({
    	align: [0.5, 0],
    	origin: [0.5, 0],
    	transform: Transform.translate(0, 35, 0)
    })

    this.add(this.scrollviewModifier).add(this.scrollview);
}

function _addCreationListeners() {
	var self = this;
	this.createNewItemSurface.on('click', function() {
		console.log('clicked');
		// var formPopUp = new AddItemOrVerbFormView();

		// var formPopUpModifier = new StateModifier({
		// 	transform: Transform.translate(0, 0, 10)
		// });

		// self.add(formPopUpModifier).add(formPopUp);

		this._eventOutput.emit('showPopUp');
	}.bind(this));
}

ListView.prototype = Object.create(View.prototype);
ListView.prototype.constructor = ListView;

ListView.prototype.addItemToList = function(self, doc) {
	var itemSurface = new Surface({
		size: [undefined, 25],
		content: doc.name,
		properties: {
			backgroundColor: '#639BF1'
		}
	});

	itemSurface.select = false;


	this.elements.unshift(itemSurface);
	itemSurface.pipe(this.scrollview);

	itemSurface.on('click', function() {
		if (this.selected != undefined) {
			var previouslySelectedSurface = this.selected;
			previouslySelectedSurface.setProperties({'backgroundColor':'#639BF1'});			
		}

		this.selected = itemSurface;
		// itemSurface.setProperties({'backgroundColor':'#3B5998'});

		this._eventOutput.emit('itemSelected');
	}.bind(this));

	itemSurface.on('mouseover', function() {
		itemSurface.setProperties({'opacity': 0.5});
	}.bind(this));

	itemSurface.on('mouseleave', function() {
		itemSurface.setProperties({'opacity': 1});
	}.bind(this));
}

ListView.prototype.getSelected = function() {
	return this.selected.getContent();
}

ListView.DEFAULT_OPTIONS = {};