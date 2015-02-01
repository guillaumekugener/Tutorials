var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var Lightbox      = require('famous/views/Lightbox');

ApplicationHomeView = function () {
    View.apply(this, arguments);

    _createLightBox.call(this);
    _addLoginView.call(this);
    _addTutorialApplication.call(this);
    _addListeners.call(this);
}

/*
* Create the lightbox that will display the tutorial application after that the user has logged in
* or created an account
*/
function _createLightBox() {
	this.applicationLightbox = new Lightbox(this.options.lightboxOpts);

	this.add(this.applicationLightbox);
}

function _addTutorialApplication() {
	this.tutorialApplication = new TutorialAppHomeView();
}

function _addLoginView() {
	this.overallLoginView = new View();

	this.loginView = new LoginView([this.options.loginScreenWidth, this.options.loginScreenHeight]);

	this.loginViewModifier = new StateModifier({
		size: [this.options.loginScreenWidth, this.options.loginScreenHeight],
		align: [0.5, 0.5],
		origin: [0.5, 0.5]
	});

	this.overallLoginView.add(this.loginViewModifier).add(this.loginView);
	this.applicationLightbox.show(this.overallLoginView);
}


//The tuorials in the list should only get filled in 
function _addListeners() {
	this.loginView.on('createdAnAccount', function() {
		this.applicationLightbox.show(this.tutorialApplication);
	}.bind(this));

	this.loginView.on('loggedInAnAccount', function() {
		this.applicationLightbox.show(this.tutorialApplication);
		this.tutorialApplication.setAccountName(Meteor.user().emails[0].address);
	}.bind(this));
}

ApplicationHomeView.prototype = Object.create(View.prototype);
ApplicationHomeView.prototype.constructor = ApplicationHomeView;

ApplicationHomeView.DEFAULT_OPTIONS = {
	loginScreenWidth: 300,
	loginScreenHeight: 280,
	lightboxOpts: {
        // inTransform: Transform.translate(300, 0, 0),
        // outTransform: Transform.translate(300, 0, 0),
        // inTransition: { duration: 500, curve: Easing.outBack },
        // outTransition: { duration: 200, curve: Easing.inQuad }
	}
};