var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var InputSurface = require('famous/surfaces/InputSurface');

/*
* The view that appears when the uerse first accesses the site without being logged in to an account.
* Here they will have the opportunity to login or to create an account in order to login
*/
LoginView = function () {
    View.apply(this, arguments);

    _addBackgroundSurface.call(this);
    _topLoginViewTitleSurface.call(this);
    _addUsernameInputSurface.call(this);
    _addPasswordInputSurface.call(this);
    _addVerificationSurface.call(this);
    _addSignUpAndLoginButtons.call(this);

    _addListeners.call(this);
}

/*
* Create the background of the login screen
*/
function _addBackgroundSurface() {
	var backgroundSurface = new Surface({
		properties: {
			backgroundColor: 'grey',
			border: '1px solid black'
		}
	});

	var backgroundModifier = new StateModifier({
		size: [undefined, undefined],
		transform: Transform.translate(0, 0, -1)
	});

	this.add(backgroundModifier).add(backgroundSurface);
}

/*
* Creates the title on the top of the form
*/
function _topLoginViewTitleSurface() {
	var memberLoginSurface = new Surface({
		content: 'account login',
		size: [undefined, 20],
		properties: {
			textAlign: 'center'
		}
	});

	this.add(memberLoginSurface);
}

/*
* Username input surface
*/
function _addUsernameInputSurface() {
	this.usernameInputSurface = new InputSurface({
		placeholder: 'username',
		size: [this.options.inputSurfaceWidth, this.options.inputSurfaceHeight],
		type: 'email'
	});

	var usernameInputModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		transform: Transform.translate(0, 40, 0)
	});

	this.add(usernameInputModifier).add(this.usernameInputSurface);
}

/*
* Add password surface
*/
function _addPasswordInputSurface() {
	this.passwordInputSurface = new InputSurface({
		placeholder: 'password',
		size: [this.options.inputSurfaceWidth, this.options.inputSurfaceHeight],
		type: 'password'
	});

	var passwordInputModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		transform: Transform.translate(0, 80, 0)
	});

	this.add(passwordInputModifier).add(this.passwordInputSurface);
}

/*
* Add verify password for signing up
*/
function _addVerificationSurface() {
	this.verificationSurface = new InputSurface({
		placeholder: 'verify password (for signing up only)',
		size: [this.options.inputSurfaceWidth, this.options.inputSurfaceHeight],
		type: 'password'
	});

	var verificationModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		transform: Transform.translate(0, 120, 0)
	});

	this.add(verificationModifier).add(this.verificationSurface);
}

/*
* Add the sign up and login buttons
*/
function _addSignUpAndLoginButtons() {
	this.loginButtonSurface = new Surface({
		content: 'login',
		size: [this.options.loginButtonsWidth, this.options.inputSurfaceHeight],
		properties: {
			textAlign: 'center',
			backgroundColor: 'green'
		}
	});

	var loginButtonModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		transform: Transform.translate(-80, 160, 0)
	});

	this.add(loginButtonModifier).add(this.loginButtonSurface);

	this.signUpButtonSurface = new Surface({
		content: 'sign up',
		size: [this.options.loginButtonsWidth, this.options.inputSurfaceHeight],
		properties: {
			textAlign: 'center',
			backgroundColor: 'blue'
		}		
	});

	var signUpButtonModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		transform: Transform.translate(80, 160, 0)
	});

	this.add(signUpButtonModifier).add(this.signUpButtonSurface);
}

function _addListeners() {
	var self = this;

	/*
	* In the case of a sign up rather than a login
	*/
	this.signUpButtonSurface.on('click', function() {
		var email = this.usernameInputSurface.getValue();
		var password = this.passwordInputSurface.getValue();
		var verification = this.verificationSurface.getValue();

		console.log('clicked sign up');
		if (password !== verification) {
			//Notify user that the password and verifier do not match
		}
		else {
			Accounts.createUser({email: email, password:password}, function(error) {
				if (error) {
					//Inform the user that account creation failed
					console.log('error');
				}
				else {
					//Success! Account has been created and the suer has logged in successfully
					//Fire the show everything event here
					console.log('account created');
					//Proceed to show the main tutorial app view
					self._eventOutput.emit('createdAnAccount');
				}
			});
		}
	}.bind(this));

	/*
	* Logging into an existing 
	*/
	this.loginButtonSurface.on('click', function() {
		var email = this.usernameInputSurface.getValue();
		var password = this.passwordInputSurface.getValue();

		Meteor.loginWithPassword(email, password, function(error) {
			if (error) {
				//Do something
			}
			else {
				//They logged in, fire the show everything event
				self._eventOutput.emit('loggedInAnAccount');
			}
		});
	}.bind(this));
}




LoginView.prototype = Object.create(View.prototype);
LoginView.prototype.constructor = LoginView;

LoginView.DEFAULT_OPTIONS = {
	inputSurfaceWidth: 250,
	inputSurfaceHeight: 20,
	loginButtonsWidth: 90
};