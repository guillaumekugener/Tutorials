var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var FlexibleLayout = require('famous/views/FlexibleLayout');

var surfaces = [];

SentenceView = function () {
    View.apply(this, arguments);


    _createLayout.call(this);
    _addSurfaces.call(this);
    _addListeners.call(this);

    this.layout.sequenceFrom(surfaces);
    this.selected = undefined;
}

function _createLayout() {
	this.layout = new FlexibleLayout({
		ratios: [15, 4, 20, 4, 15]
	});

	this.add(this.layout);
}

function _addSurfaces() {
	var leftNounView = new View();

	this.leftNounSurface = new Surface({
		size: [undefined, 50],
		content: 'Put an item here',
		properties: {
			backgroundColor: '#3B5998',
			textAlign: 'center',
			color: 'white',
			borderRadius: '10px',
			paddingTop: '15px'
		}
	});

	this.leftNounModifier = new StateModifier({});

	leftNounView.add(this.leftNounModifier).add(this.leftNounSurface);

	var rightNounView = new View();

	this.rightNounSurface = new Surface({
		size: [undefined, 50],
		content: 'Put an item here',
		properties: {
			backgroundColor: '#3B5998',
			textAlign: 'center',
			color: 'white',
			borderRadius: '10px',
			paddingTop: '15px'
		}
	});


	this.rightNounModifier = new StateModifier({});

	rightNounView.add(this.rightNounModifier).add(this.rightNounSurface);

	var verbView = new View();

	this.verbSurface = new Surface({
		size: [undefined, 50],
		content: 'Put the verb here',
		properties: {
			backgroundColor: '#639BF1',
			textAlign: 'center',
			color: 'white',
			borderRadius: '10px',
			paddingTop: '15px'
		}
	});

	this.verbModifier = new StateModifier({});

	verbView.add(this.verbModifier).add(this.verbSurface);
	var gapSurface = new Surface({});
	var gapSurface2 = new Surface({});


	surfaces.push(leftNounView);
	surfaces.push(gapSurface);
	surfaces.push(verbView);
	surfaces.push(gapSurface2);
	surfaces.push(rightNounView);
}

function _addListeners() {
	this.leftNounSurface.on('mouseover', function() {
		this.leftNounModifier.setTransform(Transform.translate(3, 3, 0), {
			duration: 200,
			curve: 'easeOut'
		});
	}.bind(this));

	this.leftNounSurface.on('mouseleave', function() {
		this.leftNounModifier.setTransform(Transform.translate(0, 0, 0), {
			duration: 200,
			curve: 'easeOut'
		});
	}.bind(this));

	this.leftNounSurface.on('click', function() {
		this.selected = 'leftNounSurface';
		this.rightNounSurface.setProperties({'border':'0px dotted white', 'paddingTop': '15px'});
		this.leftNounSurface.setProperties({'border':'5px dotted white', 'paddingTop': '10px'});
		this.verbSurface.setProperties({'border':'0px dotted white', 'paddingTop': '15px'});
		this._eventOutput.emit('clickedOnLeftNounSurface');
	}.bind(this));

	this.rightNounSurface.on('mouseover', function() {
		this.rightNounModifier.setTransform(Transform.translate(3, 3, 0), {
			duration: 200,
			curve: 'easeOut'
		});
	}.bind(this));

	this.rightNounSurface.on('mouseleave', function() {
		this.rightNounModifier.setTransform(Transform.translate(0, 0, 0), {
			duration: 200,
			curve: 'easeOut'
		});
	}.bind(this));

	this.rightNounSurface.on('click', function() {
		this.selected = 'rightNounSurface';
		this.rightNounSurface.setProperties({'border':'5px dotted white', 'paddingTop': '10px'});
		this.leftNounSurface.setProperties({'border':'0px dotted white', 'paddingTop': '15px'});
		this.verbSurface.setProperties({'border':'0px dotted white', 'paddingTop': '15px'});
		this._eventOutput.emit('clickedOnRightNounSurface');
	}.bind(this));

	this.verbSurface.on('mouseover', function() {
		this.verbModifier.setTransform(Transform.translate(3, 3, 0), {
			duration: 200,
			curve: 'easeOut'
		});
	}.bind(this));

	this.verbSurface.on('mouseleave', function() {
		this.verbModifier.setTransform(Transform.translate(0, 0, 0), {
			duration: 200,
			curve: 'easeOut'
		});
	}.bind(this));

	this.verbSurface.on('click', function() {
		this.selected = 'verbSurface';
		this.rightNounSurface.setProperties({'border':'0px dotted white', 'paddingTop': '15px'});
		this.leftNounSurface.setProperties({'border':'0px dotted white', 'paddingTop': '15px'});
		this.verbSurface.setProperties({'border':'5px dotted white', 'paddingTop': '10px'});
		this._eventOutput.emit('clickedOnVerbSurface');

	}.bind(this));
}

SentenceView.prototype = Object.create(View.prototype);
SentenceView.prototype.constructor = SentenceView;

SentenceView.prototype.populateWithStepInfoData = function(stepInfo) {
	console.log(stepInfo);
	this.leftNounSurface.setContent(stepInfo['item1']);
	this.rightNounSurface.setContent(stepInfo['item2']);
	this.verbSurface.setContent(stepInfo['verb']);
}

SentenceView.prototype.clearAllFields = function() {
	this.leftNounSurface.setContent('');
	this.rightNounSurface.setContent('');
	this.verbSurface.setContent('');
}

SentenceView.prototype.getSelectedSurface = function() {
	return this.selected;
}

SentenceView.prototype.setSurfaceContent = function(surfaceName, content) {
	if (surfaceName === 'leftNounSurface') {
		this.leftNounSurface.setContent(content);
	}
	else if (surfaceName === 'rightNounSurface') {
		this.rightNounSurface.setContent(content)
	}
	else {
		this.verbSurface.setContent(content);
	}
}

SentenceView.prototype.getSentenceContent = function() {
	//Content might be put noun here... which might be a problem or not

	var info = {
		leftNoun: this.leftNounSurface.getContent(),
		rightNoun: this.rightNounSurface.getContent(),
		verb: this.verbSurface.getContent()
	};
	return info;
}

SentenceView.DEFAULT_OPTIONS = {};