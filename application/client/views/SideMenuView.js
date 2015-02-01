var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

/*
* SideMenuView
*
* The view that appears on the left hand side of the application when a user has selected a tutorial.
* The navigation the will occur here, for now, will only be to go 'Home,' which means back to the 
* main screen
*/
SideMenuView = function () {
    View.apply(this, arguments);

     _createBackground.call(this);
     _createMenuContent.call(this);
     _addListeners.call(this);
}

//Create the grey background that appeasr behind the navebar options
function _createBackground() {
	var backgroundSurface = new Surface({
		size: [undefined, undefined],
		properties: {
			backgroundColor: 'grey'
		}
	});

	var backgroundModifier = new StateModifier({
		transform: Transform.translate(0, 0, -10)
	});

	this.add(backgroundModifier).add(backgroundSurface);
}

/* Create the content that appears in the navigation menu. For right now, there will not be enough options
* where a scrollview would be necessary, but if that becomes necessary, pass the surfaces to a scrollview and
* remove their modifiers 
*/
function _createMenuContent() {
	//Will make this into a view once accounts is set up
	this.accountInfoSurface = new Surface({
		content: '',
		size: [undefined, 100]
	});

	this.accountInfoSurface.addClass('sideMenuOption');

	this.add(this.accountInfoSurface);

	this.homeButtonSurface = new Surface({
		content: 'Home',
		size: [undefined, 50]
	});

	this.homeButtonSurface.addClass('sideMenuOption');

	var homeButtonModifier = new StateModifier({
		transform: Transform.translate(0, 120, 0)
	});

	this.add(homeButtonModifier).add(this.homeButtonSurface);
}

//Add the listeners to the buttons created above
function _addListeners() {
	this.homeButtonSurface.on('click', function() {
		this._eventOutput.emit('homeButtonClicked');
	}.bind(this));
}

SideMenuView.prototype = Object.create(View.prototype);
SideMenuView.prototype.constructor = SideMenuView;

/*
* Set the current users name
*/
SideMenuView.prototype.setAccountName = function(name) {
	this.accountInfoSurface.setContent(name);
}


SideMenuView.DEFAULT_OPTIONS = {};