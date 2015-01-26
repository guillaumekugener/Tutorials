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

    _topLoginViewTitleSurface.call(this);
    _addUsernameInputSurface.call(this);
    _addPasswordInputSurface.call(this);
    _addVerificationSurface.call(this);
    _addSignUpAndLoginButtons.call(this);
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
		placeholder: 'password',
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
		contet: 'login',
		size: [this.options.loginButtonsWidth, this.options.inputSurfaceHeight],
		properties: {
			textAlign: 'center'
		}
	});

	var loginButtonModifier = new StateModifier({
		algin: [0.5, 0],
		orgin: [0.5, 0],
		transform: Transform.translate(-55, 160, 0)
	});

	this.add(loginButtonModifier).add(this.loginButtonSurface);

	this.signUpButtonSurface = new Surface({
		contet: 'sign up',
		size: [this.options.loginButtonsWidth, this.options.inputSurfaceHeight],
		properties: {
			textAlign: 'center'
		}		
	});

	var signUpButtonModifier = new StateModifier({
		algin: [0.5, 0],
		orgin: [0.5, 0],
		transform: Transform.translate(55, 160, 0)
	});

	this.add(signUpButtonModifier).add(this.signUpButtonSurface);
}

function _addListeners() {
	/*
	* In the case of a sign up rather than a login
	*/
	this.signUpButtonSurface.on('click', function() {
		var email = this.usernameInputSurface.getValue();
		var password = this.passwordInputSurface.getValue();
		var verification = this.verificationSurface.getValue();

		if (password !== verification) {
			//Notify user that the password and verifier do not match
		}
		else {
			Accounts.createUser({email: email, password:password}, function(error) {
				if (error) {
					//Inform the user that account creation failed
				}
				else {
					//Success! Account has been created and the suer has logged in successfully
					//Fire the show everything event here
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
			}
		});
	}.bind(this));
}




LoginView.prototype = Object.create(View.prototype);
LoginView.prototype.constructor = LoginView;

LoginView.DEFAULT_OPTIONS = {
	inputSurfaceWidth: 200,
	inputSurfaceHeight: 20,
	loginButtonsWidth: 90
};