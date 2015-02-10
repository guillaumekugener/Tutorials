var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

var InputSurface = require('famous/surfaces/InputSurface');

/*
* The view that appears when the uerse first accesses the site without being logged in to an account.
* Here they will have the opportunity to login or to create an account in order to login
*/
LoginView = function (size) {
    View.apply(this, arguments);

    this.dimensions = size;

    _addBackgroundSurface.call(this);
    _topLoginViewTitleSurface.call(this);
    _addUsernameInputSurface.call(this);
    _addPasswordInputSurface.call(this);
    _addVerificationSurface.call(this);
    _addSignUpAndLoginButtons.call(this);
    _addForgotPasswordNewUserButtons.call(this);

    _addListeners.call(this);
}

/*
* Create the background of the login screen
*/
function _addBackgroundSurface() {
	var backgroundSurface = new Surface({
		properties: {
			backgroundColor: '#50BFA4',
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
		content: 'Welcome',
		size: [undefined, 20],
		properties: {
			textAlign: 'center',
			fontSize: '1.875em',
			fontStyle: 'italic',
			paddingTop: '5px',
			fontWeight: '800',
			color: 'white'
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
		type: 'email',
		classes: ['loginInputs', 'username']
	});

	//this.usernameInputSurface.addClass('username');

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
		type: 'password',
		classes: ['loginInputs', 'passwords']
	});

	//this.passwordInputSurface.addClass('passwords');


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
		placeholder: 'verify password',
		size: [this.options.inputSurfaceWidth, this.options.inputSurfaceHeight],
		type: 'password',
		classes: ['loginInputs'],
		properties: {
			visibility: 'hidden',
			borderRadius: '5px'
		}
	});

	var verificationModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		transform: Transform.translate(0, 140, 0)
	});

	this.add(verificationModifier).add(this.verificationSurface);
}

/*
* Add the sign up and login buttons
*/
function _addSignUpAndLoginButtons() {
	this.loginButtonSurface = new Surface({
		content: 'login',
		size: [this.options.inputSurfaceWidth, this.options.inputSurfaceHeight],
		properties: {
			textAlign: 'center',
			backgroundColor: '#F8C408',
			borderRadius: '5px',
			fontStyle: 'italic',
			fontSize: '1.5em',
			paddingTop: '8px'
		}
	});

	var loginButtonModifier = new StateModifier({
		align: [0.5, 0],
		origin: [0.5, 0],
		transform: Transform.translate(0, 200, 0)
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

	// this.add(signUpButtonModifier).add(this.signUpButtonSurface);
}

/*
* Add the register user button and the forgot password buttons
*/
function _addForgotPasswordNewUserButtons() {
	this.forgotPasswordButtonSurface = new Surface({
		content: 'forgot password?',
		classes: ['path']
	});

	this.forgotPasswordButtonModifier = new StateModifier({
		align: [0, 1],
		origin: [0, 1],
		transform: Transform.translate(5, this.dimensions[1]-20, 0)
	});

	this.add(this.forgotPasswordButtonModifier).add(this.forgotPasswordButtonSurface);

	this.newUserButtonSurface = new Surface({
		content: 'create an account'
	});

	this.newUserButtonSurface.addClass('path');

	this.newUserButtonModifier = new StateModifier({
		align: [1, 1],
		origin: [1, 1],
		transform: Transform.translate(this.dimensions[0]-120, this.dimensions[1]-20, 0)
	});

	this.add(this.newUserButtonModifier).add(this.newUserButtonSurface);


}

function _addListeners() {
	var self = this;

	this.passwordInputSurface.on('keyup', function(evt) {
		if (evt.keyCode === 13) {
			login(this);
		}
	}.bind(this));

	/*
	* When the user clicks on the create an account link
	*/
	this.newUserButtonSurface.on('click', function() {
		if (this.newUserButtonSurface.getContent() === 'create an account') {
			this.newUserButtonSurface.setContent('have an account');
			this.loginButtonSurface.setContent('sign up');
			this.verificationSurface.setProperties({visibility: 'visible'});
		}
		else {
			this.newUserButtonSurface.setContent('create an account');
			this.loginButtonSurface.setContent('login');
			this.verificationSurface.setProperties({visibility: 'hidden'});	
		}
		
	}.bind(this));



	/*
	* Logging into the application
	*/
	this.loginButtonSurface.on('click', function() {
		login(this);
	}.bind(this));
}

function login(self) {
	var email = self.usernameInputSurface.getValue();
	var password = self.passwordInputSurface.getValue();

	if (self.loginButtonSurface.getContent() === 'sign up') {
		var verification = self.verificationSurface.getValue();

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
	}
	else {
		Meteor.loginWithPassword(email, password, function(error) {
			if (error) {
				//Do something
				console.log(error);
				if (error.error === 403) {
					console.log('username error');
				}

				//if password error, the display something that says they entered the wrong password
				//if a username error, then tell them the user name does not exist
			}
			else {
				//They logged in, fire the show everything event
				self._eventOutput.emit('loggedInAnAccount');
			}
		});	
	}	
}


LoginView.prototype = Object.create(View.prototype);
LoginView.prototype.constructor = LoginView;

LoginView.DEFAULT_OPTIONS = {
	inputSurfaceWidth: 250,
	inputSurfaceHeight: 40,
	loginButtonsWidth: 90
};