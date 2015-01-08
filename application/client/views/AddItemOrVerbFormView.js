var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var InputSurface  = require('famous/surfaces/InputSurface');

AddItemOrVerbFormView = function () {
    View.apply(this, arguments);

    _addBackground.call(this);
    _createForm.call(this);
    _addPortField.call(this);

    this.type = undefined;
}

function _addBackground() {
	this.backgroundSurface = new Surface({
		size: [undefined, undefined],
		properties: {
			backgroundColor: 'black'
		}
	});

	this.backgroundModifier = new StateModifier({
		align: [0.5, 0.5],
		origin: [0.5, 0.5],
		opacity: 0.5
	});

	this.add(this.backgroundModifier).add(this.backgroundSurface);
}

function _createForm() {
	this.genericFormView = new View();

	this.genericFormModifier = new StateModifier({
		align: [0.5, 0.5],
		origin: [0.5, 0.5],
		size: [400, 300],
		transform: Transform.translate(0, 0, 1)
	});

	//this.add(this.genericFormModifier).add(this.genericFormView);

	var backgroundSurface = new Surface({
		size: [undefined, undefined],
		properties: {
			backgroundColor: 'white',
			borderRadius: '10px'
		}
	});

	var backgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, 0)
	});

	this.genericFormView.add(backgroundModifier).add(backgroundSurface);

	var nameInputSurface = new InputSurface({
		size: [undefined, 25]
	});

	var nameInputModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		size: [350, 25],
		transform: Transform.translate(0, 10, 5)
	});

	this.genericFormView.add(nameInputModifier).add(nameInputSurface);

	var finishFormButtonSurface = new Surface({
		size: [100, 50],
		content: 'Finished',
		properties: {
			backgroundColor: '#77BA9B',
			textAlign: 'center',
			borderRadius: '15px',
			paddingTop: '15px'			
		}
	});

	var finishFormButtonModifier = new StateModifier({
		align: [0.75, 0.8],
		origin: [0.5, 0.5],
		transform: Transform.translate(0, 10, 5)
	});

	this.genericFormView.add(finishFormButtonModifier).add(finishFormButtonSurface);

	var cancelFormButtonSurface = new Surface({
		size: [100, 50],
		content: 'Cancel',
		properties: {
			backgroundColor: '#B6A754',
			textAlign: 'center',
			borderRadius: '15px',
			paddingTop: '15px'
		}
	});

	var cancelFormButtonModifier = new StateModifier({
		align: [0.25, 0.8],
		origin: [0.5, 0.5],
		transform: Transform.translate(0, 10, 5)
	});

	this.genericFormView.add(cancelFormButtonModifier).add(cancelFormButtonSurface);

	var self = this;

	cancelFormButtonSurface.on('click', function() {
		self._eventOutput.emit('hideForm');
	}.bind(this));

	finishFormButtonSurface.on('click', function() {
		var newItemName = nameInputSurface.getValue();
		if (self.type === 'nouns') {
			var verbsUnSplit = self.addPortFieldSurface.getValue();
			var verbsArray = verbsUnSplit.split(", ");
			Meteor.call('newItem', {name: newItemName, verbs: verbsArray}, function(error, result) {
			});			

			for (var i = 0; i < verbsArray.length; i++) {
				Meteor.call('newVerb', {name: verbsArray[i]}, function(error, result) {
					
				});
			}
		}

		else {
			Meteor.call('newVerb', {name: newItemName}, function(error, result) {

			});
		}

		self._eventOutput.emit('hideForm');

	}.bind(this));

	this.add(this.genericFormModifier).add(this.genericFormView);
}

function _addPortField() {
	this.additionalFieldsView = new View();

	var headerSurface = new Surface({
		content: 'Items actions:',
		properties: {
			paddingLeft: '10px'
		}
	});

	var headerModifier = new StateModifier({
		align: [0, 0],
		origin: [0, 0],	
		size: [undefined, 25],	
	});

	this.additionalFieldsView.add(headerModifier).add(headerSurface);

	this.addPortFieldSurface = new InputSurface({
		size: [undefined, 25]
	});

	this.addPortFieldModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		size: [350, 25],
		transform: Transform.translate(0, 20, 5)
	});

	this.additionalFieldsView.add(this.addPortFieldModifier).add(this.addPortFieldSurface);

	this.additionalFieldsModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		size: [undefined, undefined],
		transform: Transform.translate(0, 40, 5)
	})

	this.genericFormView.add(this.additionalFieldsModifier).add(this.additionalFieldsView);
}

function _addListeners() {

}

AddItemOrVerbFormView.prototype = Object.create(View.prototype);
AddItemOrVerbFormView.prototype.constructor = AddItemOrVerbFormView;

AddItemOrVerbFormView.prototype.setType = function(type) {
	this.type = type;
}

AddItemOrVerbFormView.DEFAULT_OPTIONS = {};